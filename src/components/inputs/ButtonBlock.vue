<template>
    <div class="flex w-fit max-w-full">
        <div
            class="flex text-lg font-semibold items-center justify-center w-fit h-fit text-slate-50 rounded-md border-2 transition-all min-w-fit max-w-full"
            :class="disabled
                ? 'bg-slate-400 cursor-default'
                : 'bg-'+color+'-600 border-'+color+'-700 hover:bg-white hover:border-'+color+'-600 hover:shadow-md hover:text-'+color+'-600'"
        >
            <router-link
                v-show="link"
                ref="btn-href"
                class="flex items-center space-x-2 py-1 px-3 outline-none outline-offset-4 rounded min-w-fit max-w-full"
                :class="disabled? ' cursor-default': ' focus:outline-indigo-500'"
                :to="href"
            >
                <slot />
            </router-link>
            <button
                v-show="!link"
                ref="btn-action"
                class="flex items-center space-x-2 py-1 px-3 outline-none outline-offset-4 rounded min-w-fit max-w-full"
                :class="disabled? ' cursor-default': ' focus:outline-indigo-500'"
            >
                <slot />
            </button>
        </div>
        
        <!-- Just for tailwind to generate classes, not showing nor useful -->
        <span
            class="hidden
            bg-indigo-600 bg-red-600
            border-indigo-700 border-red-700
            hover:text-indigo-600 hover:text-red-600
            hover:border-indigo-600 hover:border-red-600"
        />
    </div>
</template>

<script>
export default {
    name: 'ButtonBlock',
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