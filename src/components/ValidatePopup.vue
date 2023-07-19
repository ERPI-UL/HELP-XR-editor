<template>
    <!-- Template Validate Ppopup : popup showing up on top of other components to validate an action (for example account deletion) -->
    <div
        v-show="obj.showing"
        ref="parent"
        class="flex w-screen h-screen absolute top-0 left-0 pointer-events-none bg-black/[0.2]"
    >
        <div
            v-show="obj.showing"
            class="pointer-events-auto fixed rounded-lg shadow-lg border border-1 border-gray-300 p-2 bg-white"
        >
            <!-- Popup title and description -->
            <div
                id="text"
                class="divide-y"
            >
                <h2 class="text-left font-semibold text-gray-600 text-lg m-1">
                    {{ obj.title }}
                </h2>
                <p class="text-center font-base text-gray-500 text-medium px-2 py-2 m-1">
                    {{ obj.infos }}
                </p>
            </div>
            <!-- Popup options (cancel and validate action) -->
            <div
                id="controls"
                class="flex grow justify-between"
            >
                <button-text
                    class="mr-8"
                    @click="hide();"
                >
                    {{ obj.cancelLabel }}
                </button-text> <!-- Cancel button -->
                <!-- Validate button (dangerous style because if a popup is shown, it's probably for a important action) -->
                <button-block
                    color="red"
                    @click="obj.validateCallback(); hide();"
                >
                    {{ obj.validateLabel }}
                </button-block>
            </div>
        </div>
    </div>
</template>

<script>
import ButtonText from "./inputs/ButtonText.vue";
import ButtonBlock from "./inputs/ButtonBlock.vue";

/**
 * Represents the current Validate Popup
 */
class ValidatePopup {
    showing = false;
    cancelLabel = "Annuler";
    validateLabel = "Valider";
    title = "";
    infos = "";
    validateCallback = () => {}
}

export default {
    name: "ValidatePopup",
    components: {
        ButtonText,
        ButtonBlock
    },
    props: [],
    data() { return {obj: new ValidatePopup(this)}; },
    methods: {
        /**
         * Shows the popup, applying the new title, description, buttons labels
         */
        show(title="", infos="", cancelLabel="", validateLabel="") {
            this.obj.title = title;
            this.obj.infos = infos;
            this.obj.cancelLabel = cancelLabel;
            this.obj.validateLabel = validateLabel;
            this.obj.showing = true;
            this.$refs["parent"].style.opacity = "0";
            // the popup is showing with css opacity in the setPosition function, assuming it's always called after the show function
        },
        /**
         * hides the popup
         */
        hide() {
            this.$refs["parent"].style.opacity = "0";
            setTimeout(() => {
                this.obj.showing = false;
            }, 200);
        },
        /**
         * Moved the popup position on top of the given element
         * @param {HTMLElement} dom the element to move on top of
         */
        setPosition(dom) {
            setTimeout(() => {
                this.$refs["parent"].style.zIndex = "50";
                const el = this.$refs["parent"].firstChild;
                const domRect = dom.getBoundingClientRect();
                const elRect = el.getBoundingClientRect();
                
                // ON TOP
                el.style.top = domRect.top - elRect.height - 10 + "px";
                el.style.left = domRect.left + domRect.width/2 - (elRect.width/2) + "px";

                // IF NOT ENOUGH PLACE, GO ON BOTTOM
                if (el.style.top < 5) {
                    el.style.top = domRect.top + domRect.height + 10 + "px";
                    el.style.left = domRect.left + domRect.width/2 - (elRect.width/2) + "px";
                }

                if (this.obj.showing) {
                    el.style.animation = "none";
                    el.style.transform = "scale(0.9, 0)";
                    el.style.transformOrigin = "50% 100%";
                    setTimeout(() => {
                        el.style.animation = "";
                        el.style.transform = "scale(1, 1)";
                        this.$refs["parent"].style.opacity = "1";
                    }, 40);
                }
            }, 30);
        },
        /**
         * Assigns the new validate callback to execute when the user clicks on the validate button
         */
        setCallback(callback) {
            this.obj.validateCallback = callback;
        }
    }
}
</script>