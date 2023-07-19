<template>
    <div class="flex grow min-h-0 max-h-full min-w-0 max-w-full">
        <div
            id="content"
            class="flex md:flex-row flex-col grow min-h-0 h-full max-h-full max-w-full space-y-1 md:space-y-0"
        >
            <div
                id="left-side"
                class="flex flex-col transition-none max-h-full min-h-0 md:min-w-fit md:w-[70%] w-full"
            >
                <div class="flex flex-col grow max-h-full min-h-0">
                    <div class="flex flex-col grow max-h-full">
                        <div class="flex grow max-h-full md:m-2 md:mr-1 mx-1 border-2 border-white border rounded-lg overflow-hidden">
                            <div class="flex flex-col bg-white min-h-fit h-full w-full">
                                <p class="flex md:p-2 p-1 pb-0 min-h-fit text-xl font-semibold text-indigo-600 whitespace-nowrap text-ellipsis">
                                    {{ lang.ACTIONS }}
                                </p>
                                <div class="flex relative grow rounded-lg md:m-2 m-1 border-2 border-slate-100 bg-slate-50 max-h-full min-h-0">
                                    <div class="absolute flex flex-col items-end w-full h-full p-2 pointer-events-none">
                                        <div class="flex grow">
                                            <div class="flex h-fit space-x-2">
                                                <button-block
                                                    class="pointer-events-auto"
                                                    :class="pageMode === MODE_VIEW ? 'hidden' : ''"
                                                    :onclick="spawnTranslationWindow"
                                                >
                                                    <translate-icon class="w-6 h-6" />
                                                    <p>
                                                        {{ lang.TRANSLATIONS }}
                                                    </p>
                                                </button-block>
                                            </div>
                                        </div>
                                        <div class="md:flex hidden h-fit w-fit space-x-2">
                                            <button-block
                                                v-show="!activity.running"
                                                class="space-x-2 pointer-events-auto"
                                                @click="startActivity"
                                            >
                                                <play-icon class="w-6" />
                                                <p>
                                                    {{ lang.RUN_ACTIVITY }}
                                                </p>
                                            </button-block>
                                            <button-block
                                                v-show="activity.running"
                                                class="space-x-2 pointer-events-auto"
                                                @click="prevAction"
                                            >
                                                <chevron-left-icon class="w-6" />
                                            </button-block>
                                            <button-block
                                                v-show="activity.running"
                                                class="space-x-2 pointer-events-auto"
                                                @click="stopActivity"
                                            >
                                                <stop-icon class="w-6" />
                                            </button-block>
                                            <button-block
                                                v-show="activity.running"
                                                class="space-x-2 pointer-events-auto"
                                                @click="nextAction"
                                            >
                                                <chevron-right-icon class="w-6" />
                                            </button-block>
                                        </div>
                                    </div>
                                    <div
                                        id="actions-zone"
                                        class="flex flex-col p-2 overflow-auto max-h-full min-w-0 w-full max-w-full"
                                    >
                                        <div class="flex bg-white border-2 border-slate-200 rounded-lg md:p-2 p-1 space-x-2 w-fit">
                                            <flag-icon class="md:w-6 w-5 text-slate-600" />
                                            <p class="text-slate-600 md:text-lg text-base font-semibold"> {{ lang.START }} </p>
                                        </div>
                                        <div class="flex items-center p-2 space-x-2">
                                            <span class="flex md:h-8 h-6 w-1 bg-slate-500 rounded-lg" />
                                            <button
                                                class="flex space-x-2 text-transparent hover:text-indigo-600 hover:translate-x-1 transition-all"
                                                :class="pageMode === MODE_VIEW ? 'hidden' : ''"
                                                @click="addAction(0)"
                                            >
                                                <plus-icon class="w-6 text-slate-600" />
                                                <p class="text-lg font-semibold"> {{ lang.ADD_ACTION }} </p>
                                            </button>
                                        </div>
                                        <div
                                            v-for="(action, index) in activity.data.actions"
                                            :key="action"
                                            class="flex flex-col max-w-full min-w-0"
                                        >
                                            <div
                                                :id="'action-'+index"
                                                class="slide-in-quick flex flex-col bg-white border-2 rounded-lg p-2 w-fit max-w-full h-fit transition-all"
                                                :class="activity.actionIndex === index ? 'border-indigo-600' + (activity.running ? ' shadow-md shadow-indigo-600' : '') : 'border-slate-200'"
                                                @click="() => {
                                                    activity.actionIndex = index;
                                                    if (activity.running) scrollToAction(index);
                                                }"
                                            >
                                                <div class="flex justify-between w-full h-fit mb-1 items-start space-x-4">
                                                    <p class="text-lg font-bold text-indigo-600">
                                                        {{ lang.ACTION }} {{ index + 1 }}
                                                    </p>
                                                    <div class="flex space-x-4">
                                                        <button
                                                            class="bg-slate-50 border-2 border-slate-200 rounded hover:shadow hover:border-slate-300 transition-all
                                                            "
                                                            :class="pageMode === MODE_VIEW ? 'hidden' : ''"
                                                            @click="upAction(index)"
                                                        >
                                                            <chevron-up-icon class="w-5" />
                                                        </button>
                                                        <button
                                                            class="bg-slate-50 border-2 border-slate-200 rounded hover:shadow hover:border-slate-300 transition-all
                                                            "
                                                            :class="pageMode === MODE_VIEW ? 'hidden' : ''"
                                                            @click="downAction(index)"
                                                        >
                                                            <chevron-down-icon class="w-5" />
                                                        </button>
                                                        <button
                                                            :class="pageMode === MODE_VIEW ? 'hidden' : ''"
                                                            @click="delAction(index)"
                                                        >
                                                            <x-icon class="w-5 text-red-500" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div class="flex flex-col w-full h-fit space-y-2">
                                                    <input-text
                                                        name="tag"
                                                        :label="lang.TAG"
                                                        :onchange="ev => {
                                                            activity.data.actions.forEach(action => {
                                                                if (action.type === 'choice') {
                                                                    if (action.choice.left.target === action.tag)
                                                                        action.choice.left.target = ev.target.value;
                                                                    if (action.choice.right.target === action.tag)
                                                                        action.choice.right.target = ev.target.value;
                                                                }
                                                            })
                                                            action.tag = ev.target.value;
                                                        }"
                                                        :value="action.tag"
                                                        :disabled="pageMode === MODE_VIEW"
                                                    />
                                                    <input-text
                                                        name="hint"
                                                        :label="lang.HINT"
                                                        :onchange="ev => action.hint[selectedLang] = ev.target.value"
                                                        :value="action.hint[selectedLang]"
                                                        :disabled="pageMode === MODE_VIEW"
                                                    />
                                                    <input-text
                                                        name="name"
                                                        :label="lang.NAME"
                                                        :onchange="ev => action.name[selectedLang] = ev.target.value"
                                                        :value="action.name[selectedLang]"
                                                        :disabled="pageMode === MODE_VIEW"
                                                    />
                                                    <input-area
                                                        name="description"
                                                        :label="lang.DESCRIPTION"
                                                        :onchange="ev => action.description[selectedLang] = ev.target.value"
                                                        :value="action.description[selectedLang]"
                                                        :disabled="pageMode === MODE_VIEW"
                                                    />
                                                    <div class="flex mt-2 items-center justify-between w-full space-x-4">
                                                        <p class="flex text-lg text-slate-600 font-bold whitespace-nowrap text-ellipsis w-fit">
                                                            {{ lang.TARGETS }}
                                                        </p>
                                                        <div class="flex flex-col w-fit border-2 border-slate-200 rounded-lg p-2 justify-center">
                                                            <div class="flex flex-col space-y-2 mb-2 max-h-32 overflow-auto min-w-[12em] w-fit">
                                                                <div
                                                                    v-for="(target, tindex) in action.targets"
                                                                    :key="target"
                                                                    class="slide-in-quick flex justify-center items-center w-full flex border-2 border-slate-200 rounded-lg bg-slate-100 p-1"
                                                                >
                                                                    <div class="flex w-full text-center min-w-fit pl-1">
                                                                        <p class="text-slate-600 font-bold text-md whitespace-nowrap text-ellipsis overflow-hidden">
                                                                            {{ target.name }}
                                                                        </p>
                                                                    </div>
                                                                    <button
                                                                        class="flex w-8 justify-end"
                                                                        :class="pageMode === MODE_VIEW ? 'hidden' : ''"
                                                                        @click="() => {
                                                                            action.targets.splice(tindex, 1);
                                                                            if (action.targets.length === 0)
                                                                                action.artifact = null;
                                                                        }"
                                                                    >
                                                                        <x-icon class="w-full text-red-500" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <button
                                                                class="flex items-center justify-center space-x-2 w-fit mx-auto border-2 border-indigo-300 px-2 py-0.5 rounded-lg hover:bg-indigo-50 hover:border-indigo-600"
                                                                :class="pageMode === MODE_VIEW ? 'hidden' : ''"
                                                                @click="$refs['targets-menu-' + index][0].show()"
                                                            >
                                                                <div class="flex flex-col">
                                                                    <plus-icon
                                                                        class="w-5 text-indigo-600"
                                                                    />
                                                                    <menu-selector
                                                                        :ref="'targets-menu-' + index"
                                                                        class="mx-auto"
                                                                        :elements="action.artifact ? action.artifact.targets : artifacts.map(artifact => ({name: artifact.name, elements: artifact.targets}))"
                                                                        :banned="action.targets"
                                                                        :onselected="target => {
                                                                            if (action.artifact === null)
                                                                                action.artifact = target.artifact;
                                                                            action.targets.push(target)
                                                                            setSelectedAction(action);
                                                                        }"
                                                                    />
                                                                </div>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div class="flex space-x-1">
                                                        <input-text
                                                            :id="'ressource-input-' + action.tag"
                                                            name="ressource"
                                                            type="file"
                                                            :disabled="pageMode === MODE_VIEW"
                                                            :label="lang.RESSOURCE"
                                                            :value="action.ressource.name || (pageMode == MODE_VIEW ? lang.NO_FILE : lang.SELECT_FILE)"
                                                            accept=".png, .jpg, .jpeg, .mp4, .webm, .mp3, .ogg, .wav"
                                                            :onchange="(ev) => { setActionFile(action, ev); }"
                                                            class="max-w-full"
                                                        />
                                                        <div class="flex mt-auto h-9">
                                                            <button
                                                                v-show="action.ressource.file !== null"
                                                                class="flex bg-white hover:bg-slate-200 rounded-md p-1 my-auto h-fit"
                                                                @click="() => { viewRessource(action.ressource.file, getRessourceType(action.ressource.name)) }"
                                                            >
                                                                <eye-icon class="w-5 text-slate-600" />
                                                            </button>
                                                            <button
                                                                v-show="action.ressource.file !== null && pageMode !== MODE_VIEW"
                                                                class="flex bg-white hover:bg-slate-200 rounded-md p-1 my-auto h-fit"
                                                                @click="() => { action.ressource.file = null; action.ressource.name = lang.SELECT_FILE; }"
                                                            >
                                                                <x-icon class="w-5 text-red-500" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <input-choice
                                                        name="type"
                                                        :label="lang.TYPE"
                                                        :list="actionTypes"
                                                        :value="action.type"
                                                        :onchange="ev => {
                                                            action.type = ev.target.value;
                                                            if (action.type === 'choice')
                                                                action.choice = {left: {}, right: {}};
                                                            else action.choice = undefined;
                                                        }"
                                                        :disabled="pageMode === MODE_VIEW"
                                                    />
                                                </div>
                                                <div
                                                    class="flex flex-col h-fit w-full overflow-hidden"
                                                    :class="action.type == 'choice' ? 'max-h-fit mt-2' : 'max-h-0'"
                                                >
                                                    <div class="flex flex-col h-fit w-full border-2 border-slate-200 rounded-lg p-2 space-y-2">
                                                        <input-text
                                                            name="opt-left-name"
                                                            :label="lang.OPTION_LEFT"
                                                            :value="action.choice?.left.name?.[selectedLang] ?? ''"
                                                            :onchange="ev => {
                                                                if (!action.choice.left.name) action.choice.left.name = {};
                                                                action.choice.left.name[selectedLang] = ev.target.value;
                                                            }"
                                                            :disabled="pageMode === MODE_VIEW"
                                                        />
                                                        <input-choice
                                                            name="opt-left-target"
                                                            :label="lang.TARGET_LEFT"
                                                            :list="activity.data.actions.map(a => ({label: a.tag, value: a.tag}))"
                                                            :value="typeof(action.choice?.left.target) === 'string'
                                                                ? action.choice?.left.target
                                                                : activity.data.actions.find(a => a.id === action.choice?.left.target)?.tag ?? ''"
                                                            :onchange="ev => action.choice.left.target = ev.target.value"
                                                            :disabled="pageMode === MODE_VIEW"
                                                        />
                                                        <span class="flex grow mx-4 rounded-lg bg-slate-100 h-1" />
                                                        <input-text
                                                            name="opt-right-name"
                                                            :label="lang.OPTION_RIGHT"
                                                            :value="action.choice?.right.name?.[selectedLang] ?? ''"
                                                            :onchange="ev => {
                                                                if (!action.choice.right.name) action.choice.right.name = {};
                                                                action.choice.right.name[selectedLang] = ev.target.value;
                                                            }"
                                                            :disabled="pageMode === MODE_VIEW"
                                                        />
                                                        <input-choice
                                                            name="opt-left-target"
                                                            :label="lang.TARGET_RIGHT"
                                                            :list="activity.data.actions.map(a => ({label: a.tag, value: a.tag}))"
                                                            :value="typeof(action.choice?.right.target) === 'string'
                                                                ? action.choice?.right.target
                                                                : activity.data.actions.find(a => a.id === action.choice?.right.target)?.tag ?? ''"
                                                            :onchange="ev => action.choice.right.target = ev.target.value"
                                                            :disabled="pageMode === MODE_VIEW"
                                                        />
                                                    </div>
                                                </div>
                                                <div class="flex mt-2 items-center justify-between w-full space-x-4">
                                                    <p class="flex text-lg text-slate-600 font-bold whitespace-nowrap text-ellipsis w-fit">
                                                        {{ lang.POSITION }}
                                                    </p>
                                                    <div class="flex w-fit space-x-2">
                                                        <input
                                                            v-for="attr in Object.keys(action.position)"
                                                            :key="attr"
                                                            type="number"
                                                            :name="'pos-'+attr"
                                                            class="flex h-fit md:w-20 w-14 border-2 rounded-md px-2 py-1 border-slate-200 font-bold text-md whitespace-nowrap max-w-full min-w-0 text-ellipsis text-center hover:border-slate-300 transition-colors placeholder-slate-600/[0.5]"
                                                            :class="pageMode === MODE_VIEW ? 'bg-slate-100 text-slate-600': ''"
                                                            :value="action.position[attr]"
                                                            :disabled="pageMode === MODE_VIEW"
                                                            @change="ev => { action.position[attr] = ev.target.value; setSelectedAction(action); }"
                                                        >
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="slide-in flex items-center p-2 space-x-2">
                                                <span class="flex md:h-8 h-6 w-1 bg-slate-500 rounded-lg" />
                                                <button
                                                    class="flex space-x-2 text-transparent hover:text-indigo-600 hover:translate-x-1 transition-all"
                                                    :class="pageMode === MODE_VIEW ? 'hidden' : ''"
                                                    @click="addAction(index + 1)"
                                                >
                                                    <plus-icon class="w-6 text-slate-600" />
                                                    <p class="text-lg font-semibold"> {{ lang.ADD_ACTION }} </p>
                                                </button>
                                            </div>
                                        </div>
                                        <div class="flex bg-white border-2 border-slate-200 rounded-lg md:p-2 p-1 space-x-2 w-fit">
                                            <stop-icon class="md:w-6 w-5 text-slate-600" />
                                            <p class="text-slate-600 md:text-lg text-base font-semibold"> {{ lang.END }} </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                id="actions-resize"
                class="md:flex hidden resize-slider flex my-2 py-2 px-1 cursor-col-resize select-none"
            >
                <!-- separator with resize slider -->
                <span class="flex w-1 grow rounded-lg bg-slate-300" />
            </div>
            <div
                id="right-side"
                class="flex flex-col grow min-h-fit max-h-full md:pb-2 pb-1 min-h-0 transition-none md:w-[30%] w-full"
            >
                <div class="flex flex-col grow max-h-full min-h-0 space-y-0">
                    <!-- model 3D view zone -->
                    <div class="md:flex hidden flex-col grow max-h-full min-h-0 bg-white m-2 ml-1 rounded-lg">
                        <p class="p-2 pb-0 text-xl font-semibold text-indigo-600 whitespace-nowrap text-ellipsis overflow-hidden">
                            {{ lang.PREVIEW }}
                        </p>
                        <border-card class="flex flex-col grow m-2 border-slate-100 bg-slate-50 overflow-hidden">
                            <div class="absolute p-1">
                                <button
                                    class="flex items-center justify-between"
                                    @click="resetControls($event.target)"
                                >
                                    <border-card
                                        class="flex rounded-lg bg-white boder-2 border-slate-200 p-0.5 shadow hover:shadow-md"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            class="h-6 w-6 m-auto text-slate-600"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            stroke-width="2"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                            />
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                    </border-card>
                                    <border-card class="h-full px-2 bg-white shadow hover:shadow-md">
                                        <p class="text-md font-semibold text-slate-600"> {{ lang.RESET_VIEW }} </p>
                                    </border-card>
                                </button>
                            </div>
                            <canvas
                                id="DDD-view"
                                class="flex grow h-full"
                            />
                        </border-card>
                    </div>
                    <!-- Basic informations -->
                    <div
                        class="flex flex-col min-h-fit ml-1 md:mr-2 mr-1 rounded-lg bg-white"
                    >
                        <button
                            class="flex items-center justify-between rounded-md hover:bg-slate-50 text-indigo-600 hover:text-indigo-700"
                            @click="toggleInfosPanel"
                        >
                            <p class="p-2 text-xl font-semibold whitespace-nowrap text-ellipsis overflow-hidden">
                                {{ lang.ACTIVITY_INFOS }}
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
                                    :label="lang.LANGUAGE"
                                    :list="langs"
                                    :value="selectedLang"
                                    :onchange="ev => selectedLang = ev.target.value"
                                    class="my-auto h-fit pointer-events-auto"
                                />
                                <input-text
                                    :label="lang.ACTIVITY_NAME"
                                    :value="activity.data.name[selectedLang]"
                                    :onchange="ev => activity.data.name[selectedLang] = ev.target.value"
                                    :disabled="pageMode === MODE_VIEW"
                                />
                                <input-area
                                    :label="lang.ACTIVITY_DESCRIPTION"
                                    :value="activity.data.description[selectedLang]"
                                    :onchange="ev => activity.data.description[selectedLang] = ev.target.value"
                                    :resize="false"
                                    :disabled="pageMode === MODE_VIEW"
                                />
                            </div>
                        </div>
                        <div
                            id="navbar"
                            class="md:flex hidden flex-col px-2 pb-2"
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
                                    @click="deleteActivity"
                                >
                                    {{ lang.DELETE }}
                                </button-block> <!-- delete button -->
                                <button-block
                                    v-if="pageMode !== MODE_VIEW"
                                    ref="save-btn"
                                    @click="saveActivity"
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
        <div class="relative md:flex hidden flex-col bg-white m-2 ml-0 min-w-fit max-h-full min-h-0 rounded-lg overflow-hidden">
            <button
                class="flex justify-between items-center rounded-md text-indigo-600 py-1 hover:text-indigo-700 hover:bg-slate-50"
                @click="toggleActivitiesPanel"
            >
                <div
                    id="chevron-activities"
                    class="rotate-180 px-1"
                >
                    <chevron-left-icon
                        class="w-8 h-8 rotate-180"
                    />
                </div>
                <p
                    id="activities-title"
                    class="text-xl text-indigo-600 font-semibold text-center mx-auto hidden"
                > {{ lang.ARTIFACTS }} </p>
            </button>
            <p
                id="-activities-title"
                class="absolute text-xl text-indigo-600 font-semibold text-center pb-2 right-5 top-10
                        pointer-events-none whitespace-nowrap -rotate-90"
                style="transform-origin: 100% 50%;"
            > {{ lang.ARTIFACTS }} </p>
            <div
                id="activities-panel"
                class="flex flex-col grow p-2 overflow-y-auto overflow-x-hidden rounded-lg space-y-1 hidden w-fit  max-w-[14em]"
            >
                <artifact-selector
                    v-show="pageMode !== MODE_VIEW"
                    class="h-[70%]"
                    :onselected="addArtifact"
                    :banned="artifacts"
                />
                <p
                    class="text-lg text-indigo-600 font-semibold text-center"
                > {{ lang.SELECTED }} </p>
                <border-card class="flex flex-col h-[30%] py-2 px-4 space-y-2 overflow-y-auto">
                    <border-card
                        v-for="artifact in artifacts"
                        :key="artifact"
                        class="flex justify-between shadow p-1 px-2 bg-slate-50 hover:shadow-md"
                    >
                        <div class="flex w-fit max-w-full min-w-0">
                            <p class="text-md font-semibold text-slate-600 whitespace-nowrap text-ellipsis overflow-hidden"> {{ artifact.name }} </p>
                        </div>
                        <button
                            v-if="pageMode !== MODE_VIEW"
                            class="rounded text-red-500 hover:text-red-600 hover:bg-slate-200"
                            @click="delArtifact(artifact)"
                        >
                            <trash-icon class="w-6" />
                        </button>
                    </border-card>
                </border-card>
            </div>
        </div>
        <master-loading
            ref="loading"
            :title="lang.LOADING_ACTIVITY"
            :desc="lang.LOADING_ACTIVITY_DESC"
            :err-title="lang.LOADING_ACTIVITY_ERR"
            :err-desc="lang.LOADING_ACTIVITY_ERR_DESC"
            :err-validate="User.currentUser?.canTeacher() ? lang.DELETE : ''"
            :err-callback="deleteActivity"
        />
    </div>
