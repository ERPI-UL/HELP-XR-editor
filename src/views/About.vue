<template>
    <!-- About page -->
    <div class="flex flex-col grow min-h-0 max-h-full min-w-0 max-w-full">
        <div class="flex flex-col items-center space-y-2 m-4">
            <img
                class="max-h-[20vw] md:max-h-[10vh] m-auto"
                src="../assets/images/logo_indigo.png"
                alt=""
            >
            <p class="text-3xl font-bold text-indigo-600">
                Indico - {{ lang.ABOUT }}
            </p>
        </div>
        <div class="flex md:flex-row flex-col grow md:mx-0 mx-auto">
            <div class="w-fit md:w-1/2">
                <div class="h-full w-fit mx-auto">
                    <p class="text-xl font-semibold text-slate-600"> {{ lang.INFORMATIONS }} </p>
                    <border-card class="bg-white p-4 space-y-4">
                        <div>
                            <p class="text-xl font-semibold text-slate-600"> {{ lang.AUTHORS }} </p>
                            <ul class="ml-4">
                                <li>
                                    <a
                                        href="https://fr.linkedin.com/in/alex-tr-gabriel"
                                        class="font-semibold text-indigo-600 hover:text-indigo-500"
                                    > Alex GABRIEL </a>
                                </li>
                                <li>
                                    <a
                                        href="https://fr.linkedin.com/in/alaa-hassan-18a68150"
                                        class="font-semibold text-indigo-600 hover:text-indigo-500"
                                    > Alaa Hassan </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <p class="text-xl font-semibold text-slate-600"> {{ lang.DEVELOPERS }} </p>
                            <ul class="ml-4">
                                <li>
                                    <a
                                        href="https://fr.linkedin.com/in/antonin-rousseau-571280159"
                                        class="font-semibold text-indigo-600 hover:text-indigo-500"
                                    > Antonin ROUSSEAU </a>
                                </li>
                                <li>
                                    <a
                                        href="https://fr.linkedin.com/in/loisil-paul"
                                        class="font-semibold text-indigo-600 hover:text-indigo-500"
                                    > Paul LOISIL </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <p class="text-xl font-semibold text-slate-600"> {{ lang.CONTRIBUTORS }} </p>
                            <ul class="ml-4">
                                <li>
                                    <a
                                        href="https://fr.linkedin.com/in/clarisse-dubot-444568263"
                                        class="font-semibold text-indigo-600 hover:text-indigo-500"
                                    > Clarisse DUBOT </a>
                                </li>
                                <li>
                                    <a
                                        href="https://fr.linkedin.com/in/josselin-deborde-695569217"
                                        class="font-semibold text-indigo-600 hover:text-indigo-500"
                                    > Josselin DEBORDE </a>
                                </li>
                                <li>
                                    <a
                                        href="https://fr.linkedin.com/in/meysam-imani-pour-1955701b1"
                                        class="font-semibold text-indigo-600 hover:text-indigo-500"
                                    > Meysam IMANIPOUR </a>
                                </li>
                            </ul>
                        </div>
                    </border-card>
                </div>
            </div>
            <div class="w-fit md:w-1/2">
                <div class="h-full w-fit mx-auto">
                    <p class="text-xl font-semibold text-slate-600"> {{ lang.LINKS }} </p>
                    <border-card class="bg-white p-4 space-y-4">
                        <a
                            href="/doc/index.html"
                            class="font-semibold text-indigo-600 hover:text-indigo-500"
                        >
                            {{ lang.DOCUMENTATION }}
                        </a>
                    </border-card>
                </div>
            </div>
        </div>
        <div class="p-4">
            <border-card class="flex flex-col m-4 p-2 bg-white m-auto w-fit">
                <img
                    class="mx-auto w-80"
                    src="../assets/images/grand_est.png"
                    alt=""
                >
                <p class="font-semibold text-gray-600 my-auto mt-2 text-center">
                    {{ lang.WITH_GRANDEST_SUPPORT }}
                </p>
            </border-card>
        </div>
    </div>
</template>

<script>
import BorderCard from '../components/cards/BorderCard.vue';
import Lang from '../script/Lang';
import User from "../script/User";

function setup() {
    
}

export default {
    name: "AboutView",
    components: {
        BorderCard
    },
    data() {
        return {
            lang: Lang.CurrentLang,
            User
        }
    },
    mounted() {
        Lang.AddCallback(lang => this.lang = lang);
        setup();
    }
};
</script>


<style>
</style>