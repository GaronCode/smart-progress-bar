const ClassList = {
    main: "dev-progress",
    mainSmall: "dev-progress-small",
    mainDone: "dev-progress-done",
    mainAnimationHidden: "dev-progress-before",
    mainAnimationHide: "dev-progress-before", //'dev-progress-hide'
    container: "dev-progress__container",
    card: "dev-progress__card",
    cardProgress: "dev-progress__card-progress-color",
    percent: "dev-progress__percent",
    number: "dev-progress__percent-num",
    numberText: "dev-progress__percent-a",
    headerText: "dev-progress__card-text",
    liActive: "dev-progress-li-active",
    liHidden: "dev-progress-li-hidden",
};

function createEl(className = "", tag = "div", text = "") {
    const e = document.createElement(tag);
    if (className) e.className = className;
    if (text) e.appendChild(document.createTextNode(text));
    return e;
}

function createCircle(r) {
    const a = document.createElement("circle");
    a.cx = a.cy = a.r = r;
    return a;
}

function accFunction(t) {
    const sqrt = t * t;
    return sqrt / (2 * (sqrt - t) + 1);
}

function createProgressHtml(e) {
    const c = createEl;

    const li = c("", "li");
    const name = c("", "span", e.name);
    const progress = c("", "span", e.progress);
    li.appendChild(name);
    li.appendChild(progress);

    //для плавного появления

    //------------------------------------------------

    li.addEventListener("click", () => {
        e.onclick();
    });

    return {
        container: li,
        nameEl: name,
        progressEl: progress
    };
}

function startTransition(
    el,
    classAdded,
    reverse = false,
    callback = () => {}
) {
    el.classList.add(classAdded);
    if (reverse) setTimeout(() => el.classList.remove(classAdded), 0);

    let cb = () => {
        if (cb) {
            el.removeEventListener("transitionend", cb);
            if (!reverse) el.classList.remove(classAdded);
            cb = null;
            callback();
        }
    };
    el.addEventListener("transitionend", cb);
}

/**
 * @typedef {SmartProgressBar}
 */

/**
 * @class
 * Create instance for main progressbar
 */
class SmartProgressElement {
    #animationData = {};
    #animationSpeed = 1000;

    /**
     * @param settings
     * @param {string} [settings.name] - name of progress
     * @param {SmartProgressBar} [settings.context] - main bar
     */
    constructor({ context, name }) {
        this.context = context;

        const { container, progressEl, nameEl } = createProgressHtml(this);
        this.HtmlContainer = container;
        this.HtmlProgress = progressEl;
        this.HtmlName = nameEl;

        this.name = name;
        this.show();
    }

    #animationDuration() {
        return this.#animationSpeed;
    }
    // events
    onclick() {}
    ondone() {}

    // progress
    _progress = 0;
    /**
     * Setter and getter for progress
     * @type {number}
     * @param {number}
     */
    set progress(n) {
        this.#setProgress(n);
        if (n === 100) {
            this.ondone();
        }
    }
    get progress() {
        return this._progress;
    }

    _name;
    set name(n) {
        this._name = n;
        this.HtmlName.innerText = n;
    }
    get name() {
        return this._name;
    }

    #changeMainProgress(v) {
        this.context.tryChangeProgress(this, v);
    }
    #setProgress(num) {
        num = parseInt(num);
        if (num === this.progress) return;
        const Ad = this.#animationData;

        this.#stopAnimation(Ad);

        Ad.oldVal = Ad.oldVal ? Ad.oldVal : 0;

        this._progress = num;
        Ad.needVal = num;

        if (num === 100) {
            this.#startFastAnimation(Ad);
            return;
        } else {
            this.#startSmoothAnimation(Ad);
        }
    }
    #changeHtml(val) {
        this.HtmlProgress.innerText = val + "%";
        this.#changeMainProgress(val);
    }
    #startFastAnimation(Ad) {
        let step = Math.ceil((100 - Ad.oldVal) / 8);
        Ad.timerId = setInterval(() => {
            Ad.oldVal += step;

            if (Ad.needVal <= Ad.oldVal) {
                clearInterval(Ad.timerId);
                this.#changeHtml(100);
                this.ondone();
            } else this.#changeHtml(Math.ceil(Ad.oldVal));
        }, 80);
    }
    #startSmoothAnimation(Ad) {
        const start = Ad.oldVal,
            max = Ad.needVal;
        const difference = max - start;

        const animationDurationMilli = this.#animationDuration(),
            animationSpeed = 10;

        const animationEnd = animationDurationMilli / animationSpeed;

        let i = 0;
        // таймер плавной анимации
        Ad.timerId = setInterval(() => {
            if (i === animationEnd) {
                clearInterval(Ad.timerId);
                return;
            }
            const val = Math.ceil(
                start + difference * accFunction(i++ / animationEnd)
            );
            Ad.oldVal = val;
            this.#changeHtml(val);
        }, animationSpeed);
    }
    #stopAnimation(Ad) {
        clearInterval(Ad.timerId);
    }
    /**
     * Add active class
     */
    makeActive() {
        this.HtmlContainer.classList.add(ClassList.liActive);
    }
    /**
     * Remove active class
     */
    removeActive() {
        this.HtmlContainer.classList.remove(ClassList.liActive);
    }
    /**
     * Start hide animation with callback
     * @param {function} afterAnimationDone - callback
     */
    hide(afterAnimationDone = () => {}) {
        startTransition(
            this.HtmlContainer,
            ClassList.liHidden,
            false,
            afterAnimationDone
        );
    }
    /**
     * Start show animation with callback
     * @param {function} afterAnimationDone - callback
     */
    show(afterAnimationDone = () => {}) {
        startTransition(
            this.HtmlContainer,
            ClassList.liHidden,
            true,
            afterAnimationDone
        );
    }
}

