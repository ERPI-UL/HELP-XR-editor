import Blockly from 'blockly';
import { luaGenerator } from 'blockly/lua';
import { blocks as customBlocks } from './BlocklyBlocks';
import defaultToolbox from "./toolbox.json";
import * as Fr from 'blockly/msg/fr';
import * as En from 'blockly/msg/en';
import * as De from 'blockly/msg/de';
import * as Es from 'blockly/msg/es';
import * as It from 'blockly/msg/it';
import Lang from '../Lang';

let workspace = null;
let toolbox = {
    kind: "categoryToolbox",
    contents: defaultToolbox.map(categ => ({
        ...categ,
        name: categ.name,
    }))
};

window.blocks = Blockly.Blocks;

let isSetup = false;
export function setupBlockly(area, div) {
    if (isSetup) {
        window.onresize?.();
        return;
    }
    isSetup = true;

    for (const comp of [/*'BUTTON', */'SWITCH', 'CRANK', /*'SOCKET', */'SLIDER', 'HINGE', 'COLOR', 'SOUND']) {
        toolbox.contents.push({
            kind: "category",
            id: comp,
            name: "",
            contents: []
        });
    }
    toolbox.contents.forEach(categ => categ.name = Lang.CurrentLang["BLOCKLY_" + categ.id]);

    importCustomBlocks();
    setToolboxTags();

    const langs = { fr: Fr, en: En, de: De, es: Es, it: It };
    const lang = langs[Lang];
    if (lang) Blockly.setLocale(lang);

    workspace = Blockly.inject(div, {
        toolbox: toolbox,
        renderer: 'zelos', // (disabled because of the color picker bug)
        grid: {
            spacing: 20,
            length: 2,
            colour: '#ccc',
            snap: true
        },
        move: {
            scrollbars: true,
            drag: true,
            wheel: false
        },
        zoom: {
            controls: false,
            wheel: true,
            startScale: 0.8,
            pinch: false
        },
        trashcan: false,
        sounds: false
    });

    // make scrollbars a little smaller
    // should not do this but it works
    div.querySelectorAll(".blocklyScrollbarHandle").forEach((e) => {
        const width = Number(e.getAttribute("width"));
        const height = Number(e.getAttribute("height"));
        if (width < height) e.setAttribute("height", "10");
        else e.setAttribute("width", "10");
        e.setAttribute("rx", "5");
        e.setAttribute("ry", "5");
    });
    // shound not do that either, but the scrollbar is still floating
    // when the toolbox is hidden, so we hide it forever !
    div.querySelectorAll(".blocklyFlyoutScrollbar").forEach(e => {
        e.style.display = "none";
    });

    const onresize = function (e, delay) {
        setTimeout(() => {
            const rect = area.getBoundingClientRect();
            div.style.left = rect.left + 'px';
            div.style.top = rect.top + 'px';
            div.style.width = rect.width + 'px';
            div.style.height = rect.height + 'px';
            Blockly.svgResize(workspace);
        }, delay ? 100 : 0);
    };
    window.addEventListener('resize', (ev) => onresize(ev, true), false);
    const oldResize = window.onresize;
    window.onresize = (ev) => { oldResize(ev); onresize(ev, false); };
    onresize(null, true);
}

export function updateBlockly() {
    setWorkspaceAnchors();
    setToolboxTags();
}

export function resetBlockly() {
    isSetup = false;
}

function importCustomBlocks() {
    customBlocks.forEach(block => {
        if (Blockly.Blocks[block.type]) {
            console.error("Le bloc "+block.type+" existe déjà");
            return;
        }

        Blockly.defineBlocksWithJsonArray([block.block]);
        luaGenerator[block.block.type] = block.lua;

        const categIndex = toolbox.contents.findIndex(categ => categ.id === block.category);
        if (categIndex < 0) {
            console.error("Impossible de trouver la catégorie "+block.category+" dans la toolbox")
            return;
        }
        const categ = toolbox.contents[categIndex];
        categ.contents.push({
            kind: "block",
            type: block.block.type
        });
    });
}

function getPropsTags(root=window.props) {
    const tags = [];
    if (root.components)
        root.components.forEach(component => {
            tags.push({
                tag: component.tag,
                type: component.type,
            });
        });
    if (root.children)
        root.children.forEach(child => {
            tags.push(...getPropsTags(child));
        });
    return tags;
}

function createComponentBlock(tag, type) {
    return {
        block: {
            init: function () {
                this.appendDummyInput().appendField(tag);
                this.setOutput(true, type);
                this.setColour(255);
                this.setTooltip("");
                this.setHelpUrl("");
            }
        },
        lua(block) {
            return [
                tag,
                luaGenerator.ORDER_NONE
            ]
        }
    }
}

