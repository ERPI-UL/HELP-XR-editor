<template>
    <!-- Password reset web page -->
    <div class="flex flex-col grow min-h-0 max-h-full min-w-0 max-w-full items-center justify-center">
        <div class="bg-white p-4 md:p-8 shadow-xl mx-auto rounded-lg max-w-full">
            <div class="mx-auto max-w-md">
                <!-- Modal title -->
                <div class="flex center max-w-full">
                    <img
                        src="../assets/images/logo_indigo.png"
                        class="hidden md:block h-10"
                        alt="Tailwind Play"
                    >
                    <h2 class="text-2xl leading-9 font-extrabold text-indigo-600 px-6">
                        {{ lang.RESET_TITLE.replace("{action}", action) }}
                    </h2>
                </div>
                <!-- Modal content -->
                <div class="divide-y divide-gray-300/50">
                    <div class="space-y-6 py-8 text-base leading-7 text-gray-400">
                        <!-- New password input zone -->
                        <div class="md:flex block justify-between">
                            <input-text
                                :label="lang.PASSWORD"
                                type="password"
                                name="new-password"
                            />
                        </div>
                        <!-- Password confirmation zone -->
                        <div class="md:flex block justify-between">
                            <input-text
                                :label="lang.CONFIRM_PASSWORD"
                                type="password"
                                name="password-confirm"
                            />
                        </div>
                    </div>
                    <!-- Message log zone -->
                    <div
                        id="log-zone"
                        class="border-none overflow-y-hidden h-[0px]"
                    >
                        <p class="opacity-0 text-center text-indigo-600" />
                    </div>
                    <!-- Buttons -->
                    <div class="pt-8 flex justify-between">
                        <button-text>
                            {{ lang.CANCEL }}
                        </button-text>
                        <button-block
                            @click="() => onValidate(this)"
                        >
                            {{ action }}
                        </button-block>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ButtonBlock from "../components/inputs/ButtonBlock.vue";
import ButtonText from "../components/inputs/ButtonText.vue";
import InputText from "../components/inputs/InputText.vue";
import API from "../script/API";
import Lang from '../script/Lang';
import User from "../script/User";

/**
 * Returns a URL parameter value corresponding to the given name.
 * @param {string} name - The name of the parameter to get.
 * @returns {string} The value of the parameter.
 */
function getURLParameter(name) {
    if (window.location.search == "") return null;
    let res = null;
    window.location.search.replace("?", "").split("&").forEach(param => {
        const parts = param.split("=");
        if (parts[0].trim().toLowerCase() == name.toLowerCase())
            res = decodeURIComponent(parts[1]);
    })
    return res;
}

// password reset token given to the user (usually retreived from the url using getURLParameter)
let token = null;
/**
 * Retreives the token in the URL and creates the keydown listener for the enter key,
 * to emulate a validate button click
 */
function setup(obj) {
    token = getURLParameter("token");
    if (token == null) {
        obj.$router.go(-1);
        return;
    }

    window.addEventListener("keydown", ev => {
        if (ev.key != "Enter") return;
        const btn = document.getElementById("btn-validate");
        if (btn) btn.click();
    });
}

/**
 * Displays a log message to the user
 * @param {string} msg The message to display.
 */
function logMessage(msg) {
    const div = document.getElementById("log-zone");
    const txt = div.firstElementChild;
    if (txt.innerHTML.length < 1)
        txt.innerHTML = msg;
    else txt.innerHTML += "<br>"+msg;
    txt.classList.add("opacity-100");
    div.style.height = txt.getBoundingClientRect().height+"px";
    setTimeout(() => {
        txt.classList.remove("opacity-100");
        let liste = txt.innerHTML.split("<br>");
        liste.pop();
        txt.innerHTML = liste.join("<br>");
        div.style.height = "0px";
    }, 3000);
}

/**
 * Listener for the validate button click
 * Validates the new password and password confirm fields,
 * and makes an API call to reset the password.
 * if successful, redirects to the home page.
 */
function onValidate(obj) {
    const credentials = {
        newPassword: document.querySelector("input[name='new-password']"),
        passwordConfirm: document.querySelector("input[name='password-confirm']")
    };

    if (credentials.newPassword.value.trim().length < 8) {
        logMessage(Lang.CurrentLang.SPECIFY_PASSWORD);
        credentials.newPassword.focus();
        return;
    }
    if (credentials.newPassword.value != credentials.passwordConfirm.value) {
        logMessage(Lang.CurrentLang.SPECIFY_CONFIRM_PASSWORD);
        credentials.passwordConfirm.focus();
        return;
    }

    if (token == null) return;
    API.execute(API.ROUTE.RESET, API.METHOD.POST, {token: token, password: credentials.newPassword.value}, API.TYPE.JSON).then(data => {
        if (data.error) logMessage(data.error);
        else {
            logMessage(Lang.CurrentLang.PASSWORD_RESET);
            obj.$router.push("/");
        }
    }).catch(err => {
        switch (err.status) {
        case 401:
            logMessage(Lang.CurrentLang.TOKEN_ERROR);
            break;
        case 422:
            res.json().then(logMessage);
            break;
        
        default:
            logMessage(Lang.CurrentLang.SERVER_ERROR);
            break;
        }
    });
}

let action = window.location.pathname.split("/").pop() === "reset" ? Lang.CurrentLang.RESET : Lang.CurrentLang.CHANGE;

export default {
    name: "ResetView",
    components: {
        ButtonBlock,
        ButtonText,
        InputText
    },
    data() { 
        return {
            lang: Lang.CurrentLang,
            action,
            User
        }
    },
    mounted() {
        Lang.AddCallback(lang => this.lang = lang);
        setup(this);
    },
    methods: {onValidate}
};
</script>