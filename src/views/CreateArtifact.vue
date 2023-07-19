<template>
    <div class="flex flex-col grow min-h-0 max-h-full min-w-0 max-w-full">
        <div
            id="content"
            class="flex grow min-h-0 h-fit max-h-full max-w-full min-w-0"
        >
            <div
                id="left-side"
                class="flex flex-col transition-none max-h-full min-h-0 min-w-0 max-w-full min-w-[45em]"
                style="width: 70%"
            >
                <div class="flex flex-col grow max-h-full min-h-0 max-w-full">
                    <div class="flex flex-col grow max-h-full max-w-full">
                        <div class="flex grow max-h-full max-w-full m-2 mt-1 mr-1 border-2 border-white border rounded-lg overflow-hidden">
                            <div class="relative flex flex-col bg-white p-2 w-fit max-h-full min-h-0">
                                <div class="flex justify-between items-center">
                                    <p
                                        id="structure-title"
                                        class="text-xl text-indigo-600 font-semibold text-center pb-2"
                                    > {{ lang.MODEL_STRUCTURE }} </p>
                                    <button
                                        id="chevron-structure"
                                        @click="toggleStructurePanel"
                                    >
                                        <chevron-left-icon
                                            class="w-8 h-8 text-indigo-600"
                                        />
                                    </button>
                                </div>
                                <p
                                    id="-structure-title"
                                    class="absolute text-xl text-indigo-600 font-semibold text-center pb-2 right-5 top-10
                                           pointer-events-none whitespace-nowrap -rotate-90 hidden"
                                    style="transform-origin: 100% 50%;"
                                > {{ lang.MODEL_STRUCTURE }} </p>
                                <div
                                    v-show="props === null"
                                    id="structure-panel"
                                    class="flex justify-center items-center grow"
                                >
                                    <p
                                        class="text-xl text-slate-400 font-semibold text-center"
                                    > {{ lang.MODEL_FOR_STRUCTURE }} </p>
                                </div>
                                <div
                                    v-show="props !== null"
                                    id="structure-panel"
                                    class="flex flex-col grow max-h-full min-h-0 overflow-y-auto border-2 border-slate-100 rounded-lg p-1 pr-4"
                                >
                                    <structure-node
                                        :node="props"
                                        :on-add="addTarget"
                                        :on-remove="removeTarget"
                                        :on-select="selectProp"
                                        :targets="targets"
                                        :selected-node="selectedProp"
                                        :is-last="true"
                                    />
                                </div>
                            </div>
                            <div class="bg-white flex py-2 px-1">
                                <span class="flex w-1 grow rounded-lg bg-slate-200" />
                            </div>
                            <div class="flex flex-col bg-white p-2 max-w-full w-full min-w-0">
                                <div
                                    v-show="selectedProp !== null"
                                    class="flex flex-col grow max-h-full min-h-0 max-w-full"
                                >
                                    <div class="flex items-center justify-center">
                                        <div class="w-[30%]" />
                                        <p class="flex text-xl mx-auto w-fit text-indigo-600 font-bold whitespace-nowrap text-ellipsis overflow-hidden"> {{ selectedProp?.name }} </p>
                                        <div class="flex w-[30%] justify-end">
                                            <button
                                                v-show="targets.indexOf(selectedProp) === -1"
                                                class="flex border-2 border-indigo-200 bg-white rounded-lg px-2 py-0.5 hover:border-indigo-600 hover:bg-indigo-50"
                                                :class="pageMode == 'view' ? 'hidden' : ''"
                                                @click="targets.push(selectedProp)"
                                            >
                                                <p class="text-lg text-indigo-600 font-semibold">
                                                    {{ lang.MARK_TARGET }}
                                                </p>
                                            </button>
                                            <button
                                                v-show="targets.indexOf(selectedProp) !== -1"
                                                class="flex border-2 border-indigo-200 bg-white rounded-lg px-2 py-0.5 hover:border-indigo-600 hover:bg-indigo-50"
                                                :class="pageMode == 'view' ? 'hidden' : ''"
                                                @click="removeTarget(selectedProp)"
                                            >
                                                <p class="text-lg text-indigo-600 font-semibold">
                                                    {{ lang.REMOVE_TARGET }}
                                                </p>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="flex flex-col grow max-h-full min-h-0 max-w-full">
                                        <div
                                            class="flex flex-col max-w-full"
                                            :class="selectedComp === null ? 'h-[50%]' : 'h-[40%]'"
                                        >
                                            <p class="text-xl text-indigo-600 font-semibold ml-4 pb-2"> {{ lang.COMPONENTS }} </p>
                                            <div
                                                id="comp-zone"
                                                class="flex flex-col h-full max-h-full max-w-full space-y-4 mb-4 border-2 border-slate-100 rounded-lg p-2 overflow-y-auto"
                                                @click="selectedComp = null"
                                            >
                                                <div
                                                    v-if="targets.indexOf(selectedProp) === -1"
                                                    class=""
                                                >
                                                    <p
                                                        class="text-xl text-slate-400 font-semibold text-center my-2"
                                                    > {{ lang.ADD_TO_TARGETS_TO_EDIT }} </p>
                                                </div>
                                                <div
                                                    v-if="targets.indexOf(selectedProp) !== -1"
                                                    class="space-y-2 max-w-full"
                                                >
                                                    <artifact-component
                                                        v-for="(comp, index) in selectedProp?.components"
                                                        :id="'comp-'+index"
                                                        :key="comp"
                                                        :comp="comp"
                                                        :targets="targets"
                                                        :show-delete="pageMode !== MODE_VIEW"
                                                        :on-delete="() => deleteComponent(index)"
                                                        :on-select="(comp, ev) => selectComp(comp, ev, index)"
                                                        :selected="selectedComp === comp"
                                                    />
                                                </div>
                                                <button
                                                    v-if="targets.indexOf(selectedProp) !== -1"
                                                    class="flex items-center justify-center space-x-2 w-fit mx-auto border-2 border-indigo-300 rounded-lg px-2 py-1 hover:bg-indigo-50 hover:border-indigo-600"
                                                    :class="pageMode == 'view' ? 'hidden' : ''"
                                                    @click="addComponent"
                                                >
                                                    <plus-icon
                                                        class="w-6 h-6 text-indigo-600"
                                                    />
                                                    <p class="text-lg text-indigo-600 font-semibold">
                                                        {{ lang.ADD_COMPONENT }}
                                                    </p>
                                                </button>
                                            </div>
                                        </div>
                                        <div
                                            class="flex flex-col"
                                            :class="selectedComp === null ? 'h-[50%]' : 'h-[60%]'"
                                        >
                                            <p class="text-xl text-indigo-600 font-semibold ml-4 pb-2"> {{ lang.LOGIC }} </p>
                                            <div
                                                id="logic-panel"
                                                class="flex flex-col h-full justify-center items-center"
                                            >
                                                <block-editor
                                                    :comp="selectedComp"
                                                />
                                                <div
                                                    v-show="selectedComp === null"
                                                >
                                                    <p
                                                        class="text-xl text-slate-400 font-semibold text-center my-2"
                                                    > {{ lang.SELECT_COMPONENT_TO_EDIT }} </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    v-show="selectedProp === null"
                                    class="flex grow justify-center items-center"
                                >
                                    <p
                                        class="text-xl text-slate-400 font-semibold text-center"
                                    > {{ lang.SELECT_OBJECT_TO_EDIT }} </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                id="actions-resize"
                class="resize-slider flex mb-2 mt-1 px-1 cursor-col-resize select-none"
            >
                <!-- separator with resize slider -->
                <span class="flex w-1 grow rounded-lg bg-slate-300" />
            </div>
            <div
                id="right-side"
                class="flex flex-col grow max-h-full pb-2 min-h-0 transition-none"
                style="width: 30%"
            >
                <div class="flex flex-col grow max-h-full min-h-0 space-y-1">
                    <!-- model 3D view zone -->
                    <div class="flex flex-col grow max-h-full min-h-0 bg-white m-2 mt-1 ml-1 rounded-lg">
                        <p class="flex p-2 pb-0 text-xl font-semibold text-indigo-600 whitespace-nowrap text-ellipsis">
                            {{ lang.ARTIFACT_MODEL }}
                        </p>
                        <border-card class="flex flex-col min-h-0 max-h-full grow m-2 border-slate-100 bg-slate-50">
                            <div class="absolute p-1 space-y-1">
                                <button
                                    class="flex space-x-2 text-slate-600 items-center pointer-events-auto"
                                    @click="resetControls()"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24" height="24"
                                        viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round"
                                        class="w-8 h-8 border-2 border-slate-200 rounded-lg p-1 bg-white hover:shadow-md transition-all"
                                    >
                                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                    <p class="text-md font-semibold px-1 rounded bg-white">
                                        {{ lang.RESET_VIEW }}
                                    </p>
                                </button>
                                <button
                                    v-if="transformMode === 'rotate'"
                                    class="flex space-x-2 text-slate-600 items-center pointer-events-auto"
                                    @click="toggleTransformMode()"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24" height="24"
                                        viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round"
                                        class="w-8 h-8 border-2 border-slate-200 rounded-lg p-1 bg-white hover:shadow-md transition-all"
                                    >
                                        <path d="M5 3v16h16"></path><path d="m5 19 6-6"></path><path d="m2 6 3-3 3 3"></path><path d="m18 16 3 3-3 3"></path>
                                    </svg>
                                    <p class="text-md font-semibold px-1 rounded bg-white">
                                        {{ placingAnchor ? lang.MOVE_ANCHOR : lang.MOVE_ARTIFACT }}
                                    </p>
                                </button>
                                <button
                                    v-if="transformMode === 'translate'"
                                    class="flex space-x-2 text-slate-600 items-center pointer-events-auto"
                                    :class="pageMode == 'view' ? 'hidden' : ''"
                                    @click="toggleTransformMode()"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24" height="24"
                                        viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round"
                                        class="w-8 h-8 border-2 border-slate-200 rounded-lg p-1 bg-white hover:shadow-md transition-all"
                                    >
                                        <path d="M16.466 7.5C15.643 4.237 13.952 2 12 2 9.239 2 7 6.477 7 12s2.239 10 5 10c.342 0 .677-.069 1-.2"></path><path d="m15.194 13.707 3.814 1.86-1.86 3.814"></path><path d="M19 15.57c-1.804.885-4.274 1.43-7 1.43-5.523 0-10-2.239-10-5s4.477-5 10-5c4.838 0 8.873 1.718 9.8 4"></path>
                                    </svg>
                                    <p class="text-md font-semibold px-1 rounded bg-white">
                                        {{ placingAnchor ? lang.ROTATE_ANCHOR : lang.ROTATE_ARTIFACT }}
                                    </p>
                                </button>
                            </div>
                            <canvas
                                id="DDD-view"
                                class="flex grow h-full min-h-0 min-w-0 max-w-full"
                            />
                        </border-card>
                    </div>
                    <!-- Basic informations -->
                    <div
                        class="flex flex-col max-h-full min-h-fit m-2 ml-1 rounded-lg bg-white overflow-hidden"
                    >
                        <button
                            class="flex items-center justify-between rounded-md hover:bg-slate-50 text-indigo-600 hover:text-indigo-700"
                            @click="toggleInfosPanel"
                        >
                            <p class="p-2 text-xl font-semibold whitespace-nowrap text-ellipsis overflow-hidden">
                                {{ lang.ARTIFACT_INFOS }}
                            </p>
                            <div
                                id="chevron-infos"
                                class="h-fit w-8"
                            >
                                <chevron-down-icon />
                            </div>
                        </button>
                        <div
                            id="infos-panel"
                            class="flex flex-col p-2"
                        >
                            <div class="h-fit space-y-2">
                                <input-choice
                                    ref="langs"
                                    :list="langs"
                                    :value="selectedLang"
                                    :label="lang.TRANSLATION"
                                    :onchange="ev => selectedLang = ev.target.value"
                                    class="my-auto h-fit pointer-events-auto"
                                />
                                <input-text
                                    :label="lang.ARTIFACT_NAME"
                                    name="artifactname"
                                    :disabled="pageMode == MODE_VIEW"
                                    :value="translations[selectedLang]?.name || ''"
                                    :onchange="ev => setName(ev.target.value)"
                                />
                                <input-area
                                    :label="lang.ARTIFACT_DESC"
                                    name="artifactdesc"
                                    :disabled="pageMode == MODE_VIEW"
                                    :value="translations[selectedLang]?.description || ''"
                                    :onchange="ev => setDescription(ev.target.value)"
                                    :resize="false"
                                />
                                <input-text
                                    id="model-input"
                                    :label="lang.ARTIFACT_MODEL"
                                    :disabled="pageMode == MODE_VIEW"
                                    :value="model?.file?.name ? model.file?.name : lang.ADD_ARTIFACT_MODEL"
                                    name="artifactmodel"
                                    type="file"
                                    accept=".glb"
                                />
                            </div>
                            <div class="h-fit">
                                <div class="flex w-full items-center">
                                    <span class="flex grow h-1 bg-slate-200" />
                                    <p class="p-2 text-lg text-slate-600 font-semibold whitespace-nowrap text-ellipsis overflow-hidden">
                                        {{ lang.ARTIFACT_ANCHOR }}
                                    </p>
                                    <span class="flex grow h-1 bg-slate-200" />
                                </div>
                                <div class="flex justify-between px-2">
                                    <button-outline
                                        v-show="pageMode !== MODE_VIEW"
                                        @click="togglePlacingAnchor"
                                    >
                                        {{ 
                                            placingAnchor
                                                ? lang.VALIDATE_PLACEMENT
                                                : lang.PLACE_ANCHOR
                                        }}
                                    </button-outline>
                                    <button-block
                                        v-show="pageMode !== MODE_CREATE"
                                        :onclick="() => printAnchor(selectedArtifact)"
                                    >
                                        <p> {{ lang.ANCHOR }} </p>
                                        <qrcode-icon class="w-6 h-6" />
                                    </button-block>
                                </div>
                            </div>
                        </div>
                        <div
                            id="navbar"
                            class="flex flex-col px-2 pb-2"
                        >
                            <log-zone ref="log-zone" />
                            <!-- BUTTONS -->
                            <div class="flex w-full justify-between items-center space-x-2">
                                <button-text
                                    class="mr-auto"
                                    @click="$router.go(-1)"
                                >
                                    {{ pageMode == MODE_VIEW ? lang.BACK : lang.CANCEL }}
                                </button-text> <!-- Cancel button -->
                                <button-block
                                    v-if="pageMode == MODE_EDIT"
                                    ref="delete-btn"
                                    color="red"
                                    @click="deleteArtifact"
                                >
                                    {{ lang.DELETE }}
                                </button-block> <!-- delete button -->
                                <button-block
                                    v-if="pageMode !== MODE_VIEW"
                                    ref="save-btn"
                                    @click="saveArtifact"
                                >
                                    {{ lang.SAVE }}
                                </button-block> <!-- Save button -->
                                <button-block
                                    v-show="pageMode === MODE_VIEW && User.currentUser?.permissions > 1"
                                    class="space-x-2 pointer-events-auto"
                                    @click="() => window.location.href = window.location.href.replace('view', 'edit')"
                                >
                                    <pencil-icon class="w-6" />
                                    <p>
                                        {{ lang.EDIT }}
                                    </p>
                                </button-block>
                                <ValidatePopup ref="delete-popup" /> <!-- Delete activity validation popup -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <master-loading
            ref="loading"
            :title="lang.LOADING_ARTIFACT"
            :desc="lang.LOADING_ARTIFACT_DESC"
            :err-title="lang.LOADING_ARTIFACT_MODEL_ERR"
            :err-desc="lang.LOADING_ARTIFACT_MODEL_ERR_DESC"
            err-color="red"
            :err-validate="User.currentUser?.canTeacher() ? lang.DELETE : ''"
            :err-callback="popupDeleteArtifact"
        >
            <div
                v-if="User.currentUser?.canTeacher()"
                class="flex w-min h-fit mx-auto"
            >
                <input-text
                    id="err-model-input"
                    :value="model?.file?.name ? model.file?.name : lang.ADD_ARTIFACT_MODEL"
                    name="modelartifact"
                    type="file"
                    accept=".glb"
                    :onchange="ev => fixArtifact(ev)"
                />
            </div>
        </master-loading>
    </div>