var e=[],t=[];function n(n,r){if(n&&"undefined"!=typeof document){var a,s=!0===r.prepend?"prepend":"append",d=!0===r.singleTag,i="string"==typeof r.container?document.querySelector(r.container):document.getElementsByTagName("head")[0];if(d){var u=e.indexOf(i);-1===u&&(u=e.push(i)-1,t[u]={}),a=t[u]&&t[u][s]?t[u][s]:t[u][s]=c();}else a=c();65279===n.charCodeAt(0)&&(n=n.substring(1)),a.styleSheet?a.styleSheet.cssText+=n:a.appendChild(document.createTextNode(n));}function c(){var e=document.createElement("style");if(e.setAttribute("type","text/css"),r.attributes)for(var t=Object.keys(r.attributes),n=0;n<t.length;n++)e.setAttribute(t[n],r.attributes[t[n]]);var a="prepend"===s?"afterbegin":"beforeend";return i.insertAdjacentElement(a,e),e}}

var css = ".dev-progress\n{\n    z-index: 999999;\n    position:fixed;\n    display:flex;\n    width: 100vw;\n    height: 100vh;\n    justify-content: center;\n    align-items: center;\n    transition:0.5s;\n    top: 0;\n    left: 0;\n}\n.dev-progress .dev-progress__card\n{\n    padding-top: 20px;\n    position:relative;\n    width:250px;\n    background:#003a72;\n    display:flex;\n    justify-content:center;\n    align-items:center;\n    border-radius:20px;\n    text-align:center;\n    overflow:hidden;\n    transition: all 0.5s ease-out;\n}\n.dev-progress .dev-progress__card:hover\n{\n    transform:translateY(-10px);\n    box-shadow:0 15px 35px rgba(0,0,0,.5);\n}\n.dev-progress .dev-progress__card-progress-color\n{\n    content:'';\n    position:absolute;\n    top:0;\n    left:-50%;\n    width:100%;\n    height:100%;\n    background:rgba(255,255,255,.03);\n    pointer-events:none;\n    z-index:1;\n    transition: left .3s;\n}\n\n\n\n.dev-progress .dev-progress__container {\n    width: inherit;\n}\n\n\n.dev-progress  .dev-progress__percent\n{\n    position:relative;\n    width:150px;\n    height:150px;\n    border-radius:50%;\n    box-shadow: inset 0 0 50px #000;\n    background:#6fbcf0;\n    z-index:999;\n    transition: 0.5s;\n    margin: 0 auto;\n}\n.dev-progress  .dev-progress__percent  .dev-progress__percent-num\n{\n    position:absolute;\n    top:0;\n    left:0;\n    width:100%;\n    height:100%;\n    display:flex;\n    justify-content:center;\n    align-items:center;\n    border-radius:50%;\n}\n.dev-progress  .dev-progress__percent  .dev-progress__percent-num .dev-progress__percent-a\n{\n    color:#ececec;\n    font-weight:700;\n    font-size:40px;\n    transition:0.5s;\n    user-select: none;\n    cursor: inherit;\n}\n.dev-progress .dev-progress__card:hover  .dev-progress__percent  .dev-progress__percent-num .dev-progress__percent-a\n{\n    color:#fff;\n    font-size:60px;\n}\n.dev-progress  .dev-progress__percent  .dev-progress__percent-num span\n{\n    color:#ececec;\n    font-size:24px;\n    transition:0.5s;\n}\n.dev-progress .dev-progress__card:hover  .dev-progress__percent  .dev-progress__percent-num .dev-progress__percent-a span\n{\n    color:#fff;\n}\n.dev-progress .dev-progress__card-text\n{\n    position:relative;\n    color:#ececec;\n    margin-top:20px;\n    font-weight:700;\n    font-size:18px;\n    letter-spacing:1px;\n    text-transform:uppercase;\n    transition:0.5s;\n    overflow: hidden;\n}\n.dev-progress .dev-progress__card:hover .dev-progress__card-text\n{\n    color:#fff;\n}\n.dev-progress svg\n{\n    position:relative;\n    width:150px;\n    height:150px;\n    z-index:1000;\n}\n.dev-progress svg circle\n{\n    width:100%;\n    height:100%;\n    fill:none;\n    stroke:#82c6f3;\n    stroke-width:10;\n    stroke-linecap:round;\n    transform:translate(5px,5px);\n}\n.dev-progress svg circle:nth-child(2)\n{\n    stroke-dasharray:440;\n    stroke-dashoffset:440;\n}\n.dev-progress .dev-progress__card:nth-child(1) svg circle:nth-child(2)\n{\n    stroke-dashoffset:calc(440 - (440 * 90) / 100);\n    stroke:#c2c2c2;\n}\n\n\n.dev-progress-small {\n    top: 20px;\n    width: 220px;\n    height: 300px;\n}\n\n.dev-progress-small .dev-progress__card {\n    \n    width: 200px;\n    min-height: 200px;\n}\n\n.dev-progress-small .dev-progress__card-text {\n    font-size: xx-small;\n}\n\n.dev-progress-done .dev-progress__percent {\n    background: #6da462 !important;\n}\n\n.dev-progress-done .dev-progress__card {\n    background: #1a601e !important;\n}\n\n.dev-progress-hide .dev-progress__card\n{\n    transform:translateY(100px);\n    opacity: 0;\n}\n\n.dev-progress-before .dev-progress__card\n{\n    transform:translateY(100px);\n    opacity: 0;\n}\n\n\n\n.dev-progress ul {\n    color: #c2c2c2;\n    padding: 10px;\n    font-size: smaller;\n    list-style-type: none;\n    cursor: pointer;\n    user-select: none;\n}\n\n\n\n.dev-progress li {\n    display: flex;\n    text-transform: none;\n    gap: 5px;\n    transition: all .3s;\n    margin-bottom: 5px;\n}\n\n.dev-progress li.dev-progress-li-hidden {\n    font-size: 0;\n    opacity: .5;\n    padding: 0;\n    margin: 0;\n}\n\n.dev-progress li.dev-progress-li-active {\n    color: white;\n    text-shadow: 0px 0px 2px rgba(255, 255, 255, 0.3);\n}\n\n.dev-progress li:hover {\n    text-shadow: 0px 3px 4px rgb(0, 0, 0, .5);\n}\n\n\n.dev-progress li span:first-child {\n    flex-grow: 1;\n    overflow: hidden;\n    text-align: left;\n}";
n(css,{});

