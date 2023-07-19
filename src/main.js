import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'

import './index.css'
import "flowbite"

// https redirection (should be done in NGINX, but it not we do it here)
// if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
//     window.location.protocol = 'https:';
// }

let currentRessource = "<loading>";
window.fetchTitleRessource = (promise, parser) => {
    currentRessource = "<loading>";
    window.topbar?.update();

    if (promise instanceof Promise) {
        promise.then((value) => {
            currentRessource = '"' + parser(value) + '"';
            window.topbar?.update();
        });
    } else {
        currentRessource = '"' + parser(promise) + '"';
        window.topbar?.update();
    }
}

const router = createRouter({
    mode: "history",
    history: createWebHistory(),
    routes: [
        { path: '/',                  name: 'Home',            component: () => import("./views/Home.vue"),            meta: { title: () => Lang.CurrentLang["PAGE_Home"] } },
        { path: '/login',             name: 'Login',           component: () => import("./views/Login.vue"),           meta: { title: () => Lang.CurrentLang["PAGE_Login"] } },
        { path: '/register',          name: 'Register',        component: () => import("./views/Register.vue"),        meta: { title: () => Lang.CurrentLang["PAGE_Register"] } },
        { path: '/statistics',        name: 'Statistics',      component: () => import("./views/Statistics.vue"),      meta: { title: () => Lang.CurrentLang["PAGE_Statistics"] } },
        { path: '/easyconnect',       name: 'Easyconnect',     component: () => import("./views/Easyconnect.vue"),     meta: { title: () => Lang.CurrentLang["PAGE_Easyconnect"] } },
        { path: '/profile',           name: 'Profile',         component: () => import("./views/Profile.vue"),         meta: { title: () => Lang.CurrentLang["PAGE_Profile"] } },
        { path: '/admin',             name: 'Admin',           component: () => import("./views/Admin.vue"),           meta: { title: () => Lang.CurrentLang["PAGE_Admin"] } },
        { path: '/activities',        name: 'Activities',      component: () => import("./views/Activities.vue"),      meta: { title: () => Lang.CurrentLang["PAGE_Activities"] } },
        { path: '/activities/create', name: 'CreateActivity',  component: () => import("./views/CreateActivity.vue"),  meta: { title: () => Lang.CurrentLang["PAGE_CreateActivity"] } },
        { path: '/activities/edit',   name: 'EditActivity',    component: () => import("./views/CreateActivity.vue"),  meta: { title: () => Lang.CurrentLang["PAGE_EditActivity"].replace("{value}", currentRessource) } },
        { path: '/activities/view',   name: 'ViewActivity',    component: () => import("./views/CreateActivity.vue"),  meta: { title: () => Lang.CurrentLang["PAGE_ViewActivity"].replace("{value}", currentRessource) } },
        { path: '/artifacts',         name: 'Artifacts',       component: () => import("./views/Artifacts.vue"),       meta: { title: () => Lang.CurrentLang["PAGE_Artifacts"] } },
        { path: '/artifacts/create',  name: 'CreateArtifact',  component: () => import("./views/CreateArtifact.vue"),  meta: { title: () => Lang.CurrentLang["PAGE_CreateArtifact"] } },
        { path: '/artifacts/edit',    name: 'EditArtifact',    component: () => import("./views/CreateArtifact.vue"),  meta: { title: () => Lang.CurrentLang["PAGE_EditArtifact"].replace("{value}", currentRessource) } },
        { path: '/artifacts/view',    name: 'ViewArtifact',    component: () => import("./views/CreateArtifact.vue"),  meta: { title: () => Lang.CurrentLang["PAGE_ViewArtifact"].replace("{value}", currentRessource) } },
        { path: '/workplaces',        name: 'Workplaces',      component: () => import("./views/Workplaces.vue"),      meta: { title: () => Lang.CurrentLang["PAGE_Workplaces"] } },
        { path: '/workplaces/create', name: 'CreateWorkplace', component: () => import("./views/CreateWorkplace.vue"), meta: { title: () => Lang.CurrentLang["PAGE_CreateWorkplace"] } },
        { path: '/workplaces/edit',   name: 'EditWorkplace',   component: () => import("./views/CreateWorkplace.vue"), meta: { title: () => Lang.CurrentLang["PAGE_EditWorkplace"].replace("{value}", currentRessource) } },
        { path: '/workplaces/view',   name: 'ViewWorkplace',   component: () => import("./views/CreateWorkplace.vue"), meta: { title: () => Lang.CurrentLang["PAGE_ViewWorkplace"].replace("{value}", currentRessource) } },
        { path: '/reset',             name: 'Reset',           component: () => import("./views/Reset.vue"),           meta: { title: () => Lang.CurrentLang["PAGE_Reset"] } },
        { path: '/invite',            name: 'Invite',          component: () => import("./views/Reset.vue"),           meta: { title: () => Lang.CurrentLang["PAGE_Invite"] } },
        { path: '/forgotPassword',    name: 'ForgotPassword',  component: () => import("./views/ForgotPassword.vue"),  meta: { title: () => Lang.CurrentLang["PAGE_ForgotPassword"] } },
        { path: '/generateInvite',    name: 'GenerateInvite',  component: () => import("./views/GenerateInvite.vue"),  meta: { title: () => Lang.CurrentLang["PAGE_GenerateInvite"] } },
        { path: '/about',             name: 'About',           component: () => import("./views/About.vue"),           meta: { title: () => Lang.CurrentLang["PAGE_About"] } },
        { path: '/translations',      name: 'Translations',    component: () => import("./views/Translations.vue"),    meta: { title: () => Lang.CurrentLang["PAGE_Translations"] }  }
    ]
});

createApp(App).use(router).mount('#app')