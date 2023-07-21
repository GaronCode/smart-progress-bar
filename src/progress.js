import { ClassList } from "./classList.js";
import { accFunction } from "./accFunction.js";
import { createProgressHtml } from "./createProgressHtml.js";
import { startTransition } from "./startTransition.js";

/**
 * @typedef {SmartProgressBar}
 */

/**
 * @class
 * Create instance for main progressbar
 */
export class SmartProgressElement {
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
