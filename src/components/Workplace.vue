<template>
    <div
        class="bg-white rounded-lg p-4 h-fit w-[18em] md:w-[22em] m-4 border-slate-200 border-2 hover:border-indigo-600 transition-all"
    >
        <div class="top">
            <div class="flex justify-between center">
                <h2 class="text-indigo-600 font-bold text-lg whitespace-nowrap text-ellipsis overflow-hidden">
                    {{ workplace.name }}
                </h2>
            </div>
            <p class="text-gray-400 text-base text-sm line-clamp-2 h-10">
                {{ workplace.description }}
            </p>
        </div>
        <div class="pt-8 flex justify-between items-center min-w-0 max-w-full">
            <div class="flex space-x-2">
                <p
                    v-for="language in workplace.languages"
                    :key="language"
                >
                    {{ langs.find(el => el.code === language)?.unicode ?? language }}
                </p>
            </div>
            <button-block :href="'/workplaces/view?id=' + workplace.id">
                {{ lang.VIEW }}
            </button-block>
        </div>
    </div>
</template>

<script>
import ButtonBlock from "./inputs/ButtonBlock.vue";
import Lang from "../script/Lang";
import API from '../script/API';

function fetchLanguages() {
    return new Promise((resolve, reject) => {
        API.execute(API.ROUTE.LANGUAGES).then(res => {
            resolve(res);
        }).catch(reject);
    })
}

export default {
    name: "WorkplaceView",
    components: {
        ButtonBlock
    },
    props: {
        workplace: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            lang: Lang.CurrentLang,
            langs: []
        }
    },
    mounted() {
        Lang.AddCallback(lang => this.lang = lang);
        fetchLanguages().then(res => {
            this.langs = res;
        }).catch(console.error);
    }
}
</script>
