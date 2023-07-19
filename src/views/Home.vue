<template>
    <!-- Home page -->
    <div class="flex flex-col grow min-h-0 max-h-full min-w-0 max-w-full">
        <div
            v-if="User.currentUser === null || User.currentUser.isVisitor()"
            class="flex flex-col grow m-2"
        >
            <div class="flex md:flex-row flex-col m-auto p-4 rounded-lg shadow-lg bg-white max-w-full md:max-w-[42em]">
                <div class="flex h-full mx-auto items-center">
                    <img
                        class="md:max-h-[30vh] max-h-[15vh] w-auto"
                        src="../assets/images/icon_full.png"
                        alt=""
                    >
                </div>
                <div class="flex flex-col w-fit max-w-full md:px-4 px-2 justify-between space-y-4">
                    <h1 class="text-gray-600 text-2xl font-bold text-center">
                        {{ lang.HOME_TITLE }}
                    </h1>
                    <div class="flex grow flex-col justify-evenly space-y-4">
                        <p class="text-gray-500 text-lg text-center">
                            {{ lang.HOME_DESC }}
                        </p>
                        <div class="flex flex-wrap justify-center items-center w-fit max-w-full space-x-2 text-center">
                            <p class="text-gray-500 text-lg text-center">
                                {{ lang.HOME_DESC2.split("<login>")[0].trim() }}
                            </p>
                            <button-text
                                href="/login"
                            >
                                <p class="whitespace-nowrap">{{ lang.LOGIN }}</p>
                            </button-text>
                            <p class="text-gray-500 text-lg text-center">
                                {{ lang.HOME_DESC2.split("<login>")[1].split("<register>")[0].trim() }}
                            </p>
                            <button-text
                                href="/register"
                            >
                                <p class="whitespace-nowrap">{{ lang.REGISTER }}</p>
                            </button-text>
                            <p class="text-gray-500 text-lg text-center">
                                {{ lang.HOME_DESC2.split("<register>")[1].trim() }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="max-w-full md:block hidden">
                <border-card class="flex flex-col m-4 p-2 bg-white m-auto w-fit">
                    <img
                        class="mx-auto w-80"
                        src="../assets/images/grand_est.png"
                        alt=""
                    >
                    <p class="font-semibold text-gray-600 my-auto mt-2 text-center">
                        {{ lang.WITH_GRANDEST_SUPPORT }}
                    </p>
                </border-card>
            </div>
        </div>
        <div 
            v-if="User.currentUser?.canLearner()"
            class="flex md:flex-row flex-col md:m-4 m-2 grow min-h-0"
        >
            <div class="md:mr-2 m-0 min-w-min max-w-full md:flex flex-col hidden w-min justify-between">
                <!-- Left panel containing the different scenario view modes -->
                <border-card
                    ref="menu"
                    class="bg-white rounded min-w-[12vw] divide-y min-w-0 w-fit"
                >
                    <h2 class="text-2xl font-extrabold text-indigo-600 px-6 py-2 whitespace-nowrap min-w-fit">
                        {{ lang.QUICK_ACCESS }}
                    </h2>
                    <div class="flex md:flex-col md:overflow-x-visible overflow-x-scroll justify-between py-2">
                        <p
                            v-for="el in shortcuts"
                            :key="el"
                            class="whitespace-nowrap py-1 px-2 mx-4 my-1 rounded-lg text-base font-semibold text-left text-indigo-800 cursor-pointer"
                            :class="menu.selectedOption == el.name? 'bg-indigo-600 text-white shadow-md shadow-indigo-600': ''"
                            @click="menu.selectedOption = el.name; selectOption()"
                        >
                            {{ el.title }}
                        </p>
                    </div>
                </border-card>
                <div class="flex grow" />
                <border-card class="flex flex-col m-4 p-2 bg-white m-auto w-fit">
                    <img
                        class="mx-auto w-80"
                        src="../assets/images/grand_est.png"
                        alt=""
                    >
                    <p class="font-semibold text-gray-600 my-auto mt-2 text-center">
                        {{ lang.WITH_GRANDEST_SUPPORT }}
                    </p>
                </border-card>
            </div>
            <div class="flex flex-col grow min-h-0 min-w-0">
                <div
                    id="overview"
                    class="flex grow min-h-0 min-w-fit max-w-[full] w-[50%] m-auto"
                >
                    <div class="flex grow flex-col bg-white rounded-lg border border-gray-200">
                        <div class="flex flex-col mx-4 my-2">
                            <div class="flex justify-between">
                                <h2 class="md:text-2xl text-xl font-extrabold text-indigo-600">
                                    {{ lang.LAST_SESSION }}
                                </h2>
                                <div
                                    v-show="lastSession !== null"
                                    class="flex my-auto h-fit w-fit py-1 px-2 bg-indigo-600/[0.1] rounded-lg"
                                >
                                    <div
                                        id="session-mode-ar"
                                        class="hidden flex space-x-2"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            class="h-6 m-auto text-indigo-600"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            stroke-width="2"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
                                            />
                                        </svg>
                                        <h2 class="text-xl font-bold text-indigo-600 my-auto pb-0.5">
                                            {{ lang.AR }}
                                        </h2>
                                    </div>
                                    <div
                                        id="session-mode-vr"
                                        class="hidden flex space-x-2"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            class="h-8 m-auto text-indigo-600"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            stroke-width="2"
                                        >
                                            <path
                                                style="stroke-width:1.5;stroke-linecap:round;"
                                                d="m 2.5073421,6.1455325 c 0.4873766,-0.3105358 18.2493199,-0.4596099 18.6205089,0 0.37119,0.4596099 0.379877,10.8981835 0.0329,11.2841635 -0.346978,0.38598 -6.058378,0.381594 -6.480989,0 -0.422612,-0.381595 -1.75887,-3.975154 -2.763468,-3.980711 -1.004599,-0.0056 -2.098533,3.654439 -2.5660784,3.980711 -0.467545,0.326271 -6.3530375,0.34583 -6.7770756,0 C 2.1491009,17.083866 2.0199655,6.4560683 2.5073421,6.1455325 Z"
                                            />
                                            <path
                                                style="stroke-width:1.5;stroke-linecap:round;"
                                                d="M 9.5244628,10.374794 A 2.1383975,2.2041943 0 0 1 8.4552361,13.28587 2.1383975,2.2041943 0 0 1 5.6279996,12.192107 2.1383975,2.2041943 0 0 1 6.6809899,9.2747502 2.1383975,2.2041943 0 0 1 9.5142735,10.351759 Z"
                                            />
                                            <path
                                                style="stroke-width:1.5;stroke-linecap:round;"
                                                d="m 18.07805,10.341861 a 2.1383975,2.2041943 0 0 1 -1.069227,2.911075 2.1383975,2.2041943 0 0 1 -2.827236,-1.093762 2.1383975,2.2041943 0 0 1 1.05299,-2.9173571 2.1383975,2.2041943 0 0 1 2.833284,1.0770081 z"
                                            />
                                        </svg>
                                        <h2 class="text-xl font-bold text-indigo-600 my-auto pb-0.5">
                                            {{ lang.VR }}
                                        </h2>
                                    </div>
                                </div>
                            </div>
                            <div
                                id="stat-zone"
                                class="flex flex-col space-y-2"
                            />
                        </div>
                        <div class="md:flex hidden grow m-4 min-h-0 max-h-full max-w-full min-w-0">
                            <div
                                id="loading-zone"
                                class="flex grow"
                            >
                                <div class="flex m-auto">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="rotate h-6 w-6 text-indigo-600 my-1 md:block hidden"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        stroke-width="2"
                                    >
                                        <path
                                            style="stroke:#4f46e5;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;"
                                            d="M 21.8,11.8 A 10,10 0 0 1 11.8,21.8 10,10 0 0 1 1.8,11.8 10,10 Z"
                                        />
                                    </svg>
                                    <p class="ml-4 text-xl font-semibold text-indigo-600">
                                        {{ lang.LOADING }} ...
                                    </p>
                                </div>
                            </div>
                            <canvas
                                id="chart-canvas"
                                class="flex my-auto min-w-0 min-h-0 max-h-full max-w-full hidden"
                            />
                        </div>
                    </div>
                </div>
                <div
                    id="shortcuts"
                    class="md:flex hidden mx-auto max-w-full min-w-0"
                >
                    <MenuDiv
                        v-for="categ in shortcuts"
                        v-show="menu.selectedOption == categ.name"
                        :key="categ"
                        :title="categ.title"
                    >
                        <border-card
                            v-for="el in categ.data"
                            :key="el"
                            class="bg-white p-4 space-y-4"
                        >
                            <CardTitle :icon="el.icon">
                                <template #title>
                                    {{ el.title }}
                                </template>
                            </CardTitle>
                            <p class="whitespace-wrap text-gray-600">
                                {{ el.description }}
                            </p>
                            <div class="flex grow-0 md:justify-end justify-center">
                                <button-block
                                    :href="el.redirect.href"
                                >
                                    {{ el.redirect.label }}
                                </button-block>
                            </div>
                        </border-card>
                    </MenuDiv>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import API from "../script/API";
import User from "../script/User";
import ButtonBlock from "../components/inputs/ButtonBlock.vue";
import CardTitle from "../components/CardTitle.vue";
import MenuDiv from "../components/MenuDiv.vue";
import Chart from "chart.js/auto";
import { stringTime } from "../script/common";
import Lang from '../script/Lang';
import ButtonText from '../components/inputs/ButtonText.vue';
import BorderCard from '../components/cards/BorderCard.vue';

let menu = {
    selectedOption: "recent"
};
function selectOption(option) {
    if (option) menu.selectedOption = option;
}

function setup() {
    if (!User.isConnected(User.currentUser)) return;
    
    let data = [];
    let labels = [];
    API.execute_logged(API.ROUTE.STATS.USERS + User.currentUser.id + API.ROUTE.STATS.__SESSIONS, API.METHOD.GET, User.currentUser.getCredentials()).then(sessions => {
        if (sessions.data.length > 0)
            API.execute_logged(API.ROUTE.STATS.SESSIONS+sessions.data[0].id, API.METHOD.GET, User.currentUser.getCredentials()).then(session => {
                API.execute_logged(API.ROUTE.ACTIVITIES+session.scenario.id, API.METHOD.GET, User.currentUser.getCredentials()).then(scenario => {
                    // TODO : set infos in 'lastSession' and modifiy dom to display it by itself (we are using vuejs, damnit)
                    document.getElementById("chart-canvas").classList.remove("hidden");
                    document.getElementById("loading-zone").classList.add("hidden");
                    labels = scenario.actions.map(action => action.name);
                    data = scenario.actions.map(action => session.playedSteps.filter(playedSteps => playedSteps.action_id === action.id).map(playedStep => playedStep.time).reduce((a, b) => a+b, 0));
                    // generate stats and display them
                    generateChart(data, labels);
                    const container = document.getElementById("stat-zone");
                    if (container !== null) container.innerHTML = "";
                    addStat(`- ${Lang.CurrentLang.ACTIVITY} :`, scenario.name);
                    addStat(`- ${Lang.CurrentLang.DATE} :`, new Date(session.date).toLocaleString());
                    addStat(`- ${Lang.CurrentLang.TIME} :`, stringTime(session.playedSteps.map(playedStep => playedStep.time).reduce((a, b) => a+b, 0)));

                    // display the mode icon (AR or VR)
                    const vrIcon = document.getElementById("session-mode-vr");
                    const arIcon = document.getElementById("session-mode-ar");
                    const iconToShow = session.vrmode ? vrIcon : arIcon;
                    iconToShow.classList.remove("hidden");
                }).catch(console.error);
            }).catch(console.error);
        else noLastSession();
    }).catch(noLastSession);
}

// executed when no last session is available
function noLastSession() {
    const loadingZone = document.getElementById("loading-zone");
    if (!loadingZone) return;
    loadingZone.innerHTML = `
        <div class="flex m-auto">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 text-gray-300 rotate-[-15deg]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <!-- <img src="https://iut-charlemagne.univ-lorraine.fr/wp-content/themes/eduma/images/image-404.jpg" class="opacity-30 w-40"> -->
            <p class="text-2xl font-extrabold text-gray-300 my-auto ml-4">${Lang.CurrentLang.NO_LAST_SESSION_FOUND}</p>
        </div>
    `
}

function addStat(title, data) {
    const container = document.getElementById("stat-zone");
    const card = document.createElement("div");
    card.classList.add("flex", "md:flex-row", "flex-col", "grow-0", "space-x-4", "justify-between");
    const titleElement = document.createElement("p");
    titleElement.classList.add("font-semibold", "whitespace-nowrap", "text-lg", "text-gray-600");
    const dataElement = document.createElement("p");
    dataElement.classList.add("font-semibold", "whitespace-nowrap", "text-lg", "text-indigo-600");
    titleElement.innerText = title;
    dataElement.innerText = data;
    card.appendChild(titleElement);
    card.appendChild(dataElement);
    container.appendChild(card);
}

function generateChart(data, labels) {
    let colors = ["#6366F1"];

    let counter = 0;
    let a = Array.from(Array(colors.length), () => colors[Math.floor((counter += Math.max(1, colors.length/labels.length)) % colors.length)]);

    /**@type {HTMLCanvasElement} */
    let canvas = document.getElementById("chart-canvas");
    const chart = new Chart(canvas, {
        title: "last session stats",
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: Lang.CurrentLang.ABS_TIME,
                backgroundColor: a,
                borderColor: a,
                data: data,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

const shortcuts = [
    {
        name: "recent",
        title: Lang.CurrentLang.FREQUENTLY_USED,
        data: []
    },
    {
        name: "account",
        title: Lang.CurrentLang.ACCOUNT,
        data: [
            {
                icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />`,
                title: Lang.CurrentLang.PROFILE_LINK_NAME,
                description: Lang.CurrentLang.PROFILE_LINK_DESC,
                redirect: {
                    href: "/profile",
                    label: Lang.CurrentLang.PROFILE_LINK_BTN
                }
            },
            {
                icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />`,
                title: Lang.CurrentLang.EASYCONNECT_LINK_NAME,
                description: Lang.CurrentLang.EASYCONNECT_LINK_DESC,
                redirect: {
                    href: "/easyconnect",
                    label: Lang.CurrentLang.EASYCONNECT_LINK_BTN
                }
            },
            {
                icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />`,
                title: Lang.CurrentLang.ADMIN_LINK_NAME,
                description: Lang.CurrentLang.ADMIN_LINK_DESC,
                redirect: {
                    href: "/admin",
                    label: Lang.CurrentLang.ADMIN_LINK_BTN
                }
            }
        ]
    },
    {
        name: "statistics",
        title: Lang.CurrentLang.STATISTICS,
        data: [
            {
                icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />`,
                title: Lang.CurrentLang.STATISTICS_LINK_NAME,
                description: Lang.CurrentLang.STATISTICS_LINK_DESC,
                redirect: {
                    href: "/statistics#learning",
                    label: Lang.CurrentLang.STATISTICS_LINK_BTN
                }
            }
        ]
    },
    {
        name: "activities",
        title: Lang.CurrentLang.ACTIVITIES,
        data: [
            {
                icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                       <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />`,
                title: Lang.CurrentLang.ACTIVITIES_LINK_NAME,
                description: Lang.CurrentLang.ACTIVITIES_LINK_DESC,
                redirect: {
                    href: "/activities",
                    label: Lang.CurrentLang.ACTIVITIES_LINK_BTN
                }
            }
        ]
    },
    {
        name: "artifacts",
        title: Lang.CurrentLang.ARTIFACTS,
        data: [
            {
                icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                       <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />`,
                title: Lang.CurrentLang.ARTIFACTS_LINK_NAME,
                description: Lang.CurrentLang.ARTIFACTS_LINK_DESC,
                redirect: {
                    href: "/artifacts",
                    label: Lang.CurrentLang.ARTIFACTS_LINK_BTN
                }
            }
        ]
    }
]

export default {
    name: "HomeView",
    components: {
        ButtonBlock,
        CardTitle,
        MenuDiv,
        ButtonText,
        BorderCard
    },
    setup() {
        let recent = shortcuts.find(sc => sc.name == "recent");
        recent.data.splice(0, recent.data.length);
        recent.data.push(shortcuts.find(sc => sc.name == "account").data.find(el => el.redirect.href == "/easyconnect"));

        // if desktop version (landscape mode), display all frequently used shortcut
        if (window.innerWidth > window.innerHeight) {
            recent.data.push(shortcuts.find(sc => sc.name == "statistics").data.find(el => el.redirect.href == "/statistics#learning"));
            recent.data.push(shortcuts.find(sc => sc.name == "activities").data.find(el => el.redirect.href == "/activities"));
        }
    },
    data() {
        return {
            lang: Lang.CurrentLang,
            User, 
            menu, 
            selectOption, 
            shortcuts,
            lastSession: null
        }
    },
    mounted() {
        setup();
    }
};
</script>


<style>
@keyframes rotate {
    0% {transform: rotate(0deg);}
    40% {transform: rotate(-20deg);}
    90% {transform: rotate(750deg);}
    100% {transform: rotate(720deg);}
}

.rotate {
    animation: rotate 1s ease infinite;
}
</style>