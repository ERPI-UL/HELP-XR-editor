<template>
    <!-- Home page, with topbar and a little window with some basic introduction text -->
    <div class="flex flex-col grow min-h-0 max-h-full min-w-0 max-w-full items-center justify-center">
        <div class="flex justify-between text-2xl text-indigo-600 font-extrabold w-full bg-white py-2 px-4 rounded-lg select-none">
            <p class="w-fit">
                {{ lang.TRANSLATIONS }}
                -
                {{ activity.name ? activity.name[Lang.CurrentCode] : '' }}
            </p>
            <button
                class="h-fit w-fit whitespace-nowrap inline-flex items-center justify-center h-full px-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                @click="saveTranslations"
            >
                {{ lang.CLOSE }}
            </button>
        </div>
        <div class="flex w-full min-h-0 h-full grow border-2 border-white rounded-lg">
            <div class="flex flex-col w-full">
                <div
                    class="flex flex-row w-full justify-evenly divide-x-2 divide-slate-400 sticky top-0 border-b-2 border-slate-400 bg-indigo-50
                           font-semibold text-slate-700 text-lg"
                >
                    <div class="w-full p-1">
                        <p class="w-fit mx-auto"> Langue </p>
                    </div>
                    <div
                        class="w-full p-1"
                        v-for="lang in langs"
                        :key="lang.name"
                    >
                        <p class="w-fit mx-auto"> {{ lang.unicode + " " + lang.name }} </p>
                    </div>
                </div>
                <div class="overflow-auto divide-y-2 divide-slate-400">
                    <!-- INFORMATIONS -->
                    <div class="flex flex-row w-full justify-evenly divide-x-2 divide-slate-400">
                        <div class="flex w-full items-center">
                            <div class="w-1/2">
                                <p class="w-fit mx-auto whitespace-nowrap overflow-hidden text-ellipsis"> {{ lang.ACTIVITY }} </p>
                            </div>
                            <div class="flex flex-col h-full w-1/2">
                                <p class="flex w-fit h-fit mx-auto whitespace-nowrap overflow-hidden text-ellipsis"> {{ lang.TITLE }} </p>
                                <p class="flex w-fit h-full items-center grow mx-auto whitespace-nowrap overflow-hidden text-ellipsis"> {{ lang.DESCRIPTION }} </p>
                            </div>
                        </div>
                        <div
                            class="w-full text-base font-medium text-black"
                            v-for="lang in langs"
                            :key="lang.name"
                        >
                            <input
                                :value="activity.name ? activity.name[lang.code] : ''"
                                @change="ev => activity.name[lang.code] = ev.target.value"
                                class="whitespace-nowrap w-full p-1 border-gray-200 bg-gray-50"
                            />
                            <textarea
                                style="resize: none;"
                                @change="ev => activity.description[lang.code] = ev.target.value"
                                class="w-full p-1 border-gray-200 text-base font-medium text-black bg-gray-50"
                            >{{ activity.description ? activity.description[lang.code] : '' }}</textarea>
                        </div>
                    </div>

                    <!-- ACTIONS -->
                    <div
                        class="flex flex-row w-full justify-evenly divide-x-2 divide-slate-400"
                        v-for="(action, aindex) in activity.actions"
                        :key="action"
                    >
                        <div class="flex w-full items-center">
                            <div class="w-1/2">
                                <p class="w-fit mx-auto"> {{ lang.ACTION + " " + (aindex+1) }} </p>
                            </div>
                            <div class="flex flex-col grow h-full w-1/2 divide-y-2 divide-indigo-200 justify-between">
                                <p class="flex w-full justify-center mx-auto items-center whitespace-nowrap overflow-hidden text-ellipsis h-[2em]"> {{ lang.TITLE }} </p>
                                <p class="flex w-full justify-center mx-auto items-center whitespace-nowrap overflow-hidden text-ellipsis h-[2em]"> {{ lang.HINT }} </p>
                                <p class="flex w-full h-[2em] justify-center items-center grow mx-auto"> {{ lang.DESCRIPTION }} </p>
                                <div v-show="action?.type === 'choice'" class="h-[4.25em]">
                                    <p class="flex w-full justify-center mx-auto items-center whitespace-nowrap overflow-hidden text-ellipsis h-1/2"> {{ lang.OPTION_LEFT }} </p>
                                    <p class="flex w-full justify-center mx-auto items-center whitespace-nowrap overflow-hidden text-ellipsis h-1/2"> {{ lang.OPTION_RIGHT }} </p>
                                </div>
                            </div>
                        </div>
                        <div
                            class="w-full text-base font-medium text-black"
                            v-for="lang in langs"
                            :key="lang"
                        >
                            <input
                                :value="action.name[lang.code] ?? ''"
                                @change="ev => action.name[lang.code] = ev.target.value"
                                class="whitespace-nowrap w-full p-1 border-gray-200 bg-gray-50"
                            />
                            <input
                                :value="action.hint[lang.code] ?? ''"
                                @change="ev => action.hint[lang.code] = ev.target.value"
                                class="whitespace-nowrap w-full p-1 border-gray-200 bg-gray-50"
                            />
                            <textarea
                                style="resize: none;"
                                class="w-full p-1 border-gray-200 text-base font-medium text-black bg-gray-50"
                                @change="ev => action.description[lang.code] = ev.target.value"
                            >{{ action.description[lang.code] ?? '' }}</textarea>
                            <div v-show="action?.type === 'choice'" class="divide-y-2 divide-slate-200">
                                <input
                                    :value="action.choice?.left.name ? action.choice?.left.name[lang.code] : ''"
                                    @change="ev => action.choice.left.name[lang.code] = ev.target.value"
                                    class="whitespace-nowrap w-full p-1 border-gray-200 bg-gray-50"
                                />
                                <input
                                    :value="action.choice?.right.name ? action.choice?.right.name[lang.code] : ''"
                                    @change="ev => action.choice.right.name[lang.code] = ev.target.value"
                                    class="whitespace-nowrap w-full p-1 border-gray-200 bg-gray-50"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Lang from '../script/Lang';
import User from '../script/User';
import API from '../script/API';

export default {
    name: "TranslationsView",
    components: {},
    data() {
        return {
            lang: Lang.CurrentLang,
            Lang,
            User,
            langs: [],
            activity: {},
            JSON
        }
    },
    watch: {
        activity: {
            deep: true,
            handler() {
                window.updateTranslation(this.activity);
            }
        }
    },
    mounted() {
        Lang.AddCallback(lang => this.lang = lang);

        // delete the topbar
        document.getElementById("topbar").remove();

        let interval = setInterval(() => {
            this.activity = window.activity;
            if (this.activity !== undefined) {
                clearInterval(interval);
                interval = -1;
            }
        }, 100);
        setTimeout(() => {
            if (interval !== -1) {
                clearInterval(interval);
                interval = -1;
                // close();
            }
        }, 1000);

        API.execute(API.ROUTE.LANGUAGES).then(res => {
            this.langs = res;
        }).catch(err => { alert("cannot get langs"); console.error(err) });

        window.refresh = () => {
            this.activity = window.activity;
            this.$forceUpdate();
        };
    },
    methods: {
        saveTranslations() {
            window.close();
        }
    }
};
</script>


<style>
</style>