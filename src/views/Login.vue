<template>
    <!-- Login page, with username and password inputs to log into an account -->
    <div class="flex grow min-h-0 max-h-full min-w-0 max-w-full md:items-center">
        <border-card class="bg-white p-2 md:p-4 m-auto h-fit">
            <div class="mx-auto max-w-md">
                <!-- Modal title -->
                <div class="flex center">
                    <img
                        src="../assets/images/logo_indigo.png"
                        class="flex h-10"
                        alt="Tailwind Play"
                    >
                    <h2 class="text-2xl font-extrabold text-indigo-600 px-6 whitespace-nowrap">
                        {{ lang.LOGIN }}
                    </h2>
                </div>
                <div class="flex flex-col">
                    <div class="space-y-6 py-2 md:py-8 text-base text-gray-400">
                        <!-- Username input -->
                        <input-text
                            :label="lang.USERNAME"
                            type="text"
                            name="username"
                        />
                        <input-text
                            :label="lang.PASSWORD"
                            type="password"
                            name="password"
                        />
                        <!-- Forgot password button (to redirect to ForgotPassword.vue file) -->
                        <router-link
                            to="/forgotPassword"
                            class="flex text-indigo-600 hover:underline"
                        >
                            {{ lang.FORGOT_PASSWORD }}
                        </router-link>
                    </div>
                    <div class="flex flex-wrap justify-between items-center">
                        <p class="text-lg font-semibold text-slate-700"> {{ lang.NO_HAVE_ACCOUNT }} </p>
                        <button-text href="/register">
                            {{ lang.REGISTER }}
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
                        </button-text> <!-- Cancel -->
                        <button-block
                            :onclick="() => login(this)"
                        >
                            {{ lang.VALIDATE }}
                        </button-block>
                    </div>
                </div>
            </div>
        </border-card>
    </div>
</template>

<script>
import BorderCard from '../components/cards/BorderCard.vue';
import ButtonText from "../components/inputs/ButtonText.vue";
import ButtonBlock from "../components/inputs/ButtonBlock.vue";
import InputText from "../components/inputs/InputText.vue";
import LogZone from '../components/cards/LogZone.vue';
import User from "../script/User";
import API from "../script/API";
import Lang from '../script/Lang';
import { Log } from '../script/Logs';

/**
 * Attaches a event listener to the enter key to emultate a validate button click
 */
function setup() {
    window.addEventListener("keydown", ev => {
        if (ev.key != "Enter") return;
        const btn = document.getElementById("btn-validate");
        if (btn) btn.click();
    });
}

/**
 * When the user clicks on the validate button,
 * check if all the inputs are filled correctly and if so
 * makes an API call to get the user's token / informations
 * and then redirects the user to the home page
 */
function  login (obj) {
    const logZone = obj.$refs["log-zone"];
    const log = logZone.log(Lang.CurrentLang.VALIDATING, Log.INFO);

    const credentials = {
        username: document.querySelector("input[name=username]"),
        password: document.querySelector("input[name=password]")
    };

    const checks = [
        {obj: 'username',   check: el => el.value.trim() !== "", msg: Lang.CurrentLang.SPECIFY_USERNAME},
        {obj: 'password',  check: el => el.value.trim() !== "",  msg: Lang.CurrentLang.SPECIFY_PASSWORD}
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

    log.update(Lang.CurrentLang.LOGGINGIN, Log.INFO);
    API.execute(API.ROUTE.LOGIN, API.METHOD.POST, {username: credentials.username.value, password: credentials.password.value}, API.TYPE.FORM).then(data => {
        let user = User.fromToken({token: data.access_token, type: data.token_type})
        if (!user) {
            log.update(Lang.CurrentLang.INVALID_TOKEN, Log.ERROR);
            setTimeout(() => log.delete(), 4000);
            return;
        }
        User.saveUser(user);
        user.fetchInformations().then(user => {
            log.update(Lang.CurrentLang.LOGGEDIN, Log.SUCCESS);
            setTimeout(() => {
                log.delete();
                window.location.href = '/';
            }, 1000);
        }).catch(err => {
            log.update(Lang.CurrentLang.LOGIN_ERROR, Log.ERROR);
            setTimeout(() => log.delete(), 4000);
            console.error(err);
        });
    }).catch(err => {
        console.error("Token request error: ", err);
        switch (err.status) {
        case 401:
            log.update(Lang.CurrentLang.INVALID_PASSWORD, Log.ERROR);
            setTimeout(() => log.delete(), 4000);
            break;
        case 404:
            log.update(Lang.CurrentLang.INVALID_USERNAME, Log.ERROR);
            setTimeout(() => log.delete(), 4000);
            break;
        
        default:
            log.update(Lang.CurrentLang.SERVER_ERROR, Log.ERROR);
            setTimeout(() => log.delete(), 4000);
            break;
        }
    });

}

export default {
    name: "ForgotPassword",
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
            login(this);
        });
    },
    methods: { login }
};
</script>