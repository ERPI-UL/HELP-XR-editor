<template>
    <div class="flex flex-col grow max-w-full">
        <div
            id="topbar"
            class="m-2"
        >
            <Topbar />
        </div>
        <div class="flex grow max-w-full max-h-full min-h-0">
            <div class="flex grow w-full h-full min-h-0 min-w-0">
                <router-view
                    id="router-view"
                    class="flex grow max-h-full min-h-0 max-w-full w-full overflow-auto"
                />
            </div>
            <!-- RIGHT MENU (burger) START -->
            <div
                ref="burger-menu"
                style="max-width: 0em"
                class="flex grow h-full w-fit transition-all py-1 pb-2 overflow-hidden"
            >
                <div class="flex grow w-fit h-full py-2">
                    <span class="h-full w-1 bg-slate-200 rounded-md" />
                </div>
                <div class="flex flex-col p-4 ml-2 rounded-md bg-white items-end space-y-4">
                    <div class="flex flex-col w-full h-fit rounded overflow-hidden">
                        <router-link
                            class="flex text-lg font-semibold text-slate-700 py-1 px-4 border-2 transition-colors"
                            :class="$route.path === '/' ? 'border-indigo-600 bg-indigo-100' : 'border-slate-200 bg-slate-100 hover:border-slate-400'"
                            to="/"
                        >
                            <p class="flex text-md font-semibold">
                                {{ lang.HOME }}
                            </p>
                        </router-link>
                    </div>
                    <div
                        v-for="item in menu"
                        :key="item"
                        class="flex flex-col w-full h-fit rounded overflow-hidden"
                    >
                        <router-link
                            v-if="item.href"
                            class="flex text-lg font-semibold text-slate-700 py-1 px-4 border-2 transition-colors"
                            :class="$route.path === item.href ? 'border-indigo-600 bg-indigo-100' : 'border-slate-200 bg-slate-100 hover:border-slate-400'"
                            :to="item.href"
                        >
                            <div
                                v-if="item.elements"
                                class="flex h-full w-fit items-center justify-center"
                            >
                                <chevron-down-icon class="w-6" />
                            </div>
                            <p class="flex text-md font-semibold">
                                {{ item.name }}
                            </p>
                        </router-link>
                        <button
                            v-if="!item.href"
                            class="flex flex-col text-lg font-semibold text-slate-700 p-1 border-2 transition-colors"
                            :class="$route.path === item.href ? 'border-indigo-600 bg-indigo-100' : 'border-slate-200 bg-slate-100'"
                            @click="item.show = !item.show"
                        >
                            <div class="flex w-full px-2 items-center">
                                <div
                                    v-if="item.elements"
                                    class="flex h-fit w-fit items-center justify-center"
                                >
                                    <chevron-down-icon
                                        class="w-6"
                                        :class="item.show ? 'transform rotate-180' : ''"
                                    />
                                </div>
                                <p class="flex text-md font-semibold">
                                    {{ item.name }}
                                </p>
                            </div>
                        </button>
                        <div class="pl-4">
                            <div
                                v-if="item.elements"
                                class="flex flex-col m-auto items-start bg-white min-w-0 w-full space-y-2 px-2"
                                :class="item.show ? 'h-fit py-2' : 'h-0 py-0 overflow-hidden'"
                            >
                                <router-link
                                    v-for="el in item.elements"
                                    v-show="el.show === undefined || el.show"
                                    :key="el.name"
                                    :to="el.href"
                                    class="flex text-lg font-semibold text-slate-700 py-1 px-4 border-2 transition-colors rounded w-full"
                                    :class="$route.path === item.href ? 'border-indigo-600 bg-indigo-100' : 'border-slate-200 bg-slate-100 hover:border-slate-400'"
                                >
                                    <p class="flex text-md font-semibold whitespace-nowrap">
                                        {{ el.name }}
                                    </p>
                                </router-link>
                            </div>
                        </div>
                    </div>
                    <div
                        v-if="User.currentUser !== null"
                        class="flex grow items-end justify-center w-full"
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
                        class="flex grow items-end justify-center w-full"
                    >
                        <div class="flex flex-wrap justify-between">
                            <button-text
                                href="/register"
                                class="mx-auto my-1 whitespace-nowrap text-ellipsis overflow-hidden"
                            >
                                {{ lang.REGISTER }}
                            </button-text>
                            <button-block
                                href="/login"
                                class="mx-auto my-1 whitespace-nowrap text-ellipsis overflow-hidden"
                            >
                                {{ lang.LOGIN }}
                            </button-block>
                        </div>
                    </div>
                </div>
            </div>
            <!-- RIGHT MENU (burger) END -->
        </div>
    </div>
</template>

<script>
import Topbar from "./components/Topbar.vue";

import {
    ChevronDownIcon,
    UserIcon
} from "@heroicons/vue/solid";
import ButtonBlock from './components/inputs/ButtonBlock.vue';
import ButtonText from './components/inputs/ButtonText.vue';
import Lang from './script/Lang';
import User from './script/User';

export default {
    name: "App",
    components: {
        Topbar,
        ChevronDownIcon,
        ButtonBlock,
        ButtonText,
        UserIcon
    },
    data() {
        return {
            menu: [],
            lang: Lang.CurrentLang,
            User
        }
    },
    mounted() {
        window.burgerMenu = this.$refs["burger-menu"];
        this.menu = topbar.menu;
    }
};
</script>

<style>
</style>