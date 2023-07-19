import Lang from './Lang';

/**
 * Creates a new translation window
 * @param {object} dims dimensions of the window
 * @param activity activity object for the translations
 */
export function createTranslationWindow(dims, activity, updateTranslationCallback) {
    const windowFeatures = `left=${dims.x},top=${dims.y},width=${dims.width},height=${dims.height}`;
    const handle = window.open(
        "/translations",
        Lang.CurrentLang.TRANSLATIONS,
        windowFeatures
    );
    if (handle) {
        handle.focus();
        handle.console = console;
        handle.activity = activity;
        handle.updateTranslation = (type, id, lang, value) => {
            if (updateTranslationCallback)
                updateTranslationCallback(type, id, lang, value);
        };
    } else {
        alert("Please allow popups for this website");
    }

    return handle;
}
