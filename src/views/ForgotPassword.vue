<template>
    <!-- Forget password page, used to receive an email when the user's password is lost -->
    <div class="flex flex-col grow min-h-0 max-h-full min-w-0 max-w-full items-center justify-center">
        <div class="bg-white p-4 md:p-8 shadow-xl mx-auto rounded-lg">
            <div class="mx-auto max-w-md">
                <!-- Modal title -->
                <div class="flex center">
                    <img
                        src="../assets/images/logo_indigo.png"
                        class="hidden md:block h-10"
                        alt="Tailwind Play"
                    >
                    <h2 class="text-2xl leading-9 font-extrabold text-indigo-600 px-6 whitespace-nowrap">
                        {{ lang.FORGOT_PASSWORD }}
                    </h2>
                </div>
                <!-- Modal information text -->
                <p class="text-gray-600">
                    {{ lang.FORGOT_PASSWORD_DESC }}
                </p>
                <div class="divide-y divide-gray-300/50">
                    <div class="space-y-6 py-8 text-base leading-7 text-gray-400">
                        <!-- Username or email input zone -->
                        <div class="block justify-between">
                            <input-text
                                :label="lang.USERNAME + ' ' + lang.OR.toLowerCase() + ' ' + lang.EMAIL"
                                name="email"
                                type="email"
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
                        <button-text
                            :onclick="() => $router.go(-1)"
                        >
                            {{ lang.CANCEL }}
                        </button-text> <!-- Cancel button -->
                        <button-block
                            id="btn-validate"
                            :action="() => onValidate(this)"
                        >
                            {{ lang.VALIDATE }} <!-- Validate button -->
                        </button-block>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ButtonText from '../components/inputs/ButtonText.vue';
import ButtonBlock from '../components/inputs/ButtonBlock.vue';
import InputText from '../components/inputs/InputText.vue';
import API from "../script/API";
import User from '../script/User';
import Lang from '../script/Lang';

/**
 * Creates a keydown event listener for enter press (if so emulated a validate button click)
 */
function setup() {
    window.addEventListener("keydown", ev => {
        if (ev.key != "Enter") return;
        const btn = document.getElementById("btn-validate");
        if (btn) btn.click();
    });
}

/**
 * Shows a log message to the user
 * @param {string} msg message to display
 */
function logMessage(msg) {
    const btn = document.getElementById("btn-validate");
    btn.innerHTML = "Valider";
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
 * When the user clicks on the validate button
 * checks if the user entered an email or a username
 * and if so makes an API call to send an email to the user
 */
function onValidate(obj) {
    const input = document.getElementById("input-username-email");
    if (input.value.trim() == "") {
        logMessage(lang.SPECIFY_USERNAME_EMAIL);
        input.focus();
        return;
    }
    API.execute(API.ROUTE.RESET+input.value, API.METHOD.GET).then(res => {
        logMessage(res.message);
        obj.$router.go(-1)();
    }).catch(err => {
        switch (err.status) {
        case 404:
            logMessage(lang.INCORRECT_USERNAME_EMAIL);
            break;
        default:
            logMessage(lang.SERVER_ERROR);
            break;
        }
    });
}

export default {
    name: "LoginView",
    components: {
        ButtonText,
        ButtonBlock,
        InputText
    },
    data() {
        return {
            lang: Lang.CurrentLang,
            User
        };
    },
    mounted() {
        Lang.AddCallback(lang => this.lang = lang);
        setup();
    },
    methods: {onValidate}
};
</script>