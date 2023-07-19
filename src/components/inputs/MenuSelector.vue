<template>
    <div class="flex w-0 h-0 text-slate-600 cursor-default">
        <div
            ref="menu-div"
            class="absolute pointer-events-none w-fit h-fit -translate-x-1/2 z-50"
        >
            <div class="flex flex-col w-[300px] h-[300px] bg-white border-2 border-slate-200 shadow-lg mt-3 p-2 rounded-lg opacity-0 space-y-2">
                <input-text
                    :label="lang.SEARCH"
                    :onchange="ev => setSearch(ev.target.value)"
                    :value="search"
                />
                <div class="flex flex-col border-2 border-slate-200 rounded-lg min-h-0 h-full max-h-full w-full overflow-hidden">
                    <div class="flex justify-center items-center w-full h-fit p-1 bg-slate-100">
                        <div class="w-[30%]">
                            <button
                                v-show="this.parent !== null && displayMode !== DISPLAY_SEARCH"
                                ref="btn-action"
                                class="flex px-2 outline-none outline-offset-4 rounded hover:bg-slate-200"
                                @click="goBack"
                            >
                                <chevron-left-icon class="w-6" />
                            </button>
                        </div>
                        <div class="w-[40%]">
                            <p class="text-md font-semibold text-slate-600 text-center whitespace-nowrap text-ellipsis overflow-hidden">
                                {{ displayMode === DISPLAY_SEARCH ? (lang.MENU) : (this.element.name ?? lang.MENU) }}
                            </p>
                        </div>
                        <div class="w-[30%]"/>
                    </div>
                    <div
                        ref="selector"
                        class="flex w-full min-h-0 h-fit max-h-full overflow-auto"
                    >
                        <div class="flex flex-col h-fit w-full">
                            <button
                                v-for="el in this.filteredElements"
                                :key="el"
                                class="flex justify-between py-1 px-2 outline-none outline-offset-4 rounded hover:bg-slate-100"
                                @click="selectElement(el)"
                            >
                                <p class="text-md font-semibold text-slate-600">
                                    {{ el.name }}
                                </p>
                                <chevron-right-icon
                                    v-show="el.elements !== undefined"
                                    class="w-6"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Lang from '../../script/Lang';
import ButtonText from './ButtonText.vue';
import InputText from './InputText.vue';

const DISPLAY_SELECTION = 'selection';
const DISPLAY_SEARCH = 'search';

import {
    ChevronLeftIcon,
    ChevronRightIcon
} from '@heroicons/vue/solid';

function getChildren(tree, array) {
    if (Array.isArray(tree)) {
        tree.forEach(el => getChildren(el, array));
        return;
    }
    if (tree.elements) {
        tree.elements.forEach(el => getChildren(el, array));
    } else {
        array.push(tree);
    }
}

function cleanString(str) {
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export default {
    name: "MenuSelector",
    components: {
        InputText,
        ChevronLeftIcon,
        ChevronRightIcon
    },
    props: {
        elements: {
            type: Array,
            default: () => [],
            required: false
        },
        banned: {
            type: Array,
            default: () => [],
            required: false
        },
        onselected: {
            type: Function,
            default: () => {},
            required: false
        }
    },
    data() {
        return {
            open: false,
            lang: Lang.CurrentLang,
            element: { elements: this.elements },
            parent: null,
            DISPLAY_SEARCH,
            DISPLAY_SELECTION,
            search: ''
        };
    },
    computed: {
        filteredElements() {
            if (this.displayMode === DISPLAY_SEARCH) {
                const tree = this.elements;
                const arr = [];
                getChildren(tree, arr);
                console.log(arr);
                return arr
                    .filter(el => !this.banned.includes(el))
                    .filter(el => cleanString(el.name).includes(cleanString(this.search)));
            } else {
                return this.element.elements.filter(el => !this.banned.map(el => el.id).includes(el.id));
            }
        },
        displayMode() {
            return this.search === '' ? DISPLAY_SELECTION : DISPLAY_SEARCH;
        }
    },
    mounted() {
        Lang.AddCallback(lang => this.lang = lang);

        window.addEventListener("mousedown", ev => {
            const rect = this.$refs["menu-div"]?.getBoundingClientRect();
            if (!rect) return;
            const margin = 30;
            const collidesX = ev.x >= rect.x - margin && ev.x <= rect.x + rect.width + margin;
            const collidesY = ev.y >= rect.y - margin && ev.y <= rect.y + rect.height + margin;
            if (!collidesX || !collidesY) {
                this.hide();
            }
        });
    },
    methods: {
        show() {
            if (this.open) return;

            this.element = { elements: this.elements };
            this.parent = null;
            this.search = '';

            const menuDiv = this.$refs["menu-div"];
            const rect = this.$el.getBoundingClientRect();

            document.body.appendChild(menuDiv);
            menuDiv.firstElementChild.classList.add("slide-in-quick");
            const margins = 40;
            const size = {x: 300, y: 300};
            menuDiv.style.top = Math.max(Math.min(rect.top, window.innerHeight - size.y - margins), margins) + "px";
            menuDiv.style.left = Math.max(Math.min(rect.left, window.innerWidth - size.x - margins), margins) + "px";

            menuDiv.firstElementChild.classList.remove("pointer-events-none");
            menuDiv.firstElementChild.classList.add("pointer-events-auto");
            this.open = true;
        },
        hide() {
            if (!this.open) return;

            const menuDiv = this.$refs["menu-div"];
            menuDiv.firstElementChild.classList.remove("slide-in-quick");
            menuDiv.firstElementChild.classList.remove("pointer-events-auto");
            menuDiv.firstElementChild.classList.add("pointer-events-none");
            this.open = false;
        },
        selectElement(el) {
            if (!el.elements) {
                this.onselected?.(el);
                this.hide();
                return;
            }

            const selector = this.$refs["selector"];
            selector.classList.add("hide-left");

            setTimeout(() => {
                this.parent = this.element;
                el.parent = this.element;
                this.element = el;
                selector.classList.add("show-right");
                selector.classList.remove("hide-left");
                setTimeout(() => { selector.classList.remove("show-right"); }, 200);
            }, 100);
        },
        goBack() {
            const selector = this.$refs["selector"];
            selector.classList.add("hide-right");

            setTimeout(() => {
                this.element = this.parent;
                this.parent = this.element.parent ?? null;
                selector.classList.add("show-left");
                selector.classList.remove("hide-right");
                setTimeout(() => { selector.classList.remove("show-left"); }, 200);
            }, 100);
        },
        setSearch(val) {
            this.search = val;
        }
    }
}
</script>
