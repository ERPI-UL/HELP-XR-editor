<template>
    <div class="flex flex-col grow min-h-0 max-h-full min-w-0 max-w-full items-center justify-center space-y-8">
        <img
            src="/404.png"
            alt=""
            class="w-40 opacity-70 hover:scale-105 transition-all duration-300 ease-in-out"
        >
        <p class="text-lg font-semibold text-slate-600">
            Sorry, but this section is still under development
        </p>
        <button-block
            :onclick="() => $router.go(-1)"
        >
            Nevermind
        </button-block>
    </div>
</template>

<script>
import ButtonBlock from "../components/inputs/ButtonBlock.vue";

export default {
    name: "StatisticsView",
    components: {
        ButtonBlock
    },
    mounted() {
        
    },
    methods: {

    }
};
</script>

<style>

</style>