<template>
    <div
        ref="logZone"
        class="flex flex-col max-w-full min-w-0 w-full items-center h-fit overflow-hidden transition-all"
        style="max-height: 0px;"
    />
</template>

<script>
import { Log, LogZone } from '../../script/Logs.js';

export default {
    name: "LogZone",
    data() {
        return {};
    },
    mounted() {
        this.log = (msg, type) => {
            if (!this.logZone)
                this.logZone = new LogZone(this.$refs.logZone);
            const log = new Log(msg, type);
            log.attachTo(this.logZone);
            return log;
        }
    }
}
</script>