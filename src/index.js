import { ClassList } from "./classList.js";
import { createEl, createCircle } from "./createEl.js";
import { SmartProgressElement } from "./progress.js";
import style from "./style.css";
/**
 * @typedef {SmartProgressElement}
 */

/**
 * @class
 * create the pop-up bar with several progress elements
 */
export class SmartProgressBar {
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
        this.style = createEl(false, "style", style);
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