</template>

<script>
import ButtonBlock from '../components/inputs/ButtonBlock.vue';
import ButtonText from '../components/inputs/ButtonText.vue';
import InputChoice from '../components/inputs/InputChoice.vue';
import InputText from '../components/inputs/InputText.vue';
import InputArea from '../components/inputs/InputArea.vue';
import ValidatePopup from "../components/ValidatePopup.vue";
import BorderCard from '../components/cards/BorderCard.vue';
import LogZone from '../components/cards/LogZone.vue';
import MasterLoading from '../components/cards/MasterLoading.vue';
import {
    ChevronDownIcon,
    ChevronUpIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    PlusIcon,
    TranslateIcon,
    PlayIcon,
    FlagIcon,
    StopIcon,
    XIcon,
    TrashIcon,
    PencilIcon,
    EyeIcon
} from '@heroicons/vue/solid';

import API from '../script/API';
import Lang from '../script/Lang';
import User from '../script/User';
import MenuSelector from '../components/inputs/MenuSelector.vue';
import ArtifactSelector from '../components/artifacts/ArtifactSelector.vue';
import { togglePanel } from '../script/common';
import {
    loadActivity,
    scrollToAction,
    startActivity,
    nextAction,
    prevAction,
    stopActivity,
    saveActivity,
    editActivity,
    deleteActivity,
    createDefaultActivity,
    addAction,
    delAction,
    spawnTranslationWindow,
    addArtifact,
    delArtifact,
    upAction,
    downAction,
    validateInputs
} from '../script/activities/CreateActivity';
import {
    checkForCanvasSetup,
    resetCameraTransform,
    setArtifacts,
    setOnTransformChange,
    setSelectedAction,
    startRendering
} from '../script/activities/ActivityPreview';