function removeToolboxTags() {
    const compCategIndex = toolbox.contents.findIndex(categ => categ.id === 'COMPONENTS');
    if (compCategIndex < 0) {
        console.error("Impossible de trouver la catégorie 'Composants' dans la toolbox")
        return;
    }
    const compCateg = toolbox.contents[compCategIndex];
    compCateg.contents = [];
}

function addToolboxTags() {
    const tags = getPropsTags();
    const compCategIndex = toolbox.contents.findIndex(categ => categ.id === 'COMPONENTS');
    if (compCategIndex < 0) {
        console.error("Impossible de trouver la catégorie 'Composants' dans la toolbox")
        return;
    }
    const compCateg = toolbox.contents[compCategIndex];
    tags.forEach(tag => {
        const cb = createComponentBlock(tag.tag, tag.type.name);
        Blockly.Blocks['component_'+tag.tag] = cb.block;
        luaGenerator['component_'+tag.tag] = cb.lua;
        compCateg.contents.push({
            "kind": "block",
            "type": "component_"+tag.tag
        });
    });
}

export function setToolboxTags() {
    removeToolboxTags();
    addToolboxTags();
    if (workspace) {
        workspace.updateToolbox(toolbox);
        if (window.location.pathname.split("/").pop() === 'view')
            workspace.getToolbox().setVisible(false);
        else workspace.getToolbox().setVisible(true);
    }
}

function createEndpointBlock(comp, ev) {
    const component = JSON.parse(JSON.stringify(comp));
    const event = JSON.parse(JSON.stringify(ev));
    return {
        block: {
            init: function () {
                this.appendDummyInput()
                    .appendField(Lang.CurrentLang["COMP_" + component.type.display + "_EVENT_" + event.display]);
                this.appendStatementInput("insts").setCheck(null);
                this.setColour(60);
                this.setTooltip("");
                this.setHelpUrl("");
                this.setMovable(true);
            }
        },
        lua(block) {
            const statements_insts = luaGenerator.statementToCode(block, 'insts');
            return "_G[\"" + lastSelectedComp.tag + "\"].events." + event.name + " = function ()\n" +
                   "    " + statements_insts +
                   "end";
        }
    }
}

export function setWorkspaceAnchors() {
    if (!workspace || !selectedComp) return;

    const workspaceBlocks = getBlocklyCode();
    const componentEndpoints = selectedComp.type.events.map(ev => ({name: ev.name, type: "endpoint_" + ev.name})); 

    // check if all the endpoint blocks exists in Blockly, if not, create them
    componentEndpoints.forEach(endpoint => {
        if (Blockly.Blocks[endpoint.type] === undefined) {
            const block = createEndpointBlock(selectedComp, selectedComp.type.events.find(ev => ev.name === endpoint.name));
            Blockly.Blocks[endpoint.type] = block.block;
            luaGenerator[endpoint.type] = block.lua;
        }
    });
    workspace.updateToolbox(toolbox);

    if (Object.keys(workspaceBlocks).length === 0 || workspaceBlocks.blocks.blocks.length === 0) {
        loadBlocklyCode({
            blocks: {
                blocks: componentEndpoints.map((endpoint, index) => ({
                    type: endpoint.type,
                    deletable: false,
                    x: index * 300,
                    y: 0
                })),
                languageVersion: 0
            }
        }, false);
        return;
    } else {
        const currentBlocks = workspaceBlocks.blocks.blocks;
        const addedBlocks = componentEndpoints.filter(endpoint => !currentBlocks.find(block => block.type === endpoint.type));
        const removedBlocks = currentBlocks.filter(block => !componentEndpoints.find(endpoint => endpoint.type === block.type));

        const newWorkplaceBlocks = [];
        currentBlocks.forEach(block => {
            if (removedBlocks.find(removedBlock => removedBlock.type === block.type)) return;
            newWorkplaceBlocks.push(block);
        });
        addedBlocks.forEach((block, index) => {
            newWorkplaceBlocks.push({
                type: block.type,
                deletable: false,
                x: (index + currentBlocks.length) * 300,
                y: 0
            });
        });
        loadBlocklyCode({blocks: {blocks: newWorkplaceBlocks, languageVersion: 0}});
    }
}

export function loadBlocklyCode(code, spawnAnchors=true) {
    console.log("Loading blockly code", code);
    if (code && code.blocks && code.blocks.blocks && code.blocks.blocks.length > 0) {
        try {
            Blockly.serialization.workspaces.load(code, workspace);
        } catch (err) {
            // console.error("Error while loading blockly code", err);
        }
    } else {
        workspace.clear();
        if (spawnAnchors) setWorkspaceAnchors();
    }
}

export function getBlocklyCode() {
    return Blockly.serialization.workspaces.save(workspace);
}

export function getLuaCode() {
    return luaGenerator.workspaceToCode(workspace);
}