<template>
    <div class="flex flex-col grow min-h-0 max-h-full min-w-0 max-w-full">
        <div class="flex grow max-h-full">
            <div class="flex flex-col grow m-2 min-h-0 max-h-full overflow-x-hidden overflow-y-scroll">
                <div class="m-4 w-fit h-fit max-h-full">
                    <button-block
                        v-if="User.currentUser?.permissions >= User.PERMISSIONS.TEACHER"
                        href="/artifacts/create"
                    >
                        <PlusIcon
                            class="flex-shrink-0 h-5 mr-2"
                            aria-hidden="true"
                        />
                        {{ lang.NEW_ARTIFACT }}
                    </button-block>
                </div>
                <div class="md:m-2 md:ml-4 flex overflow-y-auto overflow-x-hidden grow flex-wrap justify-evenly">
                    <div
                        v-if="artifacts.length > 0"
                        class="flex flex-wrap justify-evenly"
                    >
                        <Artifact
                            v-for="item in artifacts"
                            :key="item"
                            :artifact="item"
                        />
                    </div>
                    <div
                        v-if="artifacts.length === 0 && !loadingArtifacts"
                        class="flex flex-col grow justify-center items-center"
                    >
                        <p class="text-2xl font-bold text-slate-600 text-center"> {{ lang.NO_ARTIFACTS }} </p>
                        <p class="text-xl font-semibold text-slate-500 text-center"> {{ lang.NO_ARTIFACTS_DESC }} </p>
                    </div>
                    <div
                        v-if="loadingArtifacts"
                        class="flex flex-col grow justify-center items-center"
                    >
                        <p class="text-2xl font-bold text-slate-600 text-center"> {{ lang.LOADING_ARTIFACTS }} </p>
                        <p class="text-xl font-semibold text-slate-500 text-center"> {{ lang.LOADING_ARTIFACTS_DESC }} </p>
                    </div>
                </div>
                <!-- Pagination controls -->
                <div class="flex grow-0 p-2 justify-center w-full">
                    <PaginationController
                        :pagination="pagination"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Artifact from "../components/Artifact.vue";
import ButtonBlock from "../components/inputs/ButtonBlock.vue";
import PaginationController from '../components/PaginationController.vue';
import User from "../script/User";
import API from '../script/API';
import Lang from '../script/Lang';

import {
    PlusIcon
} from "@heroicons/vue/solid";

export default {
    name: "ArtifactsView",
    components: {
        Artifact,
        ButtonBlock,
        PlusIcon,
        PaginationController
    },
    data() {
        return {
            lang: Lang.CurrentLang,
            User,
            artifacts: [],
            pagination: API.createPagination(1, 8),
            loadingArtifacts: false
        }
    },
    mounted() {
        Lang.AddCallback(lang => this.lang = lang);
        this.pagination.onChanged(this.fetchArtifacts);
        this.fetchArtifacts();
    },
    methods: {
        fetchArtifacts() {
            this.loadingArtifacts = true;
            API.execute(API.ROUTE.ARTIFACTS + this.pagination + "&language_code=" + Lang.CurrentCode).then(res => {
                this.setArtifacts(res.items);
                this.pagination.fromRequest(res);
                this.loadingArtifacts = false;
            });
        },
        setArtifacts(artifacts) {
            this.artifacts = [];
            if (!artifacts) return;

            for (let art of artifacts) {
                this.artifacts.push(art);
            }
            this.$forceUpdate();
        }
    }
};
</script>