</template>

<script>
import ButtonBlock from "../components/inputs/ButtonBlock.vue";
import ButtonText from "../components/inputs/ButtonText.vue";
import BorderCard from "../components/cards/BorderCard.vue";
import InputArea from "../components/inputs/InputArea.vue";
import InputText from "../components/inputs/InputText.vue";
import InputChoice from "../components/inputs/InputChoice.vue";
import ValidatePopup from "../components/ValidatePopup.vue";
import ButtonOutline from "../components/inputs/OutlineButton.vue";
import StructureNode from '../components/artifacts/StructureNode.vue';
import ArtifactComponent from "../components/artifacts/ArtifactComponent.vue";
import BlockEditor from "../components/artifacts/BlockEditor.vue";
import MasterLoading from '../components/cards/MasterLoading.vue';
import { togglePanel } from '../script/common';
import User from '../script/User';
import * as THREE from 'three';

import {
    checkForCanvasSetup,
    enableAnchorControls,
    resetCameraTransform,
    set3DMachineModel,
    setTransformMode,
    startRendering
} from '../script/artifacts/ArtifactEditor';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import {
    ChevronDownIcon,
    ChevronLeftIcon,
    PlusIcon,
    PencilIcon,
    QrcodeIcon
} from '@heroicons/vue/solid';
import API from '../script/API';
import Lang from '../script/Lang';
import { printArtifactAnchor } from '../script/artifacts/Anchor';

