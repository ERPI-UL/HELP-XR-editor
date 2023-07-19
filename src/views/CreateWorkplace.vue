<template>
    <div class="flex flex-col grow min-h-0 max-h-full min-w-0 max-w-full">
        <div
            id="content"
            class="flex md:flex-row flex-col grow min-h-0 h-fit max-h-full"
        >
            <div
                id="left-side"
                class="md:flex hidden flex-col transition-none max-h-full min-h-0 min-w-0 md:w-[75%] w-full"
            >
                <div class="flex grow max-h-full min-h-0 min-w-0 max-w-full">
                    <div class="flex flex-col relative grow max-h-full min-h-0 min-w-0 max-w-full bg-white md:m-2 mr-1 mx-1 rounded-lg overflow-hidden">
                        <p class="p-2 text-xl text-indigo-600 font-semibold whitespace-nowrap text-ellipsis overflow-hidden">
                            {{ lang.EDITOR }}
                        </p>
                        <div class="flex flex-col absolute w-full h-full p-4 pt-12 pointer-events-none">
                            <div class="flex flex-col space-y-2 items-start justify-start grow w-full">
                                <button
                                    class="flex space-x-2 text-slate-600 items-center pointer-events-auto"
                                    @click="resetView()"
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
                                    v-show="pageMode !== MODE_VIEW"
                                    class="flex space-x-2 text-slate-600 items-center pointer-events-auto"
                                    @click="setTransformMode('translate')"
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
                                        {{ lang.MOVE_ARTIFACT }}
                                    </p>
                                </button>
                                <button
                                    v-if="transformMode === 'translate'"
                                    v-show="pageMode !== MODE_VIEW"
                                    class="flex space-x-2 text-slate-600 items-center pointer-events-auto"
                                    @click="setTransformMode('rotate')"
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
                                        {{ lang.ROTATE_ARTIFACT }}
                                    </p>
                                </button>
                            </div>
                            <div class="flex h-fit w-full">
                                <border-card
                                    class="flex flex-col show-up bg-white mx-auto shadow-md pointer-events-auto text-slate-600"
                                    :class="(selectedArtifact || placingAnchor) ? '' : 'hidden'"
                                >
                                    <div class="flex justify-between">
                                        <p class="px-2 py-0.5 text-xl text-indigo-600 font-semibold whitespace-nowrap text-ellipsis overflow-hidden">
                                            {{ placingAnchor ? lang.QRCODE_INFOS : lang.ARTIFACT_INFOS }}
                                        </p>
                                    </div>
                                    <div class="flex p-2">
                                        <div
                                            class="flex flex-col p-2 pl-0 pb-0"
                                            :class="placingAnchor ? 'hidden' : 'w-1/2'"
                                        >
                                            <div class="flex flex-col grow">
                                                <p class="text-xl font-semibold whitespace-nowrap text-ellipsis overflow-hidden">
                                                    {{ lang.NAME }}
                                                </p>
                                                <div class="flex space-x-2">
                                                    <input-text
                                                        class="w-fit"
                                                        :disabled="true"
                                                        :value="selectedArtifact?.name"
                                                    />
                                                </div>
                                            </div>
                                            <div class="flex justify-between w-full">
                                                <button-block
                                                    :onclick="() => printArtifactAnchor(selectedArtifact)"
                                                >
                                                    <p> {{ lang.ANCHOR }} </p>
                                                    <qrcode-icon class="w-6 h-6" />
                                                </button-block>
                                                <button-block
                                                    v-show="pageMode !== MODE_VIEW"
                                                    :onclick="() => {
                                                        artifacts.splice(artifacts.indexOf(selectedArtifact), 1);
                                                        selectedArtifact = null;
                                                        deselectArtifact();
                                                        setArtifacts(artifacts);
                                                    }"
                                                    color="red"
                                                >
                                                    {{ lang.DELETE }}
                                                </button-block>
                                            </div>
                                        </div>
                                        <span
                                            class="flex grow w-1 h-full rounded-lg bg-slate-200"
                                            :class="placingAnchor ? 'hidden' : ''"
                                        />
                                        <div
                                            class="flex flex-col  p-2 pr-0 pb-0"
                                            :class="placingAnchor ? '' : 'w-1/2'"
                                        >
                                            <p class="text-xl font-semibold whitespace-nowrap text-ellipsis overflow-hidden">
                                                {{ lang.POSITION }}
                                            </p>
                                            <!-- artifact position fields -->
                                            <div
                                                v-if="selectedArtifact"
                                                class="flex space-x-2"
                                            >
                                                <input-text
                                                    style="width: 5em;"
                                                    :value="(Math.round(selectedArtifact?.model.position.x*100)/100).toString()"
                                                    :onchange="ev => { if (!isNaN(Number(ev.target.value))) selectedArtifact.model.position.x = Number(ev.target.value) }"
                                                    :disabled="pageMode === MODE_VIEW"
                                                />
                                                <input-text
                                                    style="width: 5em;"
                                                    :value="(Math.round(selectedArtifact?.model.position.y*100)/100).toString()"
                                                    :onchange="ev => { if (!isNaN(Number(ev.target.value))) selectedArtifact.model.position.y = Number(ev.target.value) }"
                                                    :disabled="pageMode === MODE_VIEW"
                                                />
                                                <input-text
                                                    style="width: 5em;"
                                                    :value="(Math.round(selectedArtifact?.model.position.z*100)/100).toString()"
                                                    :onchange="ev => { if (!isNaN(Number(ev.target.value))) selectedArtifact.model.position.z = Number(ev.target.value) }"
                                                    :disabled="pageMode === MODE_VIEW"
                                                />
                                            </div>
                                            
                                            <!-- qrcode position fields -->
                                            <div
                                                v-if="placingAnchor"
                                                class="flex space-x-2"
                                            >
                                                <input-text
                                                    style="width: 5em;"
                                                    :value="(Math.round(anchor.position.x * 100) / 100).toString()"
                                                    :onchange="ev => { if (!isNaN(Number(ev.target.value))) setAnchorPosRot({x: Number(ev.target.value)}, {}) }"
                                                    :disabled="pageMode === MODE_VIEW"
                                                />
                                                <input-text
                                                    style="width: 5em;"
                                                    :value="(Math.round(anchor.position.y * 100) / 100).toString()"
                                                    :onchange="ev => { if (!isNaN(Number(ev.target.value))) setAnchorPosRot({y: Number(ev.target.value)}, {}) }"
                                                    :disabled="pageMode === MODE_VIEW"
                                                />
                                                <input-text
                                                    style="width: 5em;"
                                                    :value="(Math.round(anchor.position.z * 100) / 100).toString()"
                                                    :onchange="ev => { if (!isNaN(Number(ev.target.value))) setAnchorPosRot({z: Number(ev.target.value)}, {}) }"
                                                    :disabled="pageMode === MODE_VIEW"
                                                />
                                            </div>
                                            <p class="text-xl font-semibold whitespace-nowrap text-ellipsis overflow-hidden pt-4">
                                                {{ lang.ROTATION }}
                                            </p>
                                            <!-- artifact rotation fields -->
                                            <div
                                                v-if="selectedArtifact"
                                                class="flex space-x-2"
                                            >
                                                <input-text
                                                    style="width: 5em;"
                                                    :value="Math.round(selectedArtifact?.model.rotation.x * RAD2DEG).toString()"
                                                    :onchange="ev => { if (!isNaN(Number(ev.target.value))) selectedArtifact.model.rotation.x = Number(ev.target.value) * DEG2RAD }"
                                                    :disabled="pageMode === MODE_VIEW"
                                                />
                                                <input-text
                                                    style="width: 5em;"
                                                    :value="Math.round(selectedArtifact?.model.rotation.y * RAD2DEG).toString()"
                                                    :onchange="ev => { if (!isNaN(Number(ev.target.value))) selectedArtifact.model.rotation.y = Number(ev.target.value) * DEG2RAD }"
                                                    :disabled="pageMode === MODE_VIEW"
                                                />
                                                <input-text
                                                    style="width: 5em;"
                                                    :value="Math.round(selectedArtifact?.model.rotation.z * RAD2DEG).toString()"
                                                    :onchange="ev => { if (!isNaN(Number(ev.target.value))) selectedArtifact.model.rotation.z = Number(ev.target.value) * DEG2RAD }"
                                                    :disabled="pageMode === MODE_VIEW"
                                                />
                                            </div>
                                            
                                            <!-- qrcode rotation fields -->
                                            <div
                                                v-if="placingAnchor"
                                                class="flex space-x-2"
                                            >
                                                <input-text
                                                    style="width: 5em;"
                                                    :value="Math.round(anchor.rotation.x * RAD2DEG).toString()"
                                                    :onchange="ev => { if (!isNaN(Number(ev.target.value))) setAnchorPosRot({}, {x: Number(ev.target.value) * DEG2RAD}) }"
                                                    :disabled="pageMode === MODE_VIEW"
                                                />
                                                <input-text
                                                    style="width: 5em;"
                                                    :value="Math.round(anchor.rotation.y * RAD2DEG).toString()"
                                                    :onchange="ev => { if (!isNaN(Number(ev.target.value))) setAnchorPosRot({}, {y: Number(ev.target.value) * DEG2RAD}) }"
                                                    :disabled="pageMode === MODE_VIEW"
                                                />
                                                <input-text
                                                    style="width: 5em;"
                                                    :value="Math.round(anchor.rotation.z * RAD2DEG).toString()"
                                                    :onchange="ev => { if (!isNaN(Number(ev.target.value))) setAnchorPosRot({}, {z: Number(ev.target.value) * DEG2RAD}) }"
                                                    :disabled="pageMode === MODE_VIEW"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </border-card>
                            </div>
                        </div>
                        <canvas
                            id="DDD-view"
                            class="flex grow w-full h-full"
                        />
                    </div>
                </div>
            </div>
            <div
                id="actions-resize"
                class="md:flex hidden resize-slider flex my-2 px-1 cursor-col-resize select-none"
            >
                <!-- separator with resize slider -->
                <span class="flex w-1 grow rounded-lg bg-slate-300" />
            </div>
            <div
                id="right-side"
                class="flex flex-col grow max-h-full pb-2 min-h-0 transition-none md:w-[25%] w-full"
            >
                <div class="flex grow flex-col max-h-full min-h-0 space-y-1">
                    <div
                        class="flex grow flex-col max-h-full min-h-0 bg-white md:m-2 ml-1 mx-1 rounded-lg"
                        :class="pageMode == MODE_VIEW ? 'hidden' : ''"
                    >
                        <p class="p-2 pb-0 text-xl font-semibold text-indigo-600 whitespace-nowrap text-ellipsis">
                            {{ lang.ARTIFACTS }}
                        </p>
                        <div class="flex grow p-2 min-h-0 h-full max-h-full min-w-0 w-full max-w-full">
                            <artifact-selector
                                class="flex grow"
                                :onselected="addArtifact"
                            />
                        </div>
                    </div>
                    <!-- Basic informations -->
                    <div
                        class="flex flex-col min-h-fit h-fit md:m-2 ml-1 mx-1 rounded-lg bg-white"
                        :class="pageMode == 'view' ? 'grow' : ''"
                    >
                        <button
                            class="flex items-center justify-between rounded-md text-indigo-600"
                            :class="pageMode == MODE_VIEW? 'cursor-default' : 'hover:bg-slate-50 hover:text-indigo-700'"
                            @click="() => { if (pageMode !== 'view') toggleInfosPanel(); }"
                        >
                            <p class="p-2 text-xl font-semibold whitespace-nowrap text-ellipsis overflow-hidden">
                                {{ lang.WORKPLACE_INFOS }}
                            </p>
                            <div
                                id="chevron-infos"
                                class="h-fit w-8"
                                :class="pageMode == MODE_VIEW? 'hidden' : ''"
                            >
                                <chevron-down-icon />
                            </div>
                        </button>
                        <div
                            id="infos-panel"
                            class="flex grow min-h-fit flex-col min-h-[16em] p-2"
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
                                    :label="lang.WORKPLACE_NAME"
                                    :value="workplace[selectedLang]?.name"
                                    :onchange="ev => {
                                        if (!workplace[selectedLang]) workplace[selectedLang] = {}; 
                                        workplace[selectedLang].name = ev.target.value
                                    }"
                                    :disabled="pageMode == MODE_VIEW"
                                />
                                <input-area
                                    :label="lang.WORKPLACE_DESC"
                                    :value="workplace[selectedLang]?.description"
                                    :onchange="ev => {
                                        if (!workplace[selectedLang]) workplace[selectedLang] = {}; 
                                        workplace[selectedLang].description = ev.target.value
                                    }"
                                    :resize="false"
                                    :disabled="pageMode == MODE_VIEW"
                                />
                            </div>
                            <div class="h-fit">
                                <div class="flex w-full items-center">
                                    <span class="flex grow h-1 bg-slate-200" />
                                    <p class="p-2 text-lg text-slate-600 font-semibold whitespace-nowrap text-ellipsis overflow-hidden">
                                        {{ lang.WORKPLACE_ANCHOR }}
                                    </p>
                                    <span class="flex grow h-1 bg-slate-200" />
                                </div>
                                <div class="flex justify-between px-2">
                                    <button-outline
                                        class="md:flex hidden"
                                        @click="togglePlacingAnchor"
                                    >
                                        {{ 
                                            placingAnchor
                                                ? (pageMode == MODE_VIEW? lang.HIDE_ANCHOR_INFOS : lang.VALIDATE_PLACEMENT)
                                                : (pageMode == MODE_VIEW? lang.SEE_ANCHOR_INFOS : lang.PLACE_ANCHOR)
                                        }}
                                    </button-outline>
                                    <button-block
                                        v-show="pageMode !== MODE_CREATE"
                                        :onclick="() => printWorkplaceAnchor({id: workplaceId, name: workplace[selectedLang].name})"
                                    >
                                        <p> {{ lang.ANCHOR }} </p>
                                        <qrcode-icon class="w-6 h-6" />
                                    </button-block>
                                </div>
                            </div>
                        </div>
                        <div
                            id="navbar"
                            class="md:flex hidden flex-col px-2 pb-2"
                        >
                            <log-zone ref="log-zone" />
                            <!-- BUTTONS -->
                            <div class="flex h-fit w-full justify-between items-center space-x-2">
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
                                    @click="deleteWorkplace"
                                >
                                    {{ lang.DELETE }}
                                </button-block> <!-- delete button -->
                                <button-block
                                    v-if="pageMode !== MODE_VIEW"
                                    ref="save-btn"
                                    @click="saveWorkplace"
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
                        <div
                            class="md:hidden flex justify-end px-2 pb-2"
                        >
                            <router-link :to="'/activities?workplace=' + workplaceId">
                                <button-outline
                                    v-show="pageMode === MODE_VIEW"
                                    class="space-x-2 pointer-events-auto"
                                >
                                    <p> {{ lang.COMPATIBLE_ACTIVITIES }} </p>
                                    <arrow-right-icon class="w-6" />
                                </button-outline>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <master-loading
            ref="loading"
            :title="lang.LOADING_WORKPLACE"
            :desc="lang.LOADING_WORKPLACE_DESC"
        />
    </div>
