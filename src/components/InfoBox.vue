<template>
    <!-- Template Info Box : used to display simple numbers and informations in the statistics panel -->
    <div
        class="slide-in bg-white rounded-lg shadow-lg p-2 relative w-fit h-fit m-4 hover:shadow-xl"
        @click="toggleFullscreen"
    >
        <h2 class="text-left font-lg text-gray-800 text-base mr-6">
            {{ boxTitle }}
        </h2>
        <p class="text-center font-bold text-gray-600 text-xl px-8 py-2">
            {{ boxInfos }}
        </p>
    </div>
</template>

<script>

export default {
    name: "InfoBox",
    components: {},
    props: {
        boxTitle: {
            type: String,
            required: true,
            default: ""
        },
        boxInfos: {
            type: String,
            required: true,
            default: ""
        }
    },
    data: () => {return {}},
    mounted: function() {
        
    },
    methods: {
        
    }
}
</script>
