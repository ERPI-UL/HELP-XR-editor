import API from "./API.js";
import User from "./User.js";
import en from "../langs/en.json";
import fr from "../langs/fr.json";
import de from "../langs/de.json";

class Lang {
    static Langs = [
        {id: "ENGLISH", value: "en", data: en},
        {id: "FRENCH", value: "fr", data: fr},
        {id: "DEUTSCH", value: "de", data: de},
        {id: "DEFAULT", value: null, data: en},
    ];

    static #callbackIndex = 0;
    static #callbacks = [];
    static #current_lang = null;
    static #current_code = null;
    static #defaultCode = null;
    static #defaultLanguage = null;

    static #sanitizeCode = (code) => {
        if (code.length > 2) code = code.split("-")[0];
        if (code.length > 2) code = code.substring(0, 2);
        return code.toLowerCase();
    }

    static get DefaultCode() {
        if (this.#defaultCode == null)
            this.#defaultCode = this.#sanitizeCode( navigator.language || navigator.userLanguage );
        if (!Lang.Langs.map(el => el.value).includes(this.#defaultCode))
            this.#defaultCode = Lang.Langs[0].value;
        return this.#defaultCode;
    }

    static get DefaultLanguage() {
        if (this.#defaultLanguage == null)
            this.#defaultLanguage = this.Langs.find(l => l.value === this.DefaultCode).data;
        return this.#defaultLanguage;
    }

    static get CurrentLang() {
        if (this.#current_lang == null) {
            this.LoadLang( localStorage.getItem("lang") || this.DefaultCode, false );
            if (User.currentUser != null) {
                API.execute_logged(API.ROUTE.USER, API.METHOD.GET, User.currentUser.getCredentials()).then(res => {
                    if (res.language != null && res.language !== this.#current_code)
                        this.LoadLang(res.language, true, false);
                }).catch(err => {
                    User.forgetUser();
                    window.location.href = "/";
                });
            }
        }
        return this.#current_lang;
    }

    static get CurrentCode() {
        let temp = this.CurrentLang;
        return this.#current_code;
    }

    static async LoadLang(code, save = true, upload = true) {
        if (!code) {
            code = this.#defaultCode;
            localStorage.removeItem("lang");
            save = false;
        }

        code = this.#sanitizeCode(code);
        if (this.Langs.map(l => l.value).indexOf(code) === -1) {
            code = this.#defaultCode;
            localStorage.removeItem("lang");
            save = false;
        }
        
        this.#current_lang = this.Langs.find(l => l.value === code).data;
        for (const key in Lang.defaultLanguage) {
            if (!this.#current_lang[key])
                this.#current_lang[key] = Lang.defaultLanguage[key];
        }

        this.#callbacks.forEach(c => {
            if (c.callback)
                c.callback(this.#current_lang);
        });

        this.#current_code = code;
        if (save) {
            localStorage.setItem("lang", code);
            if (User.currentUser != null && upload) {
                await API.execute_logged(API.ROUTE.USER, API.METHOD.PATCH, User.currentUser.getCredentials(), {language_code: code});
            }
        }
        return true;
    }

    static AddCallback(c) {
        const i = this.#callbackIndex++;
        this.#callbacks.push( {index: i, callback: c} );
        return i;
    }

    static RemCallback(i) {
        const ind = this.#callbacks.findIndex(e => e.index === i);
        if (ind === -1) return false;
        this.#callbacks.splice(ind, 1);
        return true;
    }
}

window.Lang = Lang;
export default Lang;