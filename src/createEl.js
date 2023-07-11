export function createEl(className = "", tag = "div", text = "") {
    const e = document.createElement(tag);
    if (className) e.className = className;
    if (text) e.appendChild(document.createTextNode(text));
    return e;
}

export function createCircle(r) {
    const a = document.createElement("circle");
    a.cx = a.cy = a.r = r;
    return a;
}
