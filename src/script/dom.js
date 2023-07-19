export function applyClasses(dom, classes) {
    dom.classList.remove(...dom.classList);

    if (classes === undefined || classes === null) {
        return;
    }

    if (typeof classes === "string") {
        const list = classes.split(" ");
        dom.classList.add(...list);
    } else if (classes instanceof Array) {
        dom.classList.add(...classes);
    }
}

export function getTypedValue(value) {
    switch (value) {
    case true:
    case 'true':
        return true;
    case false:
    case 'false':
        return false;
    default:
        const nbr = Number(value);
        if (!isNaN(nbr)) return nbr;
        return value;
    }
}