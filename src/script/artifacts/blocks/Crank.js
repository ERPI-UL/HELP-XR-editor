import Blockly from 'blockly';
import { luaGenerator } from 'blockly/lua';
import Lang from '../../Lang';
import TYPE from './Types';

export default [
    /// CRANKS ///
    // SET ANGLE
    {
        category: "CRANK",
        block: {
            type: 'function_crank_setAngle',
            message0: Lang.CurrentLang.SET_CRANK_ANGLE,
            args0: [
                {
                    type: "input_value",
                    name: "crank",
                    check: TYPE.CRANK
                },
                {
                    type: "field_number",
                    name: "angle",
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
            var crank = luaGenerator.valueToCode(block, 'crank', luaGenerator.ORDER_NONE);
            var angle = block.getFieldValue('angle');
            return `_G["${crank}"].interactable.SetAngle(${angle})\n`; // degrees used, maybe use radians?
        }
    },
    // SET MAX ANGLE
    {
        category: "CRANK",
        block: {
            type: 'function_crank_setMaxAngle',
            message0: Lang.CurrentLang.SET_CRANK_MAX_ANGLE,
            args0: [
                {
                    type: "input_value",
                    name: "crank",
                    check: TYPE.CRANK
                },
                {
                    type: "field_number",
                    name: "angle",
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
            var crank = luaGenerator.valueToCode(block, 'crank', luaGenerator.ORDER_NONE);
            var angle = block.getFieldValue('angle');
            return `_G["${crank}"].interactable.SetMaxAngle(${angle})\n`; // degrees used, maybe use radians?
        }
    },
    // SET MIN ANGLE
    {
        category: "CRANK",
        block: {
            type: 'function_crank_setMinAngle',
            message0: Lang.CurrentLang.SET_CRANK_MIN_ANGLE,
            args0: [
                {
                    type: "input_value",
                    name: "crank",
                    check: TYPE.CRANK
                },
                {
                    type: "field_number",
                    name: "angle",
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
            var crank = luaGenerator.valueToCode(block, 'crank', luaGenerator.ORDER_NONE);
            var angle = block.getFieldValue('angle');
            return `_G["${crank}"].interactable.SetMinAngle(${angle})\n`; // degrees used, maybe use radians?
        }
    },
    // GET PROP
    {
        category: "CRANK",
        block: {
            type: 'getter_crank_getProp',
            message0: Lang.CurrentLang.GET_CRANK_PROP,
            args0: [
                {
                    type: "input_value",
                    name: "crank",
                    check: TYPE.CRANK
                },
                {
                    type: "field_dropdown",
                    name: "prop",
                    options: [
                        [Lang.CurrentLang.PROP_ANGLE, "Angle"]
                    ]
                }
            ],
            output: TYPE.NUMBER,
            colour: 15,
            tooltip: "",
            helpUrl: ""
        },
        lua: function (block) {
            var crank = luaGenerator.valueToCode(block, 'crank', luaGenerator.ORDER_NONE);
            var prop = block.getFieldValue('prop');
            return [`_G["${crank}"].interactable.Get${prop}()`, luaGenerator.ORDER_NONE];
        }
    }
];