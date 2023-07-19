<template>
    <div
        ref="master-loading"
        class="flex grow items-center justify-center absolute w-full h-full bg-slate-900/[0.6] opacity-0 transition-all duration-300 hidden p-2"
    >
        <border-card class="flex flex-col bg-white p-2 min-w-[20%] min-h-[20%]">
            <div v-if="!errorState">
                <p class="text-xl font-bold text-indigo-600 whitespace-nowrap text-ellipsis overflow-hidden">
                    {{ title || 'Loading ...' }}
                </p>
                <span class="flex h-1 w-full rounded bg-slate-200 my-2" />
                <div class="flex flex-col grow items-center justify-center">
                    <p class="text-center text-xl font-bold text-slate-600">
                        {{ desc || 'Please wait ...' }}
                    </p>
                    <spin-loading class="w-10 h-10 m-4" />
                </div>
            </div>
            <div v-if="errorState">
                <p class="text-xl font-bold text-indigo-600 whitespace-nowrap text-ellipsis overflow-hidden">
                    {{ errTitle || 'Error' }}
                </p>
                <span class="flex h-1 w-full rounded bg-slate-200 my-2" />
                <div class="flex flex-col grow items-start">
                    <p
                        v-for="line in errDesc.split('\n')"
                        :key="line"
                        class="text-center text-xl font-bold text-slate-600"
                    >
                        {{ line }}
                    </p>
                </div>
                <p class="text-center text-4xl font-extrabold text-indigo-600 my-4">:/</p>
                <div class="flex grow w-full h-fit">
                    <slot />
                </div>
            </div>
            <log-zone
                ref="log-zone"
                class="mt-4"
            />
            <div
                v-show="errorState"
                class="flex justify-between"
            >
                <button-text
                    :onclick="() => $router.go(-1)"
                >
                    {{ lang.BACK }}
                </button-text>
                <button-block
                    v-if="errValidate?.trim()"
                    :color="errColor"
                    :onclick="errCallback"
                >
                    {{ errValidate || 'Delete' }}
                </button-block>
            </div>
        </border-card>
    </div>
</template>

<script>
import BorderCard from "./BorderCard.vue";
import SpinLoading from "./SpinLoading.vue";
import ButtonText from "../inputs/ButtonText.vue";
import ButtonBlock from "../inputs/ButtonBlock.vue";
import Lang from '../../script/Lang';
import LogZone from './LogZone.vue';

export default {
    name: "MasterLoading",
    components: {
        BorderCard,
        SpinLoading,
        ButtonText,
        ButtonBlock,
        LogZone
    },
    props: {
        title: {
            type: String,
            default: "Loading ...",
            required: false
        },
        desc: {
            type: String,
            default: "Please wait ...",
            required: false
        },
        errTitle: {
            type: String,
            default: "Error",
            required: false
        },
        errDesc: {
            type: String,
            default: "An error occured",
            required: false
        },
        errValidate: {
            type: String,
            default: "Delete",
            required: false
        },
        errCallback: {
            type: Function,
            default: () => {},
            required: false
        },
        errColor: {
            type: String,
            default: "indigo",
            required: false
        }
    },
    data() {
        return {
            errorState: false,
            lang: Lang.CurrentLang
        }
    },
    mounted() {
        const masterLoading = this.$refs['master-loading']
        const router = document.getElementById("router-view");
        router.appendChild(masterLoading);

        this.start = () => {
            masterLoading.classList.remove("hidden");
            masterLoading.style.opacity = "0";
            setTimeout(() => { masterLoading.style.opacity = "1"; }, 10);
        };
        this.stop = () => {
            setTimeout(() => {
                masterLoading.style.opacity = "0";
                setTimeout(() => {
                    masterLoading.classList.add("hidden");
                    this.errorState = false;
                }, 300);
            }, 10);
        };
        this.error = () => {
            this.errorState = true;
        };
        this.log = (msg, style) => this.$refs['log-zone'].log(msg, style);
    },
    methods: {

    }
}
</script>