function toggleInfosPanel() {
    togglePanel("chevron-infos", "infos-panel");
    window.onresize?.();
}

function toggleActivitiesPanel() {
    togglePanel("chevron-activities", "activities-panel", "activities-title", "-activities-title");
}

function setupResizeBar() {
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
}

function fetchLanguages() {
    return new Promise((resolve, reject) => {
        API.execute(API.ROUTE.LANGUAGES).then(res => {
            resolve(res);
        }).catch(reject);
    })
}

function resetControls() {
    resetCameraTransform();
}

function filterLangs(obj) {
    if (obj.pageMode === obj.MODE_VIEW && obj.activity?.data?.languages.length > 0 && obj.langs.length > 1) {
        obj.langs = obj.langs.filter(l => obj.activity.data.languages.includes(l.value));
    }
}

function viewRessource(obj, ressource, type) {
    if (!type) return;

    const getRessourceData = () => {
        return new Promise((resolve, reject) => {
            if (ressource instanceof ArrayBuffer)
                resolve(ressource);
            else {
                const fileReader = new FileReader()
                fileReader.readAsArrayBuffer(ressource);
                fileReader.onload = () => { resolve(fileReader.result); }
            }
        })
    }

    getRessourceData().then(array => {
        const handle = window.open(
            "Ressource",
            "Ressource",
            `left=100,top=100,width=500,height=500`
        );
        const blob  = new Blob([array], { type });
        const data = window.URL.createObjectURL(blob);
        const media = type.split("/")[0];
        handle.onload = () => {
            switch (media) {
            case 'audio':
                handle.document.write(`<audio controls autoplay style="width: 100%; height: 100%; object-fit: contain;"><source src="${data}" type="${type}"></audio>`);
                break;
            case 'video':
                handle.document.write(`<video controls autoplay style="width: 100%; height: 100%; object-fit: contain;"><source src="${data}" type="${type}"></video>`);
                break;
            default:
                handle.document.write(`<img src="${data}" style="width: 100%; height: 100%; object-fit: contain;">`);
                break;
            }
        };
    });
}

