<template>
    <div class="flex max-w-full h-fit">
        <border-card class="flex flex-col z-50 items-center w-full h-fit bg-white p-2">
            <!-- DESKTOP MENU START -->
            <div class="flex w-full h-fit items-center">
                <div class="flex w-[16em] h-fit justify-start items-center">
                    <router-link
                        class="flex h-fit rounded hover:bg-indigo-100"
                        :class="$route.path === '/' ? 'w-10' : 'w-0'"
                        to="/"
                    >
                        <img
                            src="../assets/images/logo_indigo.png"
                            alt=""
                            class="w-full"
                        >
                    </router-link>
                    <button
                        class="flex h-fit rounded text-indigo-600 hover:bg-indigo-100"
                        :class="$route.path !== '/' ? 'w-10' : 'w-0'"
                        @click="goBack"
                    >
                        <arrow-left-icon class="w-full h-8 m-1" />
                    </button>
                </div>
                <div class="flex flex-row w-fit h-full mx-auto items-center">
                    <div
                        class="md:flex hidden grow justify-center h-fit space-x-2 lg:space-x-8"
                        :class="$route.path === '/' ? 'w-fit overflow-visible opacity-1' : 'max-w-0 overflow-hidden opacity-0'"
                    >
                        <div
                            v-for="item in menu"
                            :key="item"
                            class="flex flex-col w-fit h-fit"
                        >
                            <button-text
                                :href="item.href"
                                :selected="$route.path === item.href"
                                :onclick="() => item.show = !item.show"
                            >
                                <p class="flex text-md font-semibold">
                                    {{ item.name }}
                                </p>
                                <div
                                    v-if="item.elements"
                                    class="flex h-full w-fit items-center justify-center"
                                >
                                    <chevron-down-icon class="w-6" />
                                </div>
                            </button-text>
                            <dropdown-card
                                v-if="item.elements"
                                ref="panel"
                                class="flex m-auto justify-end"
                                side="center"
                                :show="item.show"
                                :ondismiss="() => item.show = false"
                            >
                                <button-text
                                    v-for="el in item.elements"
                                    v-show="el.show === undefined || el.show"
                                    :key="el.name"
                                    :href="el.href"
                                    class="mx-auto whitespace-nowrap text-ellipsis overflow-hidden"
                                >
                                    {{ el.name }}
                                </button-text>
                            </dropdown-card>
                        </div>
                    </div>
                    <div
                        class="md:flex hidden grow justify-center h-fit space-x-2 lg:space-x-8"
                        :class="$route.path !== '/' ? 'w-fit overflow-visible opacity-1' : 'max-w-0 overflow-hidden opacity-0'"
                    >
                        <h1 class="md:text-2xl text-xl font-extrabold whitespace-nowrap text-indigo-600 md:pl-4 pl-0">
                            {{ title.split("<loading>")[0] }}
                        </h1>
                        <div
                            v-if="title.split('<loading>').length > 1"
                            class="flex"
                        >
                            <h1 class="md:text-2xl text-xl font-extrabold whitespace-nowrap text-slate-400 md:pl-4 pl-0">
                                . . .
                            </h1>
                            <h1 class="md:text-2xl text-xl font-extrabold whitespace-nowrap text-indigo-600 md:pl-4 pl-0">
                                {{ title.split("<loading>")[1] }}
                            </h1>
                        </div>
                    </div>
                </div>
                <div
                    class="md:flex hidden h-fit justify-end items-center"
                    :class="$route.path !== '/' ? 'w-[16em]' : 'w-0'"
                >
                    <button
                        class="flex h-fit rounded text-indigo-600 hover:bg-indigo-100"
                        :class="$route.path !== '/' ? 'w-10' : 'w-0'"
                        @click="toggleMenu"
                    >
                        <menu-icon class="w-full m-1" />
                    </button>
                </div>
                <div
                    class="flex overflow-hidden justify-end"
                    :class="$route.path === '/' ? 'w-[16em]' : 'w-0'"
                >
                    <div
                        v-if="User.currentUser !== null"
                        class="md:flex hidden flex-col w-fit h-fit items-end"
                    >
                        <button-block
                            ref="btn-profile"
                            href="/profile"
                        >
                            <user-icon class="w-6" />
                            <p>
                                {{ lang.PROFILE }}
                            </p>
                        </button-block>
                    </div>
                    <div
                        v-if="User.currentUser === null"
                        class="md:flex hidden w-fit h-fit items-end space-x-4"
                    >
                        <button-text
                            href="/register"
                            class="mx-auto whitespace-nowrap text-ellipsis overflow-hidden"
                        >
                            {{ lang.REGISTER }}
                        </button-text>
                        <button-block
                            href="/login"
                            class="mx-auto whitespace-nowrap text-ellipsis overflow-hidden"
                        >
                            {{ lang.LOGIN }}
                        </button-block>
                    </div>
                </div>
                <div
                    class="md:hidden flex w-full h-fit"
                >
                    <button
                        class="flex w-full justify-end h-fit text-slate-600"
                        @click="() => showMobilePanel = !showMobilePanel"
                    >
                        <menu-icon class="w-7" />
                    </button>
                </div>
            </div>
            <!-- MOBILE MENU START -->
            <div
                class="md:hidden flex flex-col w-full"
                :class="showMobilePanel ? '' : 'hidden'"
            >
                <div
                    v-for="item in mobileMenu"
                    :key="item"
                >
                    <button-text
                        class="m-auto"
                        :href="item.elements ? '' : item.href"
                        :onclick="item.elements ? () => item.show = !item.show : null"
                    >
                        <p class="flex text-md font-semibold">
                            {{ item.name }}
                        </p>
                        <div
                            v-show="item.elements"
                            class="flex h-full w-fit items-center justify-center"
                        >
                            <chevron-down-icon class="w-6" />
                        </div>
                    </button-text>
                    <div
                        v-show="item.elements && item.show"
                        class="flex flex-col space-y-2 border-2 border-slate-200 rounded-lg w-fit mx-auto bg-slate-50 p-1"
                    >
                        <button-text
                            v-for="el in item.elements"
                            :key="el"
                            class="m-auto"
                            :href="el.href"
                        >
                            <p class="flex text-md font-semibold">
                                {{ el.name }}
                            </p>
                        </button-text>
                    </div>
                </div>
                <div class="flex w-full px-20 py-2">
                    <span class="flex mx-auto h-1 w-full bg-slate-200 rounded-lg" />
                </div>
                <div
                    v-if="User.currentUser === null"
                    class="flex items-center justify-evenly"
                >
                    <button-text
                        href="/register"
                        class="whitespace-nowrap text-ellipsis overflow-hidden"
                    >
                        {{ lang.REGISTER }}
                    </button-text>
                    <button-block
                        href="/login"
                        class="whitespace-nowrap text-ellipsis overflow-hidden"
                    >
                        {{ lang.LOGIN }}
                    </button-block>
                </div>
                <div
                    v-if="User.currentUser !== null"
                    class="flex items-center justify-evenly pt-2"
                >
                    <button-text
                        :onclick="disconnect"
                        class="whitespace-nowrap text-ellipsis overflow-hidden"
                    >
                        {{ lang.DISCONNECT }}
                    </button-text>
                    <button-block
                        href="/profile"
                    >
                        <user-icon class="w-6" />
                        <p>
                            {{ lang.PROFILE }}
                        </p>
                    </button-block>
                </div>
            </div>
            <!-- MOBILE MENU END -->
        </border-card>
    </div>
