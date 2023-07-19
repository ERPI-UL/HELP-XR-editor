<template>
    <div class="flex grow h-fit w-full md:flex-row min-w-0 flex-col justify-between md:space-x-2 md:items-center">
        <label
            v-if="label != ''"
            class="flex text-lg text-slate-600 font-bold whitespace-nowrap text-ellipsis w-fit"
            :title="title"
        >
            {{ label }}
        </label>
        <div
            v-show="title.trim() !== ''"
            class="flex grow flex justify-start items-center"
        >
            <div class="relative show-child-on-hover">
                <question-mark-circle-icon
                    class="h-5 w-5 text-indigo-300 cursor-pointer"
                />
                <div class="absolute top-5 left-1/2 show-child z-50">
                    <div class="flex -translate-x-1/2 flex-col p-2 bg-white border-2 border-slate-200 rounded-md shadow-md">
                        <p class="text-md text-slate-700 whitespace-nowrap font-semibold mx-auto"> {{ title }} </p>
                    </div>
                </div>
            </div>
        </div>
        <input
            :id="id"
            ref="input"
            class="flex min-h-[2em] min-w-[2em] border-2 rounded-md px-2 py-1 border-slate-200 font-bold text-md whitespace-nowrap max-w-full
                   min-w-0 text-ellipsis transition-colors placeholder-slate-600/[0.5]"
            :class="(disabled ? ' bg-slate-100 text-slate-600 cursor-default ' : ' bg-white text-slate-700 hover:border-slate-300 ') + (type === 'file' ? 'hidden' : '')"
            :placeholder="placeholder"
            :type="type"
            :name="name"
            :value="type === 'file' ? '' : value"
            :checked="type === 'checkbox' ? checked : ''"
            :min="min"
            :max="max"
            :disabled="disabled"
            :pattern="pattern"
            :accept="accept"
        >
        <label
            :for="id"
            class="min-w-0 max-w-full overflow-hidden"
            :class="type === 'file' ? '' : 'hidden'"
        >
            <p
                class="max-w-full border whitespace-nowrap text-ellipsis overflow-hidden px-4 py-2 rounded-md shadow-sm text-base font-medium cursor-pointer bg-gray-50"
                :class="(disabled ? 'text-slate-800 border-gray-200 cursor-default' : 'text-black border-indigo-600 hover:bg-gray-100')"
            >
                {{ value }}
            </p>
        </label>
    </div>
</template>

<script>
import {
    QuestionMarkCircleIcon
} from '@heroicons/vue/outline'

export default {
    name: 'InputText',
    components: {
        QuestionMarkCircleIcon
    },
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
            type: [String, Number, Boolean],
            default: '',
            required: false
        },
        checked: {
            type: [String, Number, Boolean],
            default: false,
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
        min: {
            type: [Number, String],
            default: "",
            required: false
        },
        max: {
            type: [Number, String],
            default: "",
            required: false
        },
        disabled: {
            type: [Boolean, String],
            default: false,
            required: false
        },
        onchange: {
            type: Function,
            default: () => {},
            required: false
        },
        pattern: {
            type: String,
            default: "",
            required: false
        },
        accept: {
            type: String,
            default: "",
            required: false
        },
        id: {
            type: String,
            default: "",
            required: false
        },
        title: {
            type: String,
            default: "",
            required: false
        },
    },
    data() {
        return {isDisabled: true}
    },
    mounted() {
        this.$refs["input"].addEventListener("input", ev => {
            this.onchange?.(ev);
        });
        this.focus = () => this.$refs.input.focus();
        this.getValue = () => this.$refs.input.value;
    }
}
</script>