</template>

<script>
import ButtonBlock from "../components/inputs/ButtonBlock.vue";
import ButtonText from "../components/inputs/ButtonText.vue";
import ButtonOutline from "../components/inputs/OutlineButton.vue"; // FIXME : create a clean outline button
import InputText from "../components/inputs/InputText.vue";
import InputArea from "../components/inputs/InputArea.vue";
import InputChoice from "../components/inputs/InputChoice.vue";
import BorderCard from "../components/cards/BorderCard.vue";
import ValidatePopup from "../components/ValidatePopup.vue";
import LogZone from "../components/cards/LogZone.vue";
import MasterLoading from '../components/cards/MasterLoading.vue';
import User from '../script/User';
import { togglePanel } from '../script/common';
import { printArtifactAnchor, printWorkplaceAnchor } from '../script/artifacts/Anchor';
import {
    saveWorkplace,
    editWorkplace,
    deleteWorkplace,
    addArtifact,
    remArtifact,
    loadWorkplace,
    validateInputs
} from '../script/workplaces/CreateWorkplace';

import {
    ChevronDownIcon,
    PencilIcon,
    QrcodeIcon,
    ArrowRightIcon
} from '@heroicons/vue/solid';
import API from '../script/API';
import Lang from '../script/Lang';
import ArtifactSelector from '../components/artifacts/ArtifactSelector.vue';
import {
    checkForCanvasSetup,
    deselectArtifact,
    resetCameraTransform,
    selectArtifact,
    setArtifacts,
    setTransformMode,
    startRendering,
    getAnchorPosRot,
    setAnchorPosRot,
    enableAnchorControls
} from '../script/workplaces/WorkplaceEditor';

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

    checkForCanvasSetup(obj.$el.querySelector("#DDD-view")).then(context => {
        startRendering(context);
    });
}

