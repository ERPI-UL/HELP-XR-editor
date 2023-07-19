<template>
    <!-- EasyConnect page, for device connection through the website -->
    <div class="flex flex-col grow min-h-0 max-h-full min-w-0 max-w-full items-center justify-center">
        <border-card class="bg-white p-4 mx-auto">
            <div class="mx-auto max-w-md">
                <div class="flex center">
                    <img
                        src="../assets/images/logo_indigo.png"
                        class="hidden md:block h-10"
                        alt="Indico logo"
                    >
                    <h2 class="text-2xl leading-9 font-extrabold text-indigo-600 px-6 whitespace-wrap md:whitespace-nowrap">
                        {{ lang.CONNECT_DEVICE }}
                    </h2>
                </div>
                <div>
                    <div class="border-none">
                        <!-- If we are not connected, display the username/password inputs -->
                        <div
                            v-show="!User.isConnected(User.currentUser)"
                            id="login-credentials"
                        >
                            <div class="md:space-y-6 md:py-8 text-base leading-7 text-gray-400">
                                <div class="md:flex block justify-between">
                                    <input-text
                                        :label="lang.USERNAME"
                                        type="text"
                                        name="username"
                                    />
                                </div>
                                <div class="md:flex block justify-between">
                                    <input-text
                                        :label="lang.PASSWORD"
                                        type="password"
                                        name="password"
                                    />
                                </div>
                            </div>
                            <!-- If we want to use custom credentials but the user is connected, display a button to switch to automatic credentials -->
                            <div
                                v-show="User.isConnected(User.currentUser)"
                                class="flex justify-left"
                            >
                                <p class="whitespace-nowrap center font-medium text-sm text-gray-500 p-1 w-fit">
                                    {{ lang.CONNECTED_TO.replace("{value}", User.currentUser?.username) }} :
                                </p>
                                <button
                                    class="whitespace-nowrap center font-medium text-sm text-indigo-600 p-1 cursor-pointer hover:underline"
                                    @click="useUserinfos"
                                >
                                    {{ lang.USE }}
                                </button>
                            </div>
                        </div>
                        <!-- Button to switch to custom credentials -->
                        <div
                            v-show="User.isConnected(User.currentUser)"
                            id="login-userinfos"
                        >
                            <div class="flex justify-left">
                                <p class="whitespace-nowrap center font-medium text-sm text-gray-500 p-1 w-fit">
                                    {{ lang.CONNECTED_TO.replace("{value}", User.currentUser?.username) }} :
                                </p>
                                <button
                                    class="whitespace-nowrap center font-medium text-sm text-indigo-600 p-1 cursor-pointer hover:underline"
                                    @click="useCredentials"
                                >
                                    {{ lang.CHANGE }}
                                </button>
                            </div>
                        </div>
                    </div>
                    <!-- EasyConnect code input -->
                    <div class="md:space-y-6 md:py-8 py-4 text-base md:leading-7 text-gray-600">
                        <div class="md:flex block justify-between space-x-8">
                            <label class="flex text-lg text-slate-600 font-bold whitespace-nowrap text-ellipsis w-fit" >
                                {{ lang.DEVICE_CODE }}
                            </label>
                            <div class="flex justify-center space-x-2">
                                <input
                                    type="number"
                                    pattern="[0-9]*"
                                    name="number1"
                                    class="input-numbers text-center max-w-[38px] flex h-fit border-2 rounded-md px-2 py-1 border-slate-200 font-bold text-md whitespace-nowrap text-ellipsis transition-colors"
                                >
                                <input
                                    type="number"
                                    pattern="[0-9]*"
                                    name="number2"
                                    class="input-numbers text-center max-w-[38px] flex h-fit border-2 rounded-md px-2 py-1 border-slate-200 font-bold text-md whitespace-nowrap text-ellipsis transition-colors"
                                >
                                <input
                                    type="number"
                                    pattern="[0-9]*"
                                    name="number3"
                                    class="input-numbers text-center max-w-[38px] flex h-fit border-2 rounded-md px-2 py-1 border-slate-200 font-bold text-md whitespace-nowrap text-ellipsis transition-colors"
                                >
                                <input
                                    type="number"
                                    pattern="[0-9]*"
                                    name="number4"
                                    class="input-numbers text-center max-w-[38px] flex h-fit border-2 rounded-md px-2 py-1 border-slate-200 font-bold text-md whitespace-nowrap text-ellipsis transition-colors"
                                >
                                <input
                                    type="number"
                                    pattern="[0-9]*"
                                    name="number5"
                                    class="input-numbers text-center max-w-[38px] flex h-fit border-2 rounded-md px-2 py-1 border-slate-200 font-bold text-md whitespace-nowrap text-ellipsis transition-colors"
                                >
                            </div>
                        </div>
                    </div>
                    <!-- Message log zone -->
                    <log-zone ref="log-zone" />
                    <!-- Buttons -->
                    <div class="pt-8 flex justify-between">
                        <button-text
                            @click="$router.go(-1)"
                        >
                            {{ lang.CANCEL }}
                        </button-text> <!-- Cancel -->
                        <button-block
                            id="btn-validate"
                            @click="() => onValidate(this)"
                        >
                            {{ lang.VALIDATE }}
                        </button-block> <!-- Validate -->
                    </div>
                </div>
            </div>
        </border-card>
    </div>
