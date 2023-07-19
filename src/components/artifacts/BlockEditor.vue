<template>
    <div
        v-show="comp !== null"
        id="blocklyArea"
        class="flex w-full h-full overflow-hidden"
    >
        <div
            id="blocklyDiv"
            class="rounded-lg border-2 border-slate-100 overflow-hidden"
            style="position: fixed"
        />
    </div>
</template>

<script>
import { getBlocklyCode, getLuaCode, loadBlocklyCode, setupBlockly, updateBlockly, resetBlockly, setToolboxTags, setWorkspaceAnchors } from "../../script/artifacts/BlocklyEditor";

export default {
    name: "BlockEditor",
    components: {

    },
    props: {
        comp: {
            type: [Object, null],
            required: true
        }
    },
    data() {
        return {}
    },
    watch: {
        comp: {
            handler: function (newVal, oldVal) {
                if (newVal) {
                    setupBlockly(this.$el, this.$el.firstElementChild);
                    setWorkspaceAnchors();
                    loadBlocklyCode(newVal.code, newVal);
                } else if (oldVal) {
                    this.setCompCode(oldVal);
                }
            }
        }
    },
    mounted() {
        resetBlockly();
        const div = this.$el.querySelector("#blocklyDiv");
        div.addEventListener("mouseout", ev => {
            const rect = div.getBoundingClientRect();
            if (ev.x < rect.left || ev.x > rect.right || ev.y < rect.top || ev.y > rect.bottom) {
                this.setCompCode(this.comp);
            }
        });
        new ResizeObserver(() => window.onresize?.()).observe(this.$el);
    },
    methods: {
        setCompCode(comp) {
            try {
                const code = getBlocklyCode();
                const lua = getLuaCode();
                comp.code = code;
                comp.script = lua;
            } catch (err) {
                console.error("Blockly error :", err);
            }
        }
    }
}
</script>
