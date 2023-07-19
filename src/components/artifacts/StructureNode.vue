<template>
    <div class="flex flex-col">
        <div class="flex items-center space-x-2">
            <div class="w-6 px-auto">
                <button
                    class="flex"
                    @click="toggle"
                >
                    <div class="flex">
                        <span :class="'h-'+(isLast? '5 mb-5' : '10')+' w-0.5 bg-slate-200'" />
                        <span class="h-0.5 w-3 my-auto bg-slate-200" />
                    </div>
                    <chevron-down-icon
                        v-show="node?.children.length > 0"
                        class="w-6 text-slate-500"
                        :class="expanded ? '' : 'rotate-180'"
                    />
                    <span
                        v-show="node?.children.length === 0"
                        class="h-0.5 w-5 my-auto bg-slate-200"
                    />
                </button>
            </div>
            <button
                class="flex space-x-2 text-slate-600 border-2 w-fit px-2 py-1 items-center rounded-md hover:shadow hoverer"
                :class="selectedNode === node ? 'bg-indigo-50 border-indigo-500 hover:border-indigo-600 text-slate-800' : 'border-transparent hover:border-slate-200 text-slate-600'"
                @click="onSelect(node)"
            >
                <p class="text-md font-semibold py-0.5">
                    {{ node?.name }}
                </p>
                <check-icon
                    v-show="targets?.includes(node)"
                    class="w-5 h-5 text-indigo-600"
                />
            </button>
        </div>
        <div
            v-show="expanded"
            class="pl-[1.6em]"
        >
            <structure-node
                v-for="(child, index) in node?.children"
                :key="child.name"
                :node="child"
                :on-select="onSelect"
                :on-add="onAdd"
                :on-remove="onRemove"
                :selected-node="selectedNode"
                :targets="targets"
                :is-last="index === node?.children.length - 1"
            />
        </div>
    </div>
</template>

<script>
import User from '../../script/User';
import {
    ChevronDownIcon,
    CheckIcon
} from '@heroicons/vue/solid';

export default {
    name: "StructureNode",
    components: {
        ChevronDownIcon,
        CheckIcon
    },
    props: {
        node: {
            type: [Object, null],
            required: true
        },
        onSelect: {
            type: Function,
            required: true
        },
        onAdd: {
            type: Function,
            required: true
        },
        onRemove: {
            type: Function,
            required: true
        },
        selectedNode: {
            type: [Object, null],
            required: true
        },
        targets: {
            type: Array,
            required: true
        },
        isLast: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    data() {
        return {
            User,
            expanded: true
        }
    },
    mounted() {
        
    },
    methods: {
        toggle() {
            this.expanded = !this.expanded;
        }
    }
}
</script>

<style scoped>
.hoverer > .onhover { display: none; }
.hoverer:hover > .onhover { display: inherit; }
.hoverer > .nohover { display: inherit; }
.hoverer:hover > .nohover { display: none; }
</style>