<template>
    <div
        class="bg-white rounded-lg p-4 h-fit max-w-full w-[18em] md:w-[22em] m-4 border-slate-200 border-2 hover:border-indigo-600 transition-all">
        <div class="top">
            <div class="flex justify-between center">
                <h2 class="text-indigo-600 font-bold text-lg whitespace-nowrap text-ellipsis overflow-hidden">
                    {{ activity.name }}
                </h2>
                <h2 class="ml-10 text-indigo-400 font-base text-base whitespace-nowrap">
                    {{ activity.machine }}
                </h2>
            </div>
            <p class="text-gray-400 text-base text-sm line-clamp-2 h-10">
                {{ activity.description }}
            </p>
        </div>
        <div class="pt-8 flex justify-between items-center min-w-0 max-w-full">
            <div class="flex space-x-2">
                <p v-for="language in activity.languages" :key="language">
                    {{ langs.find(el => el.code === language)?.unicode ?? language }}
                </p>
            </div>
            <button-block :href="'/activities/view?id=' + activity.id">
                {{ lang.VIEW }}
            </button-block>
            <button-block v-if="User.currentUser?.permissions >= User.PERMISSIONS.TEACHER"
                @click.native="duplicate_activity">
                Duplicate
            </button-block>
        </div>
    </div>
</template>

<script>
import ButtonBlock from "./inputs/ButtonBlock.vue";
import Lang from "../script/Lang";
import API from '../script/API';
import User from "../script/User";

function fetchLanguages() {
    return new Promise((resolve, reject) => {
        API.execute(API.ROUTE.LANGUAGES).then(res => {
            resolve(res);
        }).catch(reject);
    })
}



export default {
    name: "ActivityView",
    components: {
        ButtonBlock
    },
    props: {
        activity: {
            type: [Object, null],
            required: true
        }
    },
    data() {
        return {
            lang: Lang.CurrentLang,
            langs: [],
            User
        }
    },
    methods: {
        async duplicate_activity() {
            try {
                API.execute(API.ROUTE.ACTIVITIES + "duplicate/" + this.activity.id, API.METHOD.POST).then(res => {
                    this.$router.push('/activities/view?id=' + res.id)
                })
            } catch (error) {
                console.error(error);
            }
        }
    },
    mounted() {
        Lang.AddCallback(lang => this.lang = lang);
        fetchLanguages().then(res => {
            this.langs = res;
        });
    }
}
</script>
