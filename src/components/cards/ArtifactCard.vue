<template>
    <border-card
        class="w-32 p-2 mx-2 space-y-1 shadow-sm hover:shadow-md hover:border-indigo-600 bg-white transition-all"
    >
        <div class="flex justify-center items-center max-h-full min-h-0 aspect-square bg-indigo-100 rounded-md">
            <cube-transparent-icon
                v-show="!loaded"
                class="mx-auto breathe w-8 text-indigo-600"
            />
            <canvas
                v-show="loaded"
                id="DDD-view"
                class="flex grow h-full w-full"
            />
        </div>
        <div class="flex max-w-full justify-center">
            <p class="max-w-full text-center text-md font-semibold text-slate-600 overflow-hidden text-ellipsis whitespace-nowrap">
                {{ artifact.name }}
            </p>
        </div>
    </border-card>
</template>

<script>
import BorderCard from './BorderCard.vue';

import {
    CubeTransparentIcon
} from '@heroicons/vue/solid';
import { setArtifactModel } from '../../script/artifacts/ArtifactPreview';

export default {
    name: "ArtifactCard",
    components: {
        BorderCard,
        CubeTransparentIcon
    },
    props: {
        artifact: {
            type: [Object, null],
            required: true
        }
    },
    data() {
        return {
            loading: false,
            loaded: false,
            context: null
        };
    },
    mounted() {
        this.load = () => {
            return new Promise((resolve, reject) => {
                this.loading = true;
                setArtifactModel(null, this.artifact.id, this.$el.querySelector("#DDD-view")).then(context => {
                    this.loading = false;
                    this.loaded = true;
                    this.context = context;
                    setTimeout(() => { resolve(this); }, 200);
                });
            })
        }
    }
};
</script>