function setActionFile(obj, action, ev) {
    if (obj.pageMode === obj.MODE_VIEW) return;
    const file = ev.target.files[0];
    const reader = new FileReader();
    reader.onload = ev => {
        action.ressource.name = file.name;
        action.ressource.file = file;
        action.ressource.changed = true;
    };
    reader.readAsArrayBuffer(file);
}

function getRessourceType(name) {
    if (!name.includes(".")) return null;
    const ext = name.split(".").pop();
    const exts = [
        {ext: "png", type: "image/png"},
        {ext: "jpg", type: "image/jpeg"},
        {ext: "jpeg", type: "image/jpeg"},
        {ext: "webm", type: "video/webm"},
        {ext: "mp4", type: "video/mp4"},
        {ext: "ogg", type: "audio/ogg"},
        {ext: "mp3", type: "audio/mpeg"},
        {ext: "wav", type: "audio/wav"},
    ];
    const res = exts.find(e => e.ext === ext);
    return res ? res.type : null;
}

export default {
    name: "CreateActivity",
    components: {
        ValidatePopup,
        ChevronUpIcon,
        ChevronDownIcon,
        ChevronLeftIcon,
        ChevronRightIcon,
        PlusIcon,
        TranslateIcon,
        PlayIcon,
        FlagIcon,
        StopIcon,
        XIcon,
        ButtonBlock,
        ButtonText,
        InputChoice,
        InputText,
        InputArea,
        MenuSelector,
        ArtifactSelector,
        BorderCard,
        TrashIcon,
        PencilIcon,
        LogZone,
        MasterLoading,
        EyeIcon
    },
    data() {
        return {
            lang: Lang.CurrentLang,
            User,
            API,
            Object,
            MODE_CREATE: 'create',
            MODE_EDIT: 'edit',
            MODE_VIEW: 'view',
            pageMode: window.location.pathname.split("/").pop(),
            activity: {
                running: false,
                actionIndex: 0,
                data: { name: {}, description: {}, actions: [] }
            },
            old: null,
            selectedLang: '',
            langs: [ {value: '', id: 'LOADING'} ],
            actionTypes: [
                { id: 'TYPE_ACTION', value: "action"},
                { id: 'TYPE_INFO', value: "info" },
                { id: 'TYPE_CHOICE', value: "choice" }
            ],
            translations: null,
            artifacts: [],
            window
        };
    },
    watch: {
        activity: {
            deep: true,
            handler() {
                if (!this.translations) return;
                this.translations.activity = this.activity.data;
                this.translations.refresh();
            }
        },
        'activity.actionIndex': {
            handler() {
                setSelectedAction(this.activity.data.actions[this.activity.actionIndex]);
            }
        }
    },
    mounted() {
        Lang.AddCallback(lang => this.lang = lang);

        checkForCanvasSetup(this.$el.querySelector("#DDD-view")).then(() => {
            startRendering();
        }).catch(console.error);

        if (this.$route.query.id)
            fetchTitleRessource(API.execute(API.ROUTE.ACTIVITIES + this.$route.query.id), activity => activity.name);
        
        if (this.pageMode !== this.MODE_CREATE) {
            const loading = this.$refs.loading;
            loading.start();
            loadActivity(this).then(() => {
                loading.stop();
                this.old = JSON.parse(JSON.stringify({
                    name: this.activity.data.name,
                    description: this.activity.data.description,
                    actions: this.activity.data.actions.map(a => ({
                        id: a.id,
                        tag: a.tag,
                        type: a.type,
                        name: a.name,
                        description: a.description,
                        hint: a.hint,
                        position: a.position,
                        choice: a.choice,
                        targets: a.targets,
                        artifact: {id: a.artifact?.id},
                        previous: a.previous,
                        next: a.next,
                    })), // TODO : add ressource support
                    artifacts: this.artifacts.map(a => ({id: a.id}))
                }));
                setSelectedAction(this.activity.data.actions[0]);
                filterLangs(this);
            }).catch(err => {
                console.error(err);
                loading.error();
            });
        } else {
            this.activity.data = createDefaultActivity();
            setSelectedAction(this.activity.data.actions[0]);
        }

        setOnTransformChange(pos => {
            this.activity.data.actions[this.activity.actionIndex].position = {
                x: Math.round(pos.x * 100) / 100,
                y: Math.round(pos.y * 100) / 100,
                z: Math.round(pos.z * 100) / 100
            };
        });

        fetchLanguages().then(langs => {
            this.langs = langs.map(lang => ({value: lang.code, label: lang.name + " " + lang.unicode}));
            filterLangs(this);
            setTimeout(() => {
                this.selectedLang =
                    this.langs.map(el => el.value).includes(Lang.CurrentCode)
                        ? Lang.CurrentCode
                        : this.langs[0].value;
            }, 20);
        }).catch(console.error);
        setupResizeBar();
    },
    methods: {
        toggleInfosPanel,
        toggleActivitiesPanel,
        scrollToAction,
        setSelectedAction,
        resetControls,
        startActivity() { startActivity(this); },
        nextAction() { nextAction(this); },
        prevAction() { prevAction(this); },
        stopActivity() { stopActivity(this); },
        saveActivity() {
            if (this.pageMode === this.MODE_VIEW) return;
            if (!validateInputs(this)) return;
            if (this.pageMode === this.MODE_CREATE) saveActivity(this);
            else editActivity(this);
        },
        deleteActivity()  { deleteActivity(this); },
        addAction(index)  { addAction(this, index); },
        delAction(index)  { delAction(this, index); },
        upAction(index)   { upAction(this, index); },
        downAction(index) { downAction(this, index); },
        addArtifact(art)  { addArtifact(this, art); setArtifacts(this.artifacts); },
        delArtifact(art)  { delArtifact(this, art); setArtifacts(this.artifacts); },
        spawnTranslationWindow() { spawnTranslationWindow(this); },
        setActionFile(action, ev) { setActionFile(this, action, ev); },
        viewRessource(ressource, type) { viewRessource(this, ressource, type); },
        getRessourceType(name) { return getRessourceType(name); },
    }
};
</script>

<style scoped>
.resize-slider:hover :nth-child(1) {
    @apply bg-indigo-600
}
</style>