import {
    selectProp,
    addTarget,
    removeTarget,
    addComponent,
    deleteComponent,
    setName,
    setDescription,
    deleteArtifact,
    editArtifact,
    saveArtifact,
    loadArtifact,
} from '../script/artifacts/CreateArtifact';
import { Log } from '../script/Logs';
import LogZone from '../components/cards/LogZone.vue';

const MODE_VIEW = "view";
const MODE_EDIT = "edit";
const MODE_CREATE = "create";

function setup(obj) {
    const resizeBar = document.getElementById("actions-resize");
    const content = document.getElementById("content");
    const leftSide = document.getElementById("left-side");
    const rightSide = document.getElementById("right-side");
    resizeBar.addEventListener("mousedown", ev => {
        const rect = content.getBoundingClientRect();
        const moveEvent = ev => {
            let percent = (ev.clientX - rect.left) / rect.width;
            percent = Math.max(0.2, Math.min(0.8, percent));
            leftSide.style.width = `${percent * 100}%`;
            rightSide.style.width = `${(1 - percent) * 100}%`;
            window.onresize?.();
        };
        window.addEventListener("mousemove", moveEvent);
        window.addEventListener("mouseup", ev => {
            window.removeEventListener("mousemove", moveEvent);
        });
    });

    const threeDView = obj.$el.querySelector("#DDD-view");
    checkForCanvasSetup(threeDView);
    startRendering();

    const modelInput = obj.$el.querySelector("input[name=artifactmodel]");
    modelInput.onchange = ev => {
        if (obj.pageMode === MODE_VIEW) return;
        const file = ev.target.files[0];
        const reader = new FileReader();
        reader.onload = ev => {
            obj.model.modified = true;
            obj.model.data = ev.target.result;
            obj.model.file = file;
            obj.load3DModel();
        };
        reader.readAsArrayBuffer(file);
    };
}

