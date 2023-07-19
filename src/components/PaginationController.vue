<template>
    <div class="flex justify-between items-center space-x-4">
        <button-text
            :disabled="!pagination.hasPrevious"
            @click="() => { pagination.previous(); }"
        >
            <arrow-sm-left-icon class="w-6"></arrow-sm-left-icon>
        </button-text>
        <div class="flex items-center justify-evenly space-x-2 text-lg font-semibold text-indigo-600">
            <p> {{ pagination.page }} </p>
            <span>/</span>
            <p> {{ pagination.pages }} </p>
        </div>
        <button-text
            :disabled="!pagination.hasNext"
            @click="() => { pagination.next(); }"
        >
            <arrow-sm-right-icon class="w-6"></arrow-sm-right-icon>
        </button-text>
    </div>
</template>

<script>
import ButtonText from "./inputs/ButtonText.vue";
import User from "../script/User";

import {
    ArrowSmLeftIcon,
    ArrowSmRightIcon
} from "@heroicons/vue/solid";

export default {
    name: "PaginationController",
    props: {
        pagination: {
            type: [Object, null],
            required: true
        }
    },
    components: {
        ButtonText,
        ArrowSmLeftIcon,
        ArrowSmRightIcon
    },
    data() {
        return { User }
    }
}
</script>