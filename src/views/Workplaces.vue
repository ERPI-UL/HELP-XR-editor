<template>
    <div class="flex flex-col grow min-h-0 max-h-full min-w-0 max-w-full">
        <div class="flex grow max-h-full">
            <div class="flex flex-col grow m-2 min-h-0 max-h-full overflow-x-hidden overflow-y-scroll">
                <div class="m-4 w-fit h-fit max-h-full md:flex hidden">
                    <button-block
                        v-if="User.currentUser?.permissions >= User.PERMISSIONS.TEACHER"
                        href="/workplaces/create"
                    >
                        <PlusIcon
                            class="flex-shrink-0 h-5 mr-2"
                            aria-hidden="true"
                        />
                        {{ lang.NEW_WORKPLACE }}
                    </button-block>
                </div>
                <div class="mx-auto w-fit h-fit max-h-full md:hidden flex">
                    <button-block
                        :onclick="() => $refs['qr-scanner'].open()"
                    >
                        <qrcode-icon
                            class="flex-shrink-0 h-5 mr-2"
                            aria-hidden="true"
                        />
                        {{ lang.SCAN }}
                    </button-block>
                </div>
                <div class="md:m-2 md:ml-4 flex overflow-y-auto overflow-x-hidden grow flex-wrap justify-evenly">
                    <div
                        v-if="workplaces.length > 0"
                        class="flex flex-wrap justify-evenly"
                    >
                        <Workplace
                            v-for="item in workplaces"
                            :key="item"
                            :workplace="item"
                        />
                    </div>
                    <div
                        v-if="workplaces.length === 0 && !loadingWorkplaces"
                        class="flex flex-col grow justify-center items-center"
                    >
                        <p class="text-2xl font-bold text-slate-600 text-center"> {{ lang.NO_WORKPLACES }} </p>
                        <p class="text-xl font-semibold text-slate-500 text-center"> {{ lang.NO_WORKPLACES_DESC }} </p>
                    </div>
                    <div
                        v-if="loadingWorkplaces"
                        class="flex flex-col grow justify-center items-center"
                    >
                        <p class="text-2xl font-bold text-slate-600 text-center"> {{ lang.LOADING_WORKPLACES }} </p>
                        <p class="text-xl font-semibold text-slate-500 text-center"> {{ lang.LOADING_WORKPLACES_DESC }} </p>
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
        <qr-scanner ref="qr-scanner" />
    </div>
</template>

<script>
import Workplace from "../components/Workplace.vue";
import ButtonBlock from "../components/inputs/ButtonBlock.vue";
import PaginationController from '../components/PaginationController.vue';
import User from "../script/User";
import API from '../script/API';
import Lang from '../script/Lang';
import QrScanner from '../components/workplaces/QrScanner.vue';

import {
    PlusIcon,
    QrcodeIcon
} from "@heroicons/vue/solid";

export default {
    name: "WorkplacesView",
    components: {
        Workplace,
        ButtonBlock,
        PlusIcon,
        QrcodeIcon,
        PaginationController,
        QrScanner
    },
    data() {
        return {
            lang: Lang.CurrentLang,
            User,
            workplaces: [],
            pagination: API.createPagination(1, 8),
            loadingWorkplaces: false
        }
    },
    mounted() {
        Lang.AddCallback(lang => this.lang = lang);
        this.pagination.onChanged(this.fetchWorkplaces);
        this.fetchWorkplaces();
    },
    methods: {
        fetchWorkplaces() {
            this.loadingWorkplaces = true;
            API.execute(API.ROUTE.WORKPLACES + this.pagination + "&language_code=" + Lang.CurrentCode).then(res => {
                this.setWorkplaces(res.items);
                this.pagination.fromRequest(res);
                this.loadingWorkplaces = false;
            });
        },
        setWorkplaces(workplaces) {
            this.workplaces = [];
            if (!workplaces) return;

            for (let art of workplaces) {
                this.workplaces.push(art);
            }
            this.$forceUpdate();
        }
    }
};
</script>