</template>

<script>
import ButtonBlock from "./inputs/ButtonBlock.vue";
import ButtonText from './inputs/ButtonText.vue';
import BorderCard from './cards/BorderCard.vue';
import DropdownCard from './cards/DropdownCard.vue';
import User from "../script/User";
import Lang from '../script/Lang';

import {
    LinkIcon,
    TerminalIcon,
    InformationCircleIcon,
    MailOpenIcon
} from '@heroicons/vue/outline';
import {
    ChevronDownIcon,
    UserIcon,
    MenuIcon,
    ArrowLeftIcon
} from '@heroicons/vue/solid';

/** Variable containing all the menu's options */
let menu = [
    { // scenarios options (the other options are added later in the script depending on the user's role)
        name: Lang.CurrentLang.ACTIVITIES_LINK_NAME,
        description: Lang.CurrentLang.ACTIVITIES_LINK_DESC,
        href: '/activities'
    },
    { // machine options (the other options are added later in the script depending on the user's role)
        name: Lang.CurrentLang.ARTIFACTS_LINK_NAME,
        description: Lang.CurrentLang.ARTIFACTS_LINK_DESC,
        href: '/artifacts'
    },
    { // statistics options
        name: Lang.CurrentLang.WORKPLACES_LINK_NAME,
        description: Lang.CurrentLang.WORKPLACES_LINK_DESC,
        href: '/workplaces'
    },
    { // statistics options
        name: Lang.CurrentLang.STATISTICS_LINK_NAME,
        description: Lang.CurrentLang.STATISTICS_LINK_DESC,
        href: '/statistics'
    },
    { // other options (the administrator option is added later if the user is an administrator)
        name: Lang.CurrentLang.OTHER,
        show: false,
        elements: [
            {
                name: Lang.CurrentLang.EASYCONNECT_LINK_NAME,
                description: Lang.CurrentLang.EASYCONNECT_LINK_DESC,
                href: '/easyconnect',
                icon: LinkIcon
            },
            {
                name: Lang.CurrentLang.INVITE_LINK_NAME,
                description: Lang.CurrentLang.INVITE_LINK_DESC,
                show: User.currentUser?.permissions > 1,
                href: '/generateInvite',
                icon: MailOpenIcon
            },
            {
                name: Lang.CurrentLang.ADMIN_LINK_NAME,
                description: Lang.CurrentLang.ADMIN_LINK_DESC,
                show: User.currentUser?.permissions > 2,
                href: '/admin',
                icon: TerminalIcon
            },
            {
                name: Lang.CurrentLang.ABOUT_LINK_NAME,
                description: Lang.CurrentLang.ABOUT_LINK_DESC,
                href: '/about',
                icon: InformationCircleIcon
            }
        ]
    }
];

