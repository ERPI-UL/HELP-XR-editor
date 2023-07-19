<template>
    <!-- Admin view page -->
    <div class="flex flex-col grow min-h-0 max-h-full min-w-0 max-w-full">
        
    </div>
</template>

<script>
import User from "../script/User";
import API from "../script/API";

export default {
    name: "AdminView",
    components: {

    },
    data() {
        return {User, API}
    },
    mounted() {
        if (!User.currentUser.isAdmin()) window.location.href = "/"; // if not admin, go back
    },
    methods: {}
};
</script>
