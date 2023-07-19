<template>
    <div class="flex h-fit w-full justify-between md:space-x-8 space-x-4 items-center min-w-0 max-w-full">
        <label
            v-if="label != ''"
            class="flex text-lg text-slate-600 font-bold whitespace-nowrap text-ellipsis w-fit">
            {{ label }}
        </label>
        <div class="min-w-0 max-w-full">
            <select
                ref="select"
                name=""
                :value="value"
                :disabled="disabled"
                class="flex h-fit border-2 rounded-md px-2 py-1 border-slate-200 font-bold text-md whitespace-nowrap max-w-full
                    min-w-0 text-ellipsis transition-colors placeholder-slate-600/[0.5]"
                :class="disabled ? ' bg-slate-100 text-slate-600 ' : ' bg-white text-slate-700 hover:border-slate-300'"
            >
                <option
                    v-for="el in elements"
                    :key="el.value"
                    :value="el.value"
                >
                    {{ el.label ?? lang[el.id] }}
                </option>
            </select>
        </div>
        <input
            ref="input"
            :name="name"
            type="number"
            class="hidden"
        >
    </div>
</template>

<script>
import Lang from '../../script/Lang';

function setup(obj) {
    obj.selected = obj.value;
    obj.inputEl = null;
    obj.selectEl = null;

    setElements(obj);
}

function setElements(obj) {
    obj.elements = [];
    for (let i = 0; i < obj.list.length; i++) {
        const el = obj.list[i];
        obj.elements.push({
            label: el.label,
            id: el.id,
            value: el.value,
            selected: el.value === obj.value || el.selected
        });
    }
}

export default {
    name: 'InputChoice',
    components: {},
    props: {
        label: {
            type: String,
            default: "",
            required: false
        },
        value: {
            type: [Number, String],
            default: 0,
            required: false
        },
        list: {
            type: Array,
            default: () => [],
            required: true
        },
        onchange: {
            type: Function,
            default: () => {},
            required: false
        },
        name: {
            type: String,
            default: "",
            required: false
        },
        disabled: {
            type: Boolean,
            default: false,
            required: false
        }
    },
    data() {
        setup(this);
        return { lang: Lang.CurrentLang };
    },
    watch: {
        list() {
            setElements(this);
        }
    },
    mounted() {
        Lang.AddCallback(lang => this.lang = lang);

        this.selected = this.value;
        this.elements.forEach(item => {
            if (item.selected) {
                this.selected = item.value;
            }
        });

        this.$refs['select'].addEventListener('change', ev => {
            this.onchange?.(ev);
        });
    },
    methods: {}
}
</script>