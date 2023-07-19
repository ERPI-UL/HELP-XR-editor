<template>
    <div class="flex w-fit max-w-full min-w-0">
        <div
            class="flex text-lg font-semibold items-center justify-center w-fit h-fit rounded-md border-2 transition-all max-w-full"
            :class="disabled
                ? 'text-slate-400 cursor-default'
                : (selected ? 'text-indigo-600 bg-slate-50 border-slate-200' : 'text-slate-600 bg-transparent border-transparent') + ' hover:border-slate-200 hover:text-'+color+'-600'"
        >
            <router-link
                v-show="link"
                ref="btn-href"
                class="flex py-1 px-3 outline-none outline-offset-4 rounded items-center"
                :class="disabled? ' cursor-default': ' focus:outline-indigo-500'"
                :to="href"
            >
                <slot />
            </router-link>
            <button
                v-show="!link"
                ref="btn-action"
                class="flex py-1 px-3 outline-none outline-offset-4 rounded items-center"
                :class="disabled? ' cursor-default': ' focus:outline-indigo-500'"
            >
                <slot />
            </button>
        </div>
        
        <!-- Just for tailwind to generate classes, not showing nor useful -->
        <span
            class="hidden
            hover:text-indigo-600 hover:text-red-600"
        />
    </div>
</template>

<script>
export default {
    name: 'ButtonText',
    props: {
        href: {
            type: String,
            default: '',
            required: false
        },
        onclick: {
            type: Function,
            default: () => {},
            required: false
        },
        disabled: {
            type: [Boolean, String],
            default: false,
            required: false
        },
        color: {
            type: String,
            default: 'indigo',
            required: false
        },
        selected: {
            type: Boolean,
            default: false,
            required: false
        }
    },
    data() {
        return {
            window,
            link: this.href
        }
    },
    watch: {
        disabled() {
            this.link = this.disabled? undefined : this.href;
        }
    },
    mounted() {
        this.link = this.disabled? undefined : this.href;
        this.$refs["btn-action"].addEventListener("click", this.onClick);
    },
    methods: {
        onClick() {
            if (this.href || this.disabled) return;
            this.onclick?.(this);
        }
    }
}
</script>