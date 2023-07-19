import Blockly from 'blockly';
import { luaGenerator } from 'blockly/lua';
import Lang from '../../Lang';
import TYPE from './Types';

export default [
    /// HINGES ///
    // SET ANGLE
    {
        category: "HINGE",
        block: {
            type: 'function_hinge_setAngle',
            message0: Lang.CurrentLang.SET_HINGE_ANGLE,
            args0: [
                {
                    type: "input_value",
                    name: "crank",
                    check: TYPE.HINGE
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
            var el = luaGenerator.valueToCode(block, 'el', luaGenerator.ORDER_NONE);
            var angle = block.getFieldValue('angle');
            return `_G["${el}"].interactable.SetAngle(${angle})\n`; // degrees used, maybe use radians?
        }
    },
    // SET MAX ANGLE
    {
        category: "HINGE",
        block: {
            type: 'function_hinge_setMaxAngle',
            message0: Lang.CurrentLang.SET_HINGE_MAX_ANGLE,
            args0: [
                {
                    type: "input_value",
                    name: "crank",
                    check: TYPE.HINGE
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
            var el = luaGenerator.valueToCode(block, 'el', luaGenerator.ORDER_NONE);
            var angle = block.getFieldValue('angle');
            return `_G["${el}"].interactable.SetMaxAngle(${angle})\n`; // degrees used, maybe use radians?
        }
    },
    // SET MIN ANGLE
    {
        category: "HINGE",
        block: {
            type: 'function_hinge_setMinAngle',
            message0: Lang.CurrentLang.SET_HINGE_MIN_ANGLE,
            args0: [
                {
                    type: "input_value",
                    name: "crank",
                    check: TYPE.HINGE
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
            var el = luaGenerator.valueToCode(block, 'el', luaGenerator.ORDER_NONE);
            var angle = block.getFieldValue('angle');
            return `_G["${el}"].interactable.SetMinAngle(${angle})\n`; // degrees used, maybe use radians?
        }
    },
    // GET PROP
    {
        category: "HINGE",
        block: {
            type: 'getter_hinge_getProp',
            message0: Lang.CurrentLang.GET_HINGE_PROP,
            args0: [
                {
                    type: "input_value",
                    name: "crank",
                    check: TYPE.HINGE
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
            var el = luaGenerator.valueToCode(block, 'el', luaGenerator.ORDER_NONE);
            var prop = block.getFieldValue('prop');
            return [`_G["${el}"].interactable.Get${prop}()`, luaGenerator.ORDER_NONE];
        }
    }
];