function toggleInfosPanel() {
    togglePanel("chevron-infos", "infos-panel");
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
        ButtonOutline,
        ValidatePopup,
        ChevronDownIcon,
        PencilIcon,
        InputText,
        InputArea,
        InputChoice,
        BorderCard,
        ArtifactSelector,
        QrcodeIcon,
        LogZone,
        MasterLoading,
        ArrowRightIcon
    },
    setup() {
        
    },
    data() {
        return {
            lang: Lang.CurrentLang,
            Lang,
            User,
            pageMode: "",
            MODE_VIEW,
            MODE_CREATE,
            MODE_EDIT,
            currentCode: Lang.CurrentCode,
            placingAnchor: false,
            workplace: {},
            workplaceId: 0,
            selectedLang: Lang.CurrentCode,
            artifacts: [],
            selectedArtifact: null,
            RAD2DEG: 180 / Math.PI,
            DEG2RAD: Math.PI / 180,
            Math,
            transformMode: 'translate',
            anchor: {
                position: getAnchorPosRot().position,
                rotation: getAnchorPosRot().rotation
            },
            window,
            langs: [],
            old: {
                anchor: null,
                artifacts: [],
                workplace: null
            },
            translations: []
        };
    },
    watch: {
        "selectedArtifact": function () {
            if (this.selectedArtifact !== null)
                this.placingAnchor = false;
        }
    },
    mounted() {
        Lang.AddCallback(lang => this.lang = lang);
        const pathid = window.location.pathname.split("/").pop();
        this.pageMode = (pathid === 'view') ? MODE_VIEW : (pathid === 'edit' ? MODE_EDIT : MODE_CREATE);
        this.workplaceId = Number(window.location.href.split("id=")[1]);

        if (this.$route.query.id)
            fetchTitleRessource(API.execute(API.ROUTE.WORKPLACES + this.$route.query.id), workplace => workplace.name);

        setup(this);

        // FIXME : artifact rotation doesn't trigger update on vuejs, temporary fix
        const lastRot = {x: 0, y: 0, z: 0};
        setInterval(() => {
            if (!this.selectedArtifact) return
            const newRot = {x: this.selectedArtifact.model.rotation.x, y: this.selectedArtifact.model.rotation.y, z: this.selectedArtifact.model.rotation.z};
            if (newRot.x != lastRot.x || newRot.y != lastRot.y || newRot.z != lastRot.z) {
                lastRot.x = newRot.x;
                lastRot.y = newRot.y;
                lastRot.z = newRot.z;
                this.selectedArtifact.model.rotation.x = lastRot.x;
                this.selectedArtifact.model.rotation.y = lastRot.y;
                this.selectedArtifact.model.rotation.z = lastRot.z;
                this.$forceUpdate();
            }
        }, 100);

        // FIXME : need to find a way to update ui on anchor position/rotation change
        setInterval(() => {
            if (!this.placingAnchor) return;
            this.anchor = {
                position: getAnchorPosRot().position,
                rotation: getAnchorPosRot().rotation
            };
        }, 100);

        const canvas = this.$el.querySelector("#DDD-view");
        if (!canvas) return;
        let mouseDownPos = {x:0,y:0};
        canvas.addEventListener("mousedown", ev => {
            const rect = canvas.getBoundingClientRect();
            mouseDownPos = {x: ev.x - rect.left, y: ev.y - rect.top};
        });
        canvas.addEventListener("mouseup", ev => {
            const rect = canvas.getBoundingClientRect();
            const newMouseDownPos = {x: ev.x - rect.left, y: ev.y - rect.top};
            const dx = newMouseDownPos.x - mouseDownPos.x;
            const dy = newMouseDownPos.y - mouseDownPos.y;
            if (Math.sqrt(dx*dx + dy*dy) < 2 && !this.placingAnchor)
                selectArtifact(newMouseDownPos.x, newMouseDownPos.y).then(artifact => {
                    this.selectedArtifact = artifact;
                });
        });

        const loading = this.$refs.loading;
        loading.start();
        if (this.pageMode !== MODE_CREATE) {
            loadWorkplace(this, this.$route.query.id).then(() => {
                this.old.artifacts = JSON.parse(JSON.stringify(this.artifacts.map(art => ({
                    id: art.id,
                    instanceId: art.instanceId,
                    artifactID: art.artifactID,
                    position: {x: art.position.x, y: art.position.y, z: art.position.z},
                    rotation: {x: art.rotation.x, y: art.rotation.y, z: art.rotation.z},
                })))); // deep copy to avoid linkage
                this.old.anchor = JSON.parse(JSON.stringify(this.anchor)); // deep copy to avoid linkage
                this.old.workplace = JSON.parse(JSON.stringify(this.workplace)); // deep copy to avoid linkage

                fetchLanguages().then(langs => {
                    this.langs = langs.map(lang => ({value: lang.code, label: lang.name + " " + lang.unicode}));
                    if (this.pageMode == MODE_VIEW)
                        this.langs = this.langs.filter(el => Object.keys(this.workplace).includes(el.value));
                    setTimeout(() => {
                        this.selectedLang =
                            this.langs.map(el => el).includes(Lang.CurrentCode)
                                ? Lang.CurrentCode
                                : this.langs[0].value;
                    }, 20);
                    loading.stop();
                }).catch(console.error);
            }).catch(console.error);
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
        isNaN,
        toggleInfosPanel,
        setArtifacts,
        deselectArtifact,
        setAnchorPosRot,
        printArtifactAnchor,
        printWorkplaceAnchor,
        saveWorkplace() {
            if (this.pageMode === MODE_VIEW) return;
            if (!validateInputs(this)) return;
            if (this.pageMode === MODE_EDIT) editWorkplace(this);
            if (this.pageMode === MODE_CREATE) saveWorkplace(this);
        },
        deleteWorkplace() { deleteWorkplace(this); },
        addArtifact(art) { addArtifact(this, art); },
        remArtifact(art) { remArtifact(this, art); },
        setTransformMode(mode) {
            this.transformMode = mode;
            setTransformMode(mode);
        },
        togglePlacingAnchor() {
            this.placingAnchor = !this.placingAnchor;
            if (this.placingAnchor) {
                this.selectedArtifact = null;
                deselectArtifact();
            }
            enableAnchorControls(this.placingAnchor, this.anchor);
        },
        resetView() {
            resetCameraTransform();
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