let mobileMenu = [
    { // scenarios options (the other options are added later in the script depending on the user's role)
        name: Lang.CurrentLang.ACTIVITIES_LINK_NAME,
        description: Lang.CurrentLang.ACTIVITIES_LINK_DESC,
        href: '/activities'
    },
    { // statistics options
        name: Lang.CurrentLang.WORKPLACES_LINK_NAME,
        description: Lang.CurrentLang.WORKPLACES_LINK_DESC,
        href: '/workplaces'
    },
    { // statistics options
        name: Lang.CurrentLang.STATISTICS_LINK_NAME,
        description: Lang.CurrentLang.STATISTICS_LINK_DESC,
        href: '/statistics'
    },
    {
        name: Lang.CurrentLang.EASYCONNECT_LINK_NAME,
        description: Lang.CurrentLang.EASYCONNECT_LINK_DESC,
        href: '/easyconnect',
        icon: LinkIcon
    },
    {
        name: Lang.CurrentLang.ABOUT_LINK_NAME,
        description: Lang.CurrentLang.ABOUT_LINK_DESC,
        href: '/about',
        icon: InformationCircleIcon
    }
];

export default {
    name: "TopbarView",
    components: {
        ChevronDownIcon,
        ButtonBlock,
        ButtonText,
        BorderCard,
        UserIcon,
        DropdownCard,
        MenuIcon,
        ArrowLeftIcon
    },
    data() {
        window.topbar = this;
        return {
            lang: Lang.CurrentLang,
            User,
            menu,
            mobileMenu,
            showMobilePanel: false,
            title: ""
        }
    },
    watch: {
        '$route': {
            deep: true,
            handler() {
                this.showProfilePanel = false;
                this.showMobilePanel = false;
                this.menu.forEach(item => {
                    if (item.elements) item.show = false;
                });
                this.title = this.$route.meta.title?.();
                this.closeMenu();
            }
        }
    },
    mounted() {
        Lang.AddCallback(lang => this.lang = lang);
    },
    methods: {
        update() {
            this.title = this.$route.meta.title?.();
        },
        openMenu() {
            if (burgerMenu) {
                burgerMenu.style.maxWidth = "20em";
                burgerMenu.style.overflow = "visible";
            }
        },
        closeMenu() {
            if (burgerMenu) {
                burgerMenu.style.maxWidth = "0em";
                burgerMenu.style.overflow = "hidden";
            }
        },
        toggleMenu() {
            if (burgerMenu?.style.maxWidth === "0em")
                this.openMenu();
            else this.closeMenu();
        },
        goBack() {
            const backRoute = this.$route.path.split("/").slice(0, -1).join("/");
            this.$router.push(backRoute.length === 0 ? '/' : backRoute);
        },
        disconnect() { // log out the user
            User.forgetUser();
            window.location.href = '/';
        }
    }
}
</script>