function toggleInfosPanel() {
    // The canvas size is blocking correct UI update, so we need to hide and show it to force the update
    // FIXME : This is a temporary fix, find a better way to do it
    if (document.getElementById("chevron-infos").classList.contains("rotate-180")) {
        document.getElementById("DDD-view").classList.add("hidden");
        setTimeout(() => {
            document.getElementById("DDD-view").classList.remove("hidden");
        }, 10);
    }
    togglePanel("chevron-infos", "infos-panel");
}

function toggleStructurePanel() {
    togglePanel("chevron-structure", "structure-panel", "structure-title", "-structure-title");
}

/**
 * Parse the model to get the props
 * @param {Object3D} model model to parse
 */
function parseModel(model) {
    const obj = {
        name: model.name,
        children: model.children.map(child => parseModel(child)),
        components: []
    };
    obj.find = validator => {
        if (validator(obj)) return obj;
        else {
            for (let child of obj.children) {
                const res = child.find(validator);
                if (res !== false) return res;
            }
            return false;
        }
    };
    return obj;
}

function resetControls() {
    resetCameraTransform();
}

function fetchLanguages() {
    return new Promise((resolve, reject) => {
        API.execute(API.ROUTE.LANGUAGES).then(res => {
            resolve(res);
        }).catch(reject);
    })
}

