<template>
    <!-- Profile page, to see and edit profile informations -->
    <div class="flex flex-col grow min-h-0 max-h-full min-w-0 max-w-full overflow-auto">
        <div class="flex flex-col bg-white my-8 rounded-lg shadow-lg w-fit px-4 mx-auto max-w-full">
            <div class="flex flex-col grow">
                <div class="flex flex-col grow h-full space-y-4 py-4">
                    <div class="flex items-center justify-between">
                        <p class="flex pb-2 min-h-fit text-xl font-semibold text-indigo-600 whitespace-nowrap text-ellipsis">
                            {{ lang.PROFILE }}
                        </p>
                        <button-block :onclick="disconnect">
                            {{ lang.DISCONNECT }}
                        </button-block>
                    </div>
                    <div class="flex w-full h-fit px-2">
                        <span class="h-1 w-full rounded-md bg-slate-100" />
                    </div>
                    <input-choice
                        :label="lang.LANGUAGE"
                        :value="code"
                        :list="languages"
                        :onchange="onLangChange"
                    />
                    <input-text
                        :label="lang.USERNAME"
                        type="text"
                        name="username"
                        :value="User.currentUser.username"
                    />
                    <input-text
                        :label="lang.FIRSTNAME"
                        type="text"
                        name="given-name"
                        :value="User.currentUser.firstname"
                    />
                    <input-text
                        :label="lang.LASTNAME"
                        type="text"
                        name="family-name"
                        :value="User.currentUser.lastname"
                    />
                    <input-text
                        :label="lang.EMAIL"
                        type="text"
                        name="email"
                        :value="User.currentUser.email"
                    />
                    <input-choice
                        :label="lang.ACCOUNT_TYPE"
                        :value="User.currentUser.permissions"
                        :list="User.Roles.map((role, i) => ({ value: i, label: role }))"
                        :disabled="true"
                    />
                </div>
                <log-zone ref="user-log-zone" />
                <!-- Basic informations buttons -->
                <div class="flex justify-between h-fit pt-2 pb-4">
                    <button-block
                        color="red"
                        @click="removeAccount"
                    >
                        {{ lang.DELETE }}
                    </button-block> <!-- Remove user button -->
                    <button-block @click="onAccountSave">
                        <!-- Update informations button -->
                        {{ lang.UPDATE }}
                    </button-block>
                </div>
                <ValidatePopup ref="delete-popup" /> <!-- Delete user validation popup -->
            </div>
            <div class="flex w-full h-fit px-2">
                <span class="h-1 w-full rounded-md bg-slate-100" />
            </div>
            <div class="flex flex-col min-h-fit">
                <!-- Password edition zone -->
                <div class="flex flex-col grow h-full space-y-4 py-4">
                    <p class="flex pb-2 min-h-fit text-xl font-semibold text-indigo-600 whitespace-nowrap text-ellipsis">
                        {{ lang.EDIT_PASSWORD }}
                    </p>
                    <input-text
                        :label="lang.OLD_PASSWORD"
                        type="password"
                        name="old-password"
                    />
                    <input-text
                        :label="lang.NEW_PASSWORD"
                        type="password"
                        name="new-password"
                    />
                    <input-text
                        :label="lang.CONFIRM_PASSWORD"
                        type="password"
                        name="password-confirm"
                    />
                </div>
                <!-- Password buttons -->
                <div class="flex grow justify-between h-fit pt-2 pb-4">
                    <button-text
                        @click="$router.go(-1)"
                    >
                        {{ lang.CANCEL }}
                    </button-text> <!-- Cancel button (go back in history) -->
                    <button-block @click="onMDPChange">
                        <!-- Update user password (disconnects the user) -->
                        {{ lang.CHANGE }}
                    </button-block>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { UserIcon } from "@heroicons/vue/solid";
import User from "../script/User";
import ButtonBlock from "../components/inputs/ButtonBlock.vue";
import ButtonText from "../components/inputs/ButtonText.vue";
import ValidatePopup from "../components/ValidatePopup.vue";
import InputText from "../components/inputs/InputText.vue";
import InputChoice from "../components/inputs/InputChoice.vue";
import API from '../script/API';
import Lang from '../script/Lang';
import LogZone from '../components/cards/LogZone.vue';
import { Log } from '../script/Logs';

