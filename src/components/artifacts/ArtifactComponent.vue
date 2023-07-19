<!-- eslint-disable vue/no-mutating-props -->
<template>
    <div
        class="border-2 rounded-lg h-fit w-full max-w-full"
        :class="selected ? 'border-indigo-600' : 'border-slate-200'"
    >
        <div
            class="flex rounded-t-md"
            :class="selected ? 'bg-indigo-50' : 'bg-slate-50'"
        >
            <button
                class="flex items-center w-full p-1"
                @click="comp.expanded = !comp.expanded"
            >
                <chevron-down-icon
                    class="w-6 h-6 text-slate-700"
                    :class="comp?.expanded ? '' : 'rotate-180'"
                />
                <div class="flex grow">
                    <p class="text-md text-slate-700 font-semibold py-0.5 mx-auto"> {{ comp.tag }} </p>
                </div>
            </button>
            <button
                v-if="showDelete"
                @click="onDelete"
            >
                <x-icon class="w-5 h-5 text-indigo-600 mr-1" />
            </button>
        </div>
        <button
            v-show="comp.expanded"
            class="flex py-2 w-full max-w-full"
            @click="onSelect?.(comp, $event)"
        >
            <div class="flex flex-col space-y-2 w-[50%] px-2">
                <p class="text-md text-slate-700 font-semibold mx-auto"> {{ lang.INFORMATIONS }} </p>
                <div class="flex w-full justify-between">
                    <input-text
                        id="input-componenttag"
                        :label="lang.TAG"
                        type="text"
                        name="component-tag"
                        :disabled="pageMode === MODE_VIEW"
                        :value="comp.tag"
                        @change="comp.tag = $event.target.value"
                    />
                </div>
                <div class="flex w-full justify-between">
                    <input-choice
                        id="input-componenttype"
                        :label="lang.TYPE"
                        name="component-type"
                        :disabled="pageMode === MODE_VIEW"
                        :value="comp.type?.name"
                        :list="componentTypes.map(el => ({ id: 'COMP_' + el.display, value: el.name }))"
                        :onchange="ev => setComponentType(ev.target.value)"
                    />
                </div>
            </div>
            <span
                class="h-20 my-auto rounded-lg min-w-[0.2em] max-w-full"
                :class="selected ? 'bg-indigo-200' : 'bg-slate-200'"
            />
            <div class="flex flex-col space-y-2 max-w-full w-[50%] px-2">
                <p class="text-md text-slate-700 font-semibold mx-auto"> {{ lang.PROPERTIES }} </p>
                <div
                    v-for="(property, index) in comp?.properties ?? []"
                    :key="index"
                    class="flex w-full justify-between"
                >
                    <input-text
                        v-if="property.type !== 'target'"
                        :id="'component-prop-' + property.name"
                        class="max-w-full"
                        :title="lang['COMP_' + comp.type.display + '_PROP_' + property.tooltip] ?? ''"
                        :label="lang['COMP_' + comp.type.display + '_PROP_' + property.display] ?? 'Error'"
                        :type="property.type"
                        :disabled="pageMode === MODE_VIEW"
                        :accept="property.accept ?? ''"
                        :name="'component-prop-' + property.name"
                        :value="property.value ?? property.default ?? lang.SELECT_FILE"
                        :checked="property.value"
                        @input="ev => {
                            const data = {checkbox: ev.target.checked, number: Number(ev.target.value), file: ev.target.files?.[0]?.name, default: ev.target.value};
                            property.value = data[property.type] ?? data.default;
                            if (property.type === 'file') property.file = ev.target.files[0];
                        }"
                    />
                    <div
                        v-if="property.type === 'target'"
                        class="flex grow h-fit w-full md:flex-row min-w-0 flex-col justify-between md:space-x-2 md:items-center"
                    >
                        <label
                            class="flex text-lg text-slate-600 font-bold whitespace-nowrap text-ellipsis w-fit"
                            :title="property.title"
                        >
                            {{ lang['COMP_' + comp.type.display + '_PROP_' + property.display] ?? 'Error' }}
                        </label>
                        <div class="flex grow flex justify-start items-center">
                            <div class="relative show-child-on-hover">
                                <question-mark-circle-icon
                                    class="h-5 w-5 text-indigo-300 cursor-pointer"
                                />
                                <div class="absolute top-5 left-1/2 show-child z-50">
                                    <div class="flex -translate-x-1/2 flex-col p-2 bg-white border-2 border-slate-200 rounded-md shadow-md">
                                        <p class="text-md text-slate-700 whitespace-nowrap font-semibold mx-auto"> {{ lang['COMP_' + comp.type.display + '_PROP_' + property.tooltip] ?? '' }} </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            :id="'component-prop-' + property.name"
                            class="flex min-h-[2em] border-2 rounded-md px-2 py-1 border-slate-200 font-bold text-md whitespace-nowrap max-w-full
                                min-w-0 text-ellipsis transition-colors placeholder-slate-600/[0.5]"
                            :class="(pageMode === MODE_VIEW ? ' bg-slate-100 text-slate-600 cursor-default ' : ' bg-white text-slate-700 hover:border-slate-300 ') + (property.type === 'file' ? 'hidden' : '')"
                            :accept="property.accept"
                            @click="() => { if (pageMode !== MODE_VIEW) $refs['selector-targets-' + property.name][0].show() }"
                        >
                            {{ property.value?.length > 0 ? property.value : lang.SELECT_TARGET }}
                        </div>
                        <menu-selector
                            :ref="'selector-targets-' + property.name"
                            class="mx-auto"
                            :elements="targets"
                            :banned="[]"
                            :onselected="target => {
                                property.value = target.name;
                            }"
                        />
                    </div>
                </div>
                <div
                    v-show="comp.type?.properties?.length === 0"
                    class="flex w-full justify-center items-center"
                >
                    <p class="text-gray-400 font-semibold text-lg py-2 whitespace-nowrap">
                        {{ lang.NO_PROPERTIES }}
                    </p>
                </div>
            </div>
        </button>
    </div>