export default {
    name: "CreateArtifact",
    components: {
        ButtonText,
        ButtonBlock,
        ValidatePopup,
        ChevronDownIcon,
        StructureNode,
        ChevronLeftIcon,
        ArtifactComponent,
        PlusIcon,
        BlockEditor,
        ButtonOutline,
        InputArea,
        InputText,
        InputChoice,
        BorderCard,
        PencilIcon,
        QrcodeIcon,
        MasterLoading,
        LogZone
    },
    setup() {
        
    },
    data() {
        return {
            lang: Lang.CurrentLang,
            User, 
            pageMode: "", 
            MODE_VIEW, 
            MODE_CREATE, 
            MODE_EDIT, 
            tab: 'targets', 
            props: null,
            selectedProp: null,
            selectedComp: null,
            targets: [],
            translations: {},
            currentCode: Lang.CurrentCode,
            model: {},
            placingAnchor: false,
            transformMode: 'translate',
            artifactId: null,
            window,
            selectedLang: Lang.CurrentCode,
            langs: [ {value: '', id: 'LOADING'} ],
        };
    },
    watch: { // to access those infos from Blockly
        selectedComp: {
            deep: true,
            handler() {
                window.selectedComp = this.selectedComp;
                window.lastSelectedComp = this.selectedComp ?? window.lastSelectedComp;
            }
        },
        props() { window.props = this.props; },
        selectedLang() {
            // nothing to do here
        }
    },
    mounted() {
        Lang.AddCallback(lang => this.lang = lang);
        const pathid = window.location.pathname.split("/").pop();
        this.pageMode = (pathid === 'view') ? MODE_VIEW : (pathid === 'edit' ? MODE_EDIT : MODE_CREATE);
        this.artifactId = Number(window.location.href.split("id=")[1]);

        if (this.$route.query.id)
            fetchTitleRessource(API.execute(API.ROUTE.ARTIFACTS + this.$route.query.id), artifact => artifact.name);

        setup(this);

        // if not creating, load the artifact informations
        const loading = this.$refs.loading;
        loading.start();
        if (this.pageMode !== MODE_CREATE) {
            loadArtifact(this).then(() => {
                console.log('targets : ', this.targets);
                if (this.pageMode === MODE_EDIT) {
                    this.old = JSON.parse(JSON.stringify({
                        translations: this.translations,
                        targets: this.targets,
                        anchor: this.anchor,
                    }));
                }

                fetchLanguages().then(langs => {
                    this.langs = langs.map(lang => ({value: lang.code, label: lang.name + " " + lang.unicode}));
                    if (this.pageMode == MODE_VIEW)
                        this.langs = this.langs.filter(el => Object.keys(this.translations).includes(el.value));
                    setTimeout(() => {
                        this.selectedLang =
                            this.langs.map(el => el.value).includes(Lang.CurrentCode)
                                ? Lang.CurrentCode
                                : this.langs[0].value;
                    }, 20);
                    loading.stop();
                }).catch(console.error);
            }).catch(err => {
                loading.error();
                console.error(err);
            });
        } else {
            fetchLanguages().then(langs => {
                this.langs = langs.map(lang => ({value: lang.code, label: lang.name + " " + lang.unicode}));
                setTimeout(() => {
                    this.selectedLang =
                        this.langs.map(el => el.value).includes(Lang.CurrentCode)
                            ? Lang.CurrentCode
                            : this.langs[0].value;
                }, 20);
                loading.stop();
            }).catch(console.error);
        }
    },
    methods: {
        toggleInfosPanel,
        toggleStructurePanel,
        resetControls,
        saveArtifact() {
            if (this.pageMode === MODE_VIEW) return;
            let promise;
            if (this.pageMode === MODE_CREATE) promise = saveArtifact(this);
            if (this.pageMode === MODE_EDIT) promise = editArtifact(this);
            promise?.then(() => {
                this.$router.push("/artifacts");
            }).catch(console.error);
        },
        deleteArtifact() { deleteArtifact(this); },
        selectProp(prop) { selectProp(this, prop); },
        addTarget(prop) { addTarget(this, prop); },
        removeTarget(prop) { removeTarget(this, prop); },
        addComponent() { addComponent(this) },
        deleteComponent(index) { deleteComponent(this, index); },
        setName(str) { setName(this, str); },
        setDescription(str) { setDescription(this, str); },
        selectComp(comp, ev, index) {
            this.selectedComp = comp;
            ev.stopPropagation();
            const compDiv = this.$el.querySelector(`#comp-${index}`);
            const zone = this.$el.querySelector("#comp-zone");
            // setTimeout(() => {
            //     zone.scrollTo({
            //         top: compDiv.offsetTop - zone.offsetTop - 8,
            //         behavior: "smooth"
            //     });
            // }, 100);
        },
        togglePlacingAnchor() {
            this.placingAnchor = !this.placingAnchor;
            enableAnchorControls(this.placingAnchor);
        },
        toggleTransformMode() {
            if (this.transformMode === 'translate')
                this.transformMode = 'rotate';
            else this.transformMode = 'translate';
            setTransformMode(this.transformMode);
        },
        load3DModel() {
            return new Promise((resolve, reject) => {
                const loader = new GLTFLoader();
                THREE.PropertyBinding.sanitizeNodeName = name => name; // to avoid cutting the dots from the names (crado mais déso pas déso, three.js = nul)
                const url = URL.createObjectURL(new Blob([this.model.data]));

                loader.loadAsync(url).then(gltf => {
                    this.selectedProp = null;
                    this.selectedComp = null;

                    const oldTargets = this.targets;
                    this.props = parseModel(gltf.scene);
                    this.targets = [];

                    oldTargets.forEach(target => {
                        const newProp = this.props.find(p => p.name === target.name);
                        if (newProp) {
                            addTarget(this, newProp);
                            newProp.components.push(...target.components);
                        }
                    });

                    set3DMachineModel(gltf);
                    resolve(gltf.scene);
                }).catch(err => {
                    resolve(null);
                });
            })
        },
        printAnchor() {
            printArtifactAnchor({
                id: this.artifactId,
                name: this.translations[this.selectedLang].name
            });
        },
        fixArtifact(ev) {
            const loading = this.$refs.loading;
            const log = loading.log(Lang.CurrentLang.FIXING_ARTIFACT_MODEL);

            API.execute_logged(API.ROUTE.ARTIFACTS + this.artifactId + "/model", API.METHOD.PUT, User.currentUser.getCredentials(), ev.target.files[0], API.TYPE.FILE).then(res => {
                log.update(Lang.CurrentLang.CORRECTED, Log.SUCCESS);
                setTimeout(() => {
                    log.delete();
                    this.$router.go();
                }, 2000);
            }).catch(err => {
                log.error(err);
                setTimeout(() => {
                    log.delete();
                }, 4000);
            });
        },
        popupDeleteArtifact() {
            const loading = this.$refs.loading;
            const log = loading.log(Lang.CurrentLang.DELETING, Log.INFO);

            API.execute_logged(API.ROUTE.ARTIFACTS + this.artifactId, API.METHOD.DELETE, User.currentUser.getCredentials()).then(res => {
                log.update(Lang.CurrentLang.DELETED, Log.SUCCESS);
                setTimeout(() => {
                    log.delete();
                    this.$router.push('/artifacts');
                }, 2000);
            }).catch(err => {
                log.error(err);
                setTimeout(() => {
                    log.delete();
                }, 4000);
            });
        }
    }
};
</script>

<style scoped>
#input-artifactmodel {
	width: 0.1px;
	height: 0.1px;
	opacity: 0;
	overflow: hidden;
	position: absolute;
	z-index: -1;
}
</style>