/**
 * @typedef {SmartProgressElement}
 */

/**
 * @class
 * create the pop-up bar with several progress elements
 */
class SmartProgressBar {
    #whereHtml;

    #settings = {
        classes: ClassList,
        mini: false,
        activeProgress: null,
        progressList: [],
        texts: {
            headerText: "",
        },
    };

    /**
     * Create instance and html
     * @param settings -  base settings object for init bar
     * @param {string} [settings.whereSelector="body"] - selector for place modal body
     * @param {bool} [settings.show=true] - show pop-up immediately
     * @param {bool} [settings.headerText="Loading"] - displayed text
     * @param {bool} [settings.minimize=false] - display in compact size
     * @param {bool} [settings.changeSizeOnClick=true] - enable change size on click
     */
    constructor({
        whereSelector = "body",
        show = true,
        headerText = "Loading",
        minimize = false,
        changeSizeOnClick = true,
    }) {
        this.#whereHtml = document.querySelector(whereSelector);

        this.#settings.texts.headerText = headerText;
        this.#settings.changeSizeOnClick = changeSizeOnClick;

        this.#createHtml();
        this.#createEvents();
        this.#createStyle();

        if (minimize) this.minimize();
        if (show) this.show();
    }

    #createStyle() {
        this.style = createEl(false, "style", css);
    }

    #createHtml() {
        const c = createEl;

        let sc = this.#settings.classes;
        this.main = c(sc.main);
        this.card = c(sc.card);
        this.progressLine = c(sc.cardProgress);
        const div = c(sc.container);
        const percent = c(sc.percent);
        const SVG = c("", "svg");
        const cir = createCircle(70);
        const num = c(sc.number);
        const h5 = c("", "h5");
        this.progressHtml = c(sc.numberText, "span", "0");
        const span = c("", "span", "%");
        this.header = c(sc.headerText, "h5", this.#settings.texts.headerText);
        this.progressContainer = c("", "ul");

        this.main.appendChild(this.card);
        this.card.appendChild(div);
        this.card.appendChild(this.progressLine);
        div.appendChild(percent);
        div.appendChild(this.header);
        div.appendChild(this.progressContainer);
        percent.appendChild(SVG);
        percent.appendChild(num);
        SVG.appendChild(cir);
        num.appendChild(h5);

        h5.appendChild(this.progressHtml);
        h5.appendChild(span);

        return this.main;
    }
    #createEvents() {
        this.progressContainer.addEventListener("click", (e) => {
            e.stopPropagation();
        });
        if (this.#settings.changeSizeOnClick)
            this.main.addEventListener("click", () => this.minimize());
    }
    /**
     * Create new instance of SmartProgressElement, mount and return it
     * @param settings
     * @param {string} [settings.name="element"] - name of progress
     * @param {number} [settings.progress=0] - number of progress
     * @returns {SmartProgressElement}
     */
    addProgress({ name = "element", progress = 0 }) {
        const newProgress = new SmartProgressElement({ context: this, name });

        this.#settings.progressList.push(newProgress);

        newProgress.onclick = () => {
            this.makeProgressActive(newProgress);
        };

        this.progressContainer.appendChild(newProgress.HtmlContainer);
        // первоначальное инифиализация
        newProgress.progress = progress;

        if (this.#settings.progressList.length === 1)
            this.makeProgressActive(newProgress);

        return newProgress;
    }
    /**
     * Remove progress form main modal
     * @param {SmartProgressElement} progress
     */
    removeProgress(progress) {
        this.#settings.progressList.splice(
            this.#settings.progressList.indexOf(progress),
            1
        );

        if (this.#settings.activeProgress === progress) {
            this.makeProgressActive(this.#settings.progressList[0]);
        }

        progress.hide(() => {
            this.progressContainer.removeChild(progress.HtmlContainer);
        });
    }

    /**
     * Minimize or return to normal size main window
     */
    minimize() {
        if (this.#settings.mini) {
            this.main.classList.remove(this.#settings.classes.mainSmall);
            this.#settings.mini = false;
        } else {
            this.main.classList.add(this.#settings.classes.mainSmall);
            this.#settings.mini = true;
        }
    }

    _progress = 0;
    /**
     * Setter and getter for main progress
     * @type {number}
     * @param {number}
     */
    set progress(data) {
        if (data === 100)
            this.main.classList.add(this.#settings.classes.mainDone);
        else this.main.classList.remove(this.#settings.classes.mainDone);

        this._progress = data;

        this.progressLine.style.left = parseInt(-100 + data) + "%";
        this.progressHtml.innerText = data;
    }
    get progress() {
        return this._progress;
    }

    tryChangeProgress(prog, value) {
        if (this.#settings.activeProgress === prog) this.progress = value;
    }
    /**
     * All progress changes will apply to header progress
     * @param {SmartProgressElement} prog - Progress, created by addProgress()
     */
    makeProgressActive(prog) {
        if (prog === undefined) {
            this.progress = 0;
            return;
        }

        this.#settings.activeProgress = prog;
        this.#settings.progressList.forEach((e) => {
            if (e === prog) e.makeActive();
            else e.removeActive();
        });

        this.progress = prog.progress;
    }
    /**
     * Shows modal window
     */
    show() {
        if (this.isMounted) return;
        this.main.classList.add(this.#settings.classes.mainAnimationHidden);
        this.#mount();
        setTimeout(
            () =>
                this.main.classList.remove(
                    this.#settings.classes.mainAnimationHidden
                ),
            0
        );
    }
    /**
     * Hide modal window
     */
    hide() {
        if (!this.isMounted) return;
        this.main.classList.add(this.#settings.classes.mainAnimationHide);
        let listener = () => {
            this.#unmount();
            this.main.removeEventListener("transitionend", listener);
            this.main.classList.remove(
                this.#settings.classes.mainAnimationHide
            );
        };
        this.main.addEventListener("transitionend", listener);
    }
    /**
     * mounted flag
     */
    get isMounted() {
        return this.#whereHtml === this.main.parentElement;
    }

    #mount() {
        document.head.appendChild(this.style);
        this.#whereHtml.appendChild(this.main);
    }

    #unmount() {
        document.head.removeChild(this.style);
        this.#whereHtml.removeChild(this.main);
    }
}

export { SmartProgressBar };
