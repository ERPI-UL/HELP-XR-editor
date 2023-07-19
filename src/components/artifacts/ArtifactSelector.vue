<template>
    <border-card class="flex flex-col max-h-full max-w-full min-w-fit px-4">
        <div class="flex grow overflow-y-auto min-h-0 max-h-full max-w-full min-w-fit">
            <div class="flex flex-wrap min-h-0 max-h-full w-full py-2 overflow-y-auto overflow-x-hidden">
                <button
                    v-for="artifact in filteredArtifacts"
                    :key="artifact"
                    class="flex w-fit min-h-0 max-h-full h-fit my-1 mx-auto px-1"
                    @click="onselected(artifact)"
                >
                    <artifact-card
                        ref="artifact-card"
                        :artifact="artifact"
                    />
                </button>
                <div
                    v-if="filteredArtifacts.length === 0 && artifacts.length === 0"
                    class="flex flex-col grow justify-center items-center"
                >
                    <p class="text-2xl font-bold text-slate-600 text-center"> {{ lang.NO_ARTIFACTS }} </p>
                    <p class="text-xl font-semibold text-slate-500 text-center"> {{ lang.NO_ARTIFACTS_DESC }} </p>
                </div>
                <div
                    v-if="filteredArtifacts.length === 0 && artifacts.length > 0"
                    class="flex flex-col grow justify-center items-center"
                >
                    <p class="text-2xl font-bold text-slate-600 text-center"> {{ lang.NO_MORE_ARTIFACTS }} </p>
                    <p class="text-xl font-semibold text-slate-500 text-center"> {{ lang.NO_MORE_ARTIFACTS_DESC }} </p>
                </div>
            </div>
        </div>
        <pagination-controller
            class="mx-auto my-1"
            :pagination="pagination"
        />
    </border-card>
</template>

<script>
import API from '../../script/API';
import PaginationController from '../PaginationController.vue';
import BorderCard from '../cards/BorderCard.vue';
import Lang from '../../script/Lang';
import ArtifactCard from '../cards/ArtifactCard.vue';

function fetchArtifacts(pagination) {
    return new Promise((resolve, reject) => {
        API.execute(API.ROUTE.ARTIFACTS + pagination + "&language_code=" + Lang.CurrentCode, API.METHOD.GET).then(res => {
            resolve(res);
        }).catch(err => {
            console.error("Error fetching artifacts: ", err);
        });
    });
}

export default {
    name: "ArtifactSelector",
    components: {
        PaginationController,
        BorderCard,
        ArtifactCard
    },
    props: {
        onselected: {
            type: Function,
            default: () => {},
            required: false
        },
        banned: {
            type: Array,
            default: () => [],
            required: false
        }
    },
    data() {
        return {
            lang: Lang.CurrentLang,
            pagination: API.createPagination(1, 6),
            artifacts: []
        };
    },
    computed: {
        filteredArtifacts() {
            this.loadCards(false);
            return this.artifacts.filter(art => !this.banned.map(el => el.id).includes(art.id));
        }
    },
    mounted() {
        Lang.AddCallback(lang => this.lang = lang);
        this.pagination.onChanged(() => {
            this.loadArtifacts();
        });
        this.loadArtifacts();
    },
    methods: {
        loadArtifacts() {
            fetchArtifacts(this.pagination).then(res => {
                this.pagination.fromRequest(res);
                this.artifacts = res.items;
                this.loadCards();
            });
        },
        loadCards(delay=0) {
            // timeout to allow vuejs to create the new cards
            // FIXME : works but not ideal, find better solution
            setTimeout(() => {
                const thingsToLoad = [];
                this.$refs['artifact-card']?.forEach(card => {
                    if (!card.loaded && !card.loading) {
                        thingsToLoad.push(card.load);
                    }
                });
                let index = 0;
                const loadAllThings = () => {
                    if (thingsToLoad.length <= index) return;
                    const promise = thingsToLoad[index]();
                    promise.then(() => {
                        index++;
                        loadAllThings();
                    }).catch(console.error);
                }
                if (delay === 0) loadAllThings();
                else setTimeout(() => loadAllThings(), 500);
            }, 200);
        }
    }
};
</script>