/**
 * Removes the user's account from the database with an API call (also removes all his informations)
 * Spawn the validation popup to confirm deletion
 */
function removeAccount(ev) {
    const el = this.$refs["delete-popup"];
    el.show(
        Lang.CurrentLang.DELETE_ACCOUNT,
        Lang.CurrentLang.DELETE_ACCOUNT_DESC.replace("{value}", User.currentUser.username),
        Lang.CurrentLang.CANCEL,
        Lang.CurrentLang.DELETE
    );
    el.setPosition(ev.target);
    el.setCallback(() => {
        API.execute_logged(API.ROUTE.USER, API.METHOD_DELETE, User.currentUser.getCredentials(), {}, API.TYPE.JSON).then(res => {
            User.forgetUser();
            window.location.href = "/";
        }).catch(console.error);
    });
}

/**
 * Event listener when the user save informations button is pressed
 * Makes en API call to update all the user's informations and redirects him to the home page
 */
function onAccountSave(obj, ev) {
    const logZone = obj.$refs["user-log-zone"];
    const log = logZone.log(Lang.CurrentLang.VALIDATING, Log.INFO);

    const infos = {
        firstname: document.querySelector("input[name=given-name]"),
        lastname: document.querySelector("input[name=family-name]"),
        username: document.querySelector("input[name=username]"),
        email: document.querySelector("input[name=email]")
    }

    for (const key in infos) {
        if (infos[key].value.trim().length === 0) {
            log.update(Lang.CurrentLang.SPECIFY_FIELD.replace("{value}", key), Log.WARNING);
            setTimeout(() => { log.delete(); }, 4000);
            return;
        }
    }

    log.update(Lang.CurrentLang.UPDATING, Log.INFO);
    API.execute_logged(API.ROUTE.USER, API.METHOD.PATCH, User.currentUser.getCredentials(), {
        firstname: infos.firstname.value,
        lastname: infos.lastname.value,
        username: infos.username.value,
        email: infos.email.value,
    }, API.TYPE.JSON).then(data => {
        infos.firstname.value = data.firstname;
        infos.lastname.value = data.lastname;
        infos.email.value = data.email;
        User.currentUser.firstname = data.firstname;
        User.currentUser.lastname = data.lastname;
        User.currentUser.email = data.email;
        User.saveUser();
        log.update(Lang.CurrentLang.UPDATED, Log.SUCCESS);
        setTimeout(() => { log.delete(); }, 2000);
    }).catch(err => {
        console.log(err);
        switch (err.status) {
        default:
            break;
        }
    });
}

/**
 * Event listener when the user save password button is pressed
 * Makes en API call to update the user's password and disconnects the user + goes back home
 */
function onMDPChange(obj, ev) {
    const infos = {
        oldpassword: document.getElementById("input-oldpassword"),
        newpassword: document.getElementById("input-newpassword"),
        confirm: document.getElementById("input-confirm")
    };
    if (infos.newpassword.value !== infos.confirm.value) {
        alert("Les mots de passe ne sont pas identiques");
        return;
    }
    API.execute(API.ROUTE.PASSWORD, API.METHOD.POST, {
        username: User.currentUser.username,
        old: infos.oldpassword.value,
        new: infos.newpassword.value
    }, API.TYPE.JSON).then(data => {
        User.forgetUser();
        obj.$router.go(-1);
    }).catch(err => {
        console.log(err);
    });
}

export default {
    name: "ProfileView",
    components: {
        ButtonText,
        ButtonBlock,
        ValidatePopup,
        InputText,
        InputChoice,
        LogZone
    },
    setup() {
        if (!User.isConnected(User.currentUser)) {window.location.href = "/login";}
        return {
            languages: Lang.Langs,
            lang: Lang.CurrentLang,
            code: Lang.CurrentCode,
            icon: {user: UserIcon},
            User
        };
    },
    mounted() {
        Lang.AddCallback(lang => this.lang = lang);
        User.currentUser.fetchInformations();
    },
    methods: {
        onAccountSave(ev) { onAccountSave(this, ev) },
        onMDPChange(ev) { onMDPChange(this, ev) },
        removeAccount,
        async onLangChange(ev) {
            await Lang.LoadLang(ev.target.value);
            window.location.reload();
        },
        disconnect() { // log out the user
            User.forgetUser();
            window.location.href = '/';
        }
    }
};
</script>

<style>
</style>