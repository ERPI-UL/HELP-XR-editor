<template>
    <div class="flex grow h-fit w-full min-w-0 flex-col justify-between">
        <label
            v-if="label != ''"
            class="flex text-lg font-bold whitespace-nowrap text-ellipsis w-fit text-slate-600"
        >
            {{ label }}
        </label>
        <textarea
            ref="area"
            class="flex h-fit border-2 rounded-md px-2 border-slate-200 font-bold text-md max-w-full
                   min-w-0 transition-colors placeholder-slate-600/[0.5] text-slate-600"
            :class="disabled ? ' bg-slate-100 text-slate-500 ' : ' bg-white text-slate-600 hover:border-slate-300 '"
            :placeholder="placeholder"
            :type="type"
            :name="name"
            :value="value"
            :rows="isMobile? '2': '3'"
            :style="resize ? '' : 'resize: none'"
            :disabled="disabled"
        />
    </div>
</template>

<script>
export default {
    name: 'InputArea',
    props: {
        label: {
            type: String,
            default: '',
            required: false
        },
        placeholder: {
            type: String,
            default: '',
            required: false
        },
        value: {
            type: String,
            default: '',
            required: false
        },
        name: {
            type: String,
            default: '',
            required: false
        },
        type: {
            type: String,
            default: 'text',
            required: false
        },
        onchange: {
            type: Function,
            default: () => {},
            required: false
        },
        resize: {
            type: Boolean,
            default: true,
            required: false
        },
        disabled: {
            type: Boolean,
            default: false,
            required: false
        }
    },
    data() {
        return {isMobile: window.innerWidth < 768}
    },
    mounted() {
        this.$refs['area'].addEventListener("change", ev => {
            this.onchange?.(ev);
        });
    }
}
</script>