</template>

<script>
import ButtonBlock from "../components/inputs/ButtonBlock.vue";
import ButtonText from "../components/inputs/ButtonText.vue";
import InputText from "../components/inputs/InputText.vue";
import BorderCard from "../components/cards/BorderCard.vue";
import API from '../script/API';
import Lang from '../script/Lang';
import User from "../script/User";
import LogZone from '../components/cards/LogZone.vue';
import { Log } from '../script/Logs';

/**
 * Setup all number input listeners
 * to check if only numbers are entered and to jump to the other input if a number is entered
 */
const setupInputs = () => {
    const inputs = document.querySelectorAll(".input-numbers");
    for (let i = 0; i < inputs.length; i++) {
        const el = inputs.item(i);
        el.addEventListener("keydown", ev => {
            const char = ev.key.charAt(0);
            if (isNaN(parseInt(char))) { // if the input character is not a number
                el.value = "";
            } else { // if the input character is a number, add it and jump to the other input 
                el.value = char;
                if (i < inputs.length - 1) {
                    inputs.item(i + 1).focus();
                } else el.blur();
            }
            // delete the input content and jump to the previous one
            if (ev.key == "Backspace" && i > 0) {
                inputs.item(i - 1).focus();
            }
            ev.preventDefault();
        });
    }
    // if enter is pressed, click on the validate button
    window.addEventListener("keydown", ev => {
        if (ev.key != "Enter") return;
        const btn = document.getElementById("btn-validate");
        if (btn) btn.click();
    });
}

// is the user connected (if so, set the connection mode to automatic credentials)
let usingCredentials = !User.isConnected(User.currentUser);
/**
 * Display the credentials input zone (to input custom credentials)
 */
function useCredentials() {
    usingCredentials = true;
    document.getElementById("login-userinfos").style.display = "none";
    document.getElementById("login-credentials").style.display = "inherit";
}
/**
 * Hides the credentials input zone (to use automatic credentials)
 */
function useUserinfos() {
    usingCredentials = false;
    document.getElementById("login-credentials").style.display = "none";
    document.getElementById("login-userinfos").style.display = "inherit";
}

/**
 * When the validate button is pressed, chekc if there is credentials to use
 * and if the easyconnect code is correctly entered, if so make an API call
 * to try to connect the device to this account.
 */
