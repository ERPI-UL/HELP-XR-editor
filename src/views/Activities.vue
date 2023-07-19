<template>
    <div class="flex flex-col grow min-h-0 max-h-full min-w-0 max-w-full">
        <div class="flex grow max-h-full">
            <div class="flex flex-col grow m-2 min-h-0 overflow-x-hidden overflow-y-scroll max-h-full">
                <div class="m-4 w-fit h-fit md:flex hidden">
                    <button-block
                        v-if="User.currentUser?.permissions >= User.PERMISSIONS.TEACHER"
                        href="/activities/create"
                    >
                        <PlusIcon
                            class="flex-shrink-0 h-5 mr-2"
                            aria-hidden="true"
                        />
                        {{ lang.NEW_ACTIVITY }}
                    </button-block>
                </div>
                <div class="md:m-2 md:ml-4 flex overflow-y-auto overflow-x-hidden grow flex-wrap justify-evenly">
                    <div
                        v-if="activities.length > 0"
                        class="flex flex-wrap justify-evenly"
                    >
                        <Activity
                            v-for="item in activities"
                            :key="item"
                            :activity="item"
                        />
                    </div>
                    <div
                        v-if="activities.length === 0 && !loadingActivities"
                        class="flex flex-col grow justify-center items-center"
                    >
                        <p class="text-2xl font-bold text-slate-600 text-center"> {{ lang.NO_ACTIVITIES }} </p>
                        <p class="text-xl font-semibold text-slate-500 text-center"> {{ lang.NO_ACTIVITIES_DESC }} </p>
                    </div>
                    <div
                        v-if="loadingActivities"
                        class="flex flex-col grow justify-center items-center"
                    >
                        <p class="text-2xl font-bold text-slate-600 text-center"> {{ lang.LOADING_ACTIVITIES }} </p>
                        <p class="text-xl font-semibold text-slate-500 text-center"> {{ lang.LOADING_ACTIVITIES_DESC }} </p>
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
import Activity from "../components/Activity.vue";
import ButtonBlock from "../components/inputs/ButtonBlock.vue";
import PaginationController from '../components/PaginationController.vue';
import User from "../script/User";
import API from '../script/API';
import Lang from '../script/Lang';

import {
    PlusIcon
} from "@heroicons/vue/solid";

export default {
    name: "ActivitiesView",
    components: {
        Activity,
        ButtonBlock,
        PlusIcon,
        PaginationController
    },
    data() {
        return {
            lang: Lang.CurrentLang,
            User,
            activities: [],
            pagination: API.createPagination(1, 8),
            loadingActivities: false
        }
    },
    mounted() {
        Lang.AddCallback(lang => this.lang = lang);
        this.pagination.onChanged(this.fetchActivities);
        this.fetchActivities();
    },
    methods: {
        fetchActivities() {
            this.loadingActivities = true;

            const workplace = this.$route.query.workplace;
            if (workplace !== undefined) {
                API.execute(API.ROUTE.ACTIVITIES_SEARCH + this.pagination + "&language_code=" + Lang.CurrentCode + "&workplace=" + workplace).then(res => {
                    this.setActivities(res.items);
                    this.pagination.fromRequest(res);
                    this.loadingActivities = false;
                });
            } else {
                API.execute(API.ROUTE.ACTIVITIES + this.pagination + "&language_code=" + Lang.CurrentCode).then(res => {
                    this.setActivities(res.items);
                    this.pagination.fromRequest(res);
                    this.loadingActivities = false;
                });
            }
        },
        setActivities(activities) {
            this.activities = [];
            if (!activities) return;

            for (let act of activities) {
                this.activities.push(act);
            }
            this.$forceUpdate();
        }
    }
};
</script>