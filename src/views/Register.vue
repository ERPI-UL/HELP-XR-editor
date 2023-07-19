<template>
    <!-- Register web page -->
    <div class="flex grow min-h-0 max-h-full min-w-0 max-w-full md:items-center">
        <border-card class="bg-white p-2 md:p-4 m-auto h-fit">
            <div class="h-fit">
                <div class="flex center">
                    <!-- Modal Title -->
                    <img
                        src="../assets/images/logo_indigo.png"
                        class="flex h-10"
                        alt="Tailwind Play"
                    >
                    <h2 class="text-2xl font-extrabold text-indigo-600 px-6">
                        {{ lang.REGISTER }}
                    </h2>
                </div>
                <div>
                    <!-- Modal content, inputs to register -->
                    <div class="space-y-1 md:space-y-4 py-2 md:py-8 text-base text-gray-400 max-h-full">
                        <!-- Firstname input -->
                        <div class="md:flex block justify-between">
                            <input-text
                                id="given-name"
                                :label="lang.FIRSTNAME"
                                type="text"
                                name="given-name"
                            />
                        </div>
                        <!-- Lastname input -->
                        <div class="md:flex block justify-between">
                            <input-text
                                id="family-name"
                                :label="lang.LASTNAME"
                                type="text"
                                name="family-name"
                            />
                        </div>
                        <!-- Username input -->
                        <div class="md:flex block justify-between">
                            <input-text
                                id="username"
                                :label="lang.USERNAME"
                                type="text"
                                name="username"
                            />
                        </div>
                        <!-- Email input -->
                        <div class="md:flex block justify-between">
                            <input-text
                                id="email"
                                :label="lang.EMAIL"
                                type="email"
                                name="email"
                            />
                        </div>
                        <!-- Password input -->
                        <div class="md:flex block justify-between">
                            <input-text
                                id="new-password"
                                :label="lang.PASSWORD"
                                type="password"
                                name="new-password"
                            />
                        </div>
                        <!-- Password confirmation input -->
                        <div class="md:flex block justify-between">
                            <input-text
                                id="password-confirm"
                                :label="lang.CONFIRM_PASSWORD"
                                type="password"
                                name="password-confirm"
                            />
                        </div>
                    </div>
                    <div class="flex flex-wrap justify-between items-center">
                        <p class="text-lg font-semibold text-slate-700"> {{ lang.ALREADY_HAVE_ACCOUNT }} </p>
                        <button-text href="/login">
                            {{ lang.LOGIN }}
                        </button-text>
                    </div>
                    <!-- Message log zone -->
                    <log-zone ref="log-zone" />
                    <!-- Buttons -->
                    <div class="pt-8 flex justify-between">
                        <button-text
                            :onclick="() => $router.go(-1)"
                        >
                            {{ lang.CANCEL }}
                        </button-text> <!-- Cancel button -->
                        <button-block
                            :onclick="() => register(this)"
                        >
                            {{ lang.REGISTER }}
                        </button-block> <!-- Validate button -->
                    </div>
                </div>
            </div>
        </border-card>
    </div>
</template>

<script>
import BorderCard from '../components/cards/BorderCard.vue';
import ButtonBlock from "../components/inputs/ButtonBlock.vue";
import ButtonText from "../components/inputs/ButtonText.vue";
import InputText from '../components/inputs/InputText.vue';
import LogZone from '../components/cards/LogZone.vue';
import API from "../script/API";
import User from "../script/User";
import Lang from '../script/Lang';
import { Log } from '../script/Logs';

/**
 * Registers the event listener for the enter key
 * if it's pressed, emulate a click on the validate button
 */
function setup() {
    window.addEventListener("keydown", ev => {
        if (ev.key != "Enter") return;
        const btn = document.getElementById("btn-validate");
        if (btn) btn.click();
    });
}

/**
 * Event listener for when the validate button is clicked
 * Checks if all the fields are correctly filled and makes an API call
 * to try to register the User. If so, redirects to the home page
 */
function register(obj) {
    const logZone = obj.$refs["log-zone"];
    const log = logZone.log(Lang.CurrentLang.VALIDATING, Log.INFO);

    const credentials = {
        givenName: document.querySelector("input[name=given-name]"),
        familyName: document.querySelector("input[name=family-name]"),
        username: document.querySelector("input[name=username]"),
        email: document.querySelector("input[name=email]"),
        newPassword: document.querySelector("input[name=new-password]"),
        passwordConfirm: document.querySelector("input[name=password-confirm]")
    };

    const checks = [
        {obj: 'givenName',   check: el => el.value.trim() !== "",                         msg: Lang.CurrentLang.SPECIFY_FIRSTNAME},
        {obj: 'familyName',  check: el => el.value.trim() !== "",                         msg: Lang.CurrentLang.SPECIFY_LASTNAME},
        {obj: 'username',    check: el => el.value.trim() !== "",                         msg: Lang.CurrentLang.SPECIFY_USERNAME},
        {obj: 'email',       check: el => el.value.trim().match(/(.+)@(.+)/),             msg: Lang.CurrentLang.SPECIFY_EMAIL},
        {obj: 'newPassword', check: el => el.value.trim().length >= 8,                    msg: Lang.CurrentLang.SPECIFY_PASSWORD},
        {obj: 'newPassword', check: el => el.value === credentials.passwordConfirm.value, msg: Lang.CurrentLang.SPECIFY_CONFIRM_PASSWORD}
    ];

    let valid = true;
    checks.forEach(check => {
        if (!valid) return;
        if (!check.check(credentials[check.obj])) {
            log.update(check.msg, Log.WARNING);
            credentials[check.obj].focus();
            setTimeout(() => { log.delete(); }, 4000);
            valid = false;
        }
    });
    if (!valid) return;

    log.update(Lang.CurrentLang.REGISTERING, Log.INFO);
    API.execute(API.ROUTE.USERS, API.METHOD.POST, {
        username: credentials.username.value.trim(),
        email: credentials.email.value.trim(),
        firstname: credentials.givenName.value.trim(),
        lastname: credentials.familyName.value.trim(),
        password: credentials.newPassword.value.trim()
    }).then(infos => {
        API.execute(API.ROUTE.LOGIN, API.METHOD.POST, {
            username: credentials.username.value.trim(), 
            password: credentials.newPassword.value.trim()
        }, API.TYPE.FORM).then(tokens => {
            const user = new User(infos.username, infos.email, infos.firstname, infos.lastname, {type: tokens.type, token: tokens.access_token}, infos.adminLevel, infos.id);
            User.saveUser(user);
            log.update(Lang.CurrentLang.REGISTERED, Log.SUCCESS);
            setTimeout(() => {
                log.delete();
                window.location.href = "/";
            }, 1000);
        });
    }).catch(err => {
        console.error("Register error: ", err);
        log.update(Lang.CurrentLang.REGISTER_ERROR, Log.ERROR);
        setTimeout(() => log.delete(), 4000);
    });
}

export default {
    name: "RegisterView",
    components: {
        ButtonText,
        ButtonBlock,
        InputText,
        BorderCard,
        LogZone
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
        window.addEventListener("keydown", ev => {
            if (ev.key != "Enter") return;
            register(this);
        });
    },
    methods: {register}
};
</script>