</template>

<script>
import User from '../../script/User';
import {
    ChevronDownIcon,
    XIcon
} from '@heroicons/vue/solid';
import {
    QuestionMarkCircleIcon
} from '@heroicons/vue/outline';
import { getLuaCode, updateBlockly } from '../../script/artifacts/BlocklyEditor';
import Lang from '../../script/Lang';
import componentTypes from '../../script/artifacts/components.json';
import InputText from '../inputs/InputText.vue';
import InputChoice from '../inputs/InputChoice.vue';
import MenuSelector from '../inputs/MenuSelector.vue';
import { generateComponentPropertiesScript } from '../../script/artifacts/CreateArtifact';

const MODE_EDIT = 'edit';
const MODE_VIEW = 'view';

export default {
    name: "ArtifactComponent",
    components: {
        ChevronDownIcon,
        XIcon,
        InputText,
        InputChoice,
        MenuSelector,
        QuestionMarkCircleIcon
    },
    props: {
        comp: {
            type: Object,
            required: true
        },
        targets: {
            type: Object,
            required: true
        },
        onDelete: {
            type: Function,
            required: true
        },
        showDelete: {
            type: Boolean,
            default: false,
            required: false
        },
        onSelect: {
            type: Function,
            required: true
        },
        selected: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            lang: Lang.CurrentLang,
            User,
            changeTimeout: null,
            componentTypes,
            pageMode: this.$route.path.includes('view') ? MODE_VIEW : MODE_EDIT,
            MODE_EDIT,
            MODE_VIEW
        }
    },
    watch: {
        'comp.tag': function (val) {
            if (this.changeTimeout !== null)
                clearTimeout(this.changeTimeout);
            this.changeTimeout = setTimeout(() => {
                this.generatePropertiesScript();
                updateBlockly();
                this.changeTimeout = null;
            }, 100);
        },
        'comp.properties': {
            deep: true,
            handler() {
                this.generatePropertiesScript();
            }
        }
    },
    mounted() {
        Lang.AddCallback(lang => this.lang = lang);
        if (typeof(this.comp.type) == 'string') { // from api, convert it
            this.setComponentType(this.comp.type);
        } else {
            if (!this.comp.type || !this.comp.type.name?.trim().length)
            // eslint-disable-next-line vue/no-mutating-props
                this.comp.type = componentTypes[0];
        }
            
    },
    methods: {
        setComponentType(type) {
            // eslint-disable-next-line vue/no-mutating-props
            this.comp.type = componentTypes.find(t => t.name === type);
            if (!this.comp.type) {
                console.error("Component type not found : ", type);
                return;
            }
            // eslint-disable-next-line vue/no-mutating-props
            const oldProperties = this.comp.properties;
            this.comp.properties = JSON.parse(JSON.stringify(this.comp.type.properties));
            if (oldProperties) {
                for (const prop of this.comp.properties) {
                    prop.value = prop.default;
                    const oldProp = oldProperties.find(p => p.name === prop.name);
                    if (oldProp) {
                        prop.value = oldProp.value;
                        if (oldProp.id !== undefined) prop.id = oldProp.id;
                    }
                }
            }
            updateBlockly();
        },
        generatePropertiesScript() {
            generateComponentPropertiesScript(this.comp);
        }
    }
}
</script>
