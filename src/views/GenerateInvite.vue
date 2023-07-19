<template>
    <!-- Register web page -->
    <div class="flex flex-col grow min-h-0 max-h-full min-w-0 max-w-full items-center justify-center">
        <border-card class="bg-white p-4 mx-auto">
            <div class="max-h-full">
                <div class="flex center">
                    <!-- Modal Title -->
                    <img
                        src="../assets/images/logo_indigo.png"
                        class="hidden md:block h-10"
                        alt="Tailwind Play"
                    >
                    <h2 class="text-2xl font-extrabold text-indigo-600 px-6">
                        {{ lang.GENERATE_INVITE }}
                    </h2>
                </div>
                <div>
                    <!-- Modal content, inputs to register -->
                    <div class="space-y-1 md:space-y-4 py-2 md:py-8 text-base text-gray-400 max-h-full">
                        <input-text
                            :label="lang.FIRSTNAME"
                            type="text"
                            name="given-name"
                        />
                        <input-text
                            :label="lang.LASTNAME"
                            type="text"
                            name="family-name"
                        />
                        <input-text
                            :label="lang.USERNAME + ` (${lang.OPTIONAL})`"
                            type="text"
                            name="username"
                        />
                        <input-text
                            :label="lang.EMAIL"
                            type="email"
                            name="email"
                        />
                        <input-choice
                            :label="lang.ACCOUNT_TYPE"
                            name="role-select"
                            :list="User.Roles.map((role, i) => ({ value: i, label: role })).filter((role, i) => i < User.currentUser?.permissions)"
                        />
                    </div>
                    <!-- Message log zone -->
                    <log-zone ref="log-zone" />
                    <p class="text-gray-400 pt-8 text-center">
                        {{ lang.VALIDATION_DELAY }}
                    </p>
                    <!-- Buttons -->
                    <div class="pt-2 flex justify-between">
                        <button-text
                            @click="$router.go(-1)"
                        >
                            {{ lang.CANCEL }}
                        </button-text> <!-- Cancel button -->
                        <button-block
                            id="btn-validate"
                            @click="() => sendInvite(this)"
                        >
                            {{ lang.SEND }}
                        </button-block> <!-- Validate button -->
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
import InputChoice from "../components/inputs/InputChoice.vue";
import BorderCard from "../components/cards/BorderCard.vue";
import API from "../script/API";
import Lang from '../script/Lang';
import User from "../script/User";
import LogZone from '../components/cards/LogZone.vue';
import { Log } from '../script/Logs';

/**
 * Event listener for when the validate button is clicked
 * Checks if all the fields are correctly filled and makes an API call
 * to try to register the User. If so, redirects to the home page
 */
function sendInvite(obj) {
    const logZone = obj.$refs["log-zone"];
    const log = logZone.log(Lang.CurrentLang.VALIDATING, Log.INFO);

    const credentials = {
        givenName: document.querySelector("input[name=given-name]"),
        familyName: document.querySelector("input[name=family-name]"),
        username: document.querySelector("input[name=username]"),
        email: document.querySelector("input[name=email]"),
        role: document.querySelector("select[name=role-select]")
    };
    if (credentials.givenName.value.trim() == "") {
        log.update(Lang.CurrentLang.SPECIFY_FIRSTNAME, Log.WARNING);
        setTimeout(() => { log.delete(); }, 4000);
        credentials.givenName.focus();
        return;
    }
    if (credentials.familyName.value.trim() == "") {
        log.update(Lang.CurrentLang.SPECIFY_LASTNAME, Log.WARNING);
        setTimeout(() => { log.delete(); }, 4000);
        credentials.familyName.focus();
        return;
    }
    const REGEX_EMAIL = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    if (!credentials.email.value.trim().match(REGEX_EMAIL)) {
        log.update(Lang.CurrentLang.SPECIFY_EMAIL, Log.WARNING);
        setTimeout(() => { log.delete(); }, 4000);
        credentials.email.focus();
        return;
    }

    API.execute_logged(API.ROUTE.INVITE, API.METHOD.POST, User.currentUser.getCredentials(), {
        email: credentials.email.value.trim(),
        firstname: credentials.givenName.value.trim(),
        lastname: credentials.familyName.value.trim(),
        username: credentials.username.value.trim(),
        adminLevel: credentials.role.value
    }, API.TYPE.JSON).then(() => {
        log.update(Lang.CurrentLang.INVITE_SENT, Log.SUCCESS);
        setTimeout(() => { log.delete(); }, 2000);
        obj.$router.go(-1);
    }).catch(err => {
        if (err.message.json) {
            err.message.json().then(e => {
                log.update(Lang.CurrentLang.ERROR_MESSAGE+" : "+e.detail, Log.ERROR);
                setTimeout(() => { log.delete(); }, 4000);
            });
        }
        else {
            console.error("Invite error: ", err);
            log.update(Lang.CurrentLang.INVITE_ERROR, Log.ERROR);
            setTimeout(() => { log.delete(); }, 4000);
        }
    });
}

export default {
    name: "GenerateInvite",
    components: {
        ButtonText,
        ButtonBlock,
        InputText,
        InputChoice,
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
        window.addEventListener("keydown", ev => {
            if (ev.key != "Enter") return;
            sendInvite(this);
        });
    },
    methods: { sendInvite }
};
</script>
