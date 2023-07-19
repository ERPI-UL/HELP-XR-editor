<template>
    <div
        class="flex relative w-0 h-0"
        :class="show ? '' : 'hidden'"
    >
        <border-card
            class="flex flex-col absolute shadow-md w-fit h-fit p-2 mt-1 bg-white right-0 items-end"
            :class="side === 'center' ? 'translate-x-1/2' : ''"
        >
            <slot />
        </border-card>
    </div>
</template>

<script>
import BorderCard from './BorderCard.vue';

export default {
    name: "DropdownCard",
    components: {
        BorderCard
    },
    props: {
        side: {
            type: String,
            default: "right",
            required: false
        },
        show: {
            type: Boolean,
            default: true,
            required: false
        },
        ondismiss: {
            type: Function,
            default: () => {},
            required: false
        }
    },
    mounted() {
        window.addEventListener('mousedown', ev => {
            const rect = this.$el.getBoundingClientRect();
            const collidesX = (ev.x > rect.x && ev.x < rect.x + rect.width);
            const collidesY = (ev.y > rect.y && ev.y < rect.y + rect.height);
            const collides = collidesX && collidesY;
            
            const wasShowing = this.show;
            setTimeout(() => { // timeout to let everything refresh
                if (!wasShowing) return;
                if (!collides)
                    setTimeout(() => { // timeout again to let the click event fire
                        this.ondismiss?.();
                    }, 200);
            }, 20);
        });
    }
}
</script>