function onValidate(obj) {
    const logZone = obj.$refs["log-zone"];
    const log = logZone.log(Lang.CurrentLang.VALIDATING, Log.INFO);
    const credentials = {
        username: document.querySelector("input[name=username]"),
        password: document.querySelector("input[name=password]"),
        number: {
            value: document.querySelector("input[name=number1]").value +
                document.querySelector("input[name=number2]").value +
                document.querySelector("input[name=number3]").value +
                document.querySelector("input[name=number4]").value +
                document.querySelector("input[name=number5]").value,
            focus() {document.querySelector("input[name=number1]").focus()}
        }
    };

    if (usingCredentials) { // check for user credentials
        if (credentials.username.value.trim() == "") {
            log.update(Lang.CurrentLang.SPECIFY_USERNAME, Log.WARNING);
            setTimeout(() => { log.delete(); }, 4000);
            credentials.username.focus();
            return;
        }
        if (credentials.password.value.trim() == "") {
            log.update(Lang.CurrentLang.SPECIFY_PASSWORD, Log.WARNING);
            setTimeout(() => { log.delete(); }, 4000);
            credentials.password.focus();
            return;
        }
    }

    if (credentials.number.value.trim().length < 5) {
        log.update(Lang.CurrentLang.SPECIFY_CODE, Log.WARNING);
        setTimeout(() => { log.delete(); }, 4000);
        credentials.number.focus();
        return;
    }

    if (usingCredentials) {
        API.execute(API.ROUTE.LOGIN, API.METHOD.POST, {username: credentials.username.value, password: credentials.password.value}, API.TYPE.FORM).then(res => {
            log.delete();
            sendEasyConnectRequest(obj, {
                token: res.token_type + " " + res.access_token,
                code: credentials.number.value
            });
        }).catch(err => {
            console.error(err);
            log.update(Lang.CurrentLang.INVALID_CREDENTIALS, Log.WARNING);
            setTimeout(() => { log.delete(); }, 4000);
        });
    } else {
        log.delete();
        sendEasyConnectRequest(obj, {
            token: User.currentUser.token.type + " " + User.currentUser.token.token,
            code: credentials.number.value
        });
    }
}

/**
 * Send an API call to connect a device to this account
 * @param {{token:string,code:number}} data data to use in the call (user token and easyconnect code)
 */
function sendEasyConnectRequest(obj, data) {
    const logZone = obj.$refs["log-zone"];
    const log = logZone.log(Lang.CurrentLang.CONNECTING, Log.INFO);
    API.execute_logged(API.ROUTE.EASYCONNECT, API.METHOD.POST, {type: data.token.split(" ")[0], token: data.token.split(" ")[1]}, data, API.TYPE.JSON).then(res => {
        log.update(Lang.CurrentLang.CONNECTED, Log.SUCCESS);
        setTimeout(() => {
            log.delete();
            obj.$router.go(-1);
        }, 2000);
    }).catch(err => {
        switch (err.status) {
        case 404:
            log.update(Lang.CurrentLang.UNKNOWN_DEVICE, Log.ERROR);
            break;
        default:
            if (err.message.json) {
                err.message.json().then(e => log.update(lang.ERROR_MESSAGE+" : "+e.detail, Log.ERROR));
                console.error(e);
            }
            else log.update(Lang.CurrentLang.SERVER_ERROR, Log.ERROR);
            break;
        }
        setTimeout(() => { log.delete(); }, 4000);
        console.error(err);
    });
}

export default {
    name: "EasyconnectView",
    components: {
        ButtonText,
        ButtonBlock,
        InputText,
        BorderCard,
        LogZone
    },
    setup() {
        return {
            lang: Lang.CurrentLang,
            User,
            usingCredentials
        };
    },
    mounted() {
        setupInputs();
    },
    methods: {onValidate, useCredentials, useUserinfos}
    
};
</script>

<style>
@keyframes zoom-inout {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.1);
    }
}

.input-numbers:focus {
    animation: zoom-inout 200ms;
}
</style>