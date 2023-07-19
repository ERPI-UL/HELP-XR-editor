import Blockly from 'blockly';
import { luaGenerator } from 'blockly/lua';
import Lang from '../../Lang';
import TYPE from './Types';

export default [
    /// SLIDERS ///
    // SET DISPLACEMENT
    {
        category: "SLIDER",
        block: {
            type: 'function_slider_setPos',
            message0: Lang.CurrentLang.SET_SLIDER_POS,
            args0: [
                {
                    type: "input_value",
                    name: "slider",
                    check: TYPE.SLIDER
                },
                {
                    type: "field_number",
                    name: "pos",
                    value: 0
                }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: 15,
            tooltip: "",
            helpUrl: ""
        },
        lua: function (block) {
            var slider = luaGenerator.valueToCode(block, 'slider', luaGenerator.ORDER_NONE);
            var pos = block.getFieldValue('pos');
            return `_G["${slider}"].interactable.SetPos(${pos})\n`;
        }
    },
    // MOVE FORWARD / BACKWARD
    {
        category: "SLIDER",
        block: {
            type: 'function_slider_move',
            message0: Lang.CurrentLang.MOVE_SLIDER,
            args0: [
                {
                    type: "input_value",
                    name: "slider",
                    check: TYPE.SLIDER
                },
                {
                    type: "field_dropdown",
                    name: "prop",
                    options: [
                        [Lang.CurrentLang.PROP_FORWARD, "false"],
                        [Lang.CurrentLang.PROP_BACKWARD, "true"]
                    ]
                }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: 15,
            tooltip: "",
            helpUrl: ""
        },
        lua: function (block) {
            var slider = luaGenerator.valueToCode(block, 'slider', luaGenerator.ORDER_NONE);
            var prop = block.getFieldValue('prop');
            return `_G["${slider}"].interactable.StartMovement(${prop})\n`;
        }
    },
    // STOP MOVEMENT
    {
        category: "SLIDER",
        block: {
            type: 'function_slider_stop',
            message0: Lang.CurrentLang.STOP_SLIDER,
            args0: [
                {
                    type: "input_value",
                    name: "slider",
                    check: TYPE.SLIDER
                }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: 15,
            tooltip: "",
            helpUrl: ""
        },
        lua: function (block) {
            var slider = luaGenerator.valueToCode(block, 'slider', luaGenerator.ORDER_NONE);
            return `_G["${slider}"].interactable.Stop()\n`;
        }
    },
    // SET STOP
    {
        category: "SLIDER",
        block: {
            type: 'function_slider_setMaxPos',
            message0: Lang.CurrentLang.SET_SLIDER_STOP,
            args0: [
                {
                    type: "input_value",
                    name: "slider",
                    check: TYPE.SLIDER
                },
                {
                    type: "field_number",
                    name: "pos",
                    value: 0
                }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: 15,
            tooltip: "",
            helpUrl: ""
        },
        lua: function (block) {
            var slider = luaGenerator.valueToCode(block, 'slider', luaGenerator.ORDER_NONE);
            var pos = block.getFieldValue('pos');
            return `_G["${slider}"].interactable.SetStop(${pos})\n`;
        }
    },
    // SET SPEED
    {
        category: "SLIDER",
        block: {
            type: 'function_slider_setSpeed',
            message0: Lang.CurrentLang.SET_SLIDER_SPEED,
            args0: [
                {
                    type: "input_value",
                    name: "slider",
                    check: TYPE.SLIDER
                },
                {
                    type: "field_number",
                    name: "speed",
                    value: 0
                }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: 15,
            tooltip: "",
            helpUrl: ""
        },
        lua: function (block) {
            var slider = luaGenerator.valueToCode(block, 'slider', luaGenerator.ORDER_NONE);
            var speed = block.getFieldValue('speed');
            return `_G["${slider}"].interactable.SetSpeed(${speed})\n`;
        }
    },
    // GET PROP
    {
        category: "SLIDER",
        block: {
            type: 'getter_slider_getProp',
            message0: Lang.CurrentLang.GET_SLIDER_PROP,
            args0: [
                {
                    type: "input_value",
                    name: "slider",
                    check: TYPE.SLIDER
                },
                {
                    type: "field_dropdown",
                    name: "prop",
                    options: [
                        [Lang.CurrentLang.PROP_POSITION, "Pos"],
                        [Lang.CurrentLang.PROP_STOP, "Stop"],
                        [Lang.CurrentLang.PROP_SPEED, "Speed"]
                    ]
                }
            ],
            output: TYPE.NUMBER,
            colour: 15,
            tooltip: "",
            helpUrl: ""
        },
        lua: function (block) {
            var slider = luaGenerator.valueToCode(block, 'slider', luaGenerator.ORDER_NONE);
            var prop = block.getFieldValue('prop');
            return [`_G["${slider}"].interactable.Get${prop}()`, luaGenerator.ORDER_NONE];
        }
    }
];