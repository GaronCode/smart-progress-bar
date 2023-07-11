export function startTransition(
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
