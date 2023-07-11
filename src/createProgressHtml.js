import { createEl } from "./createEl.js";


export function createProgressHtml(e) {
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
