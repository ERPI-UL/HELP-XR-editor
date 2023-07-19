import Blockly from 'blockly';
import { luaGenerator } from 'blockly/lua';
import Lang from '../../Lang';
import TYPE from './Types';

export default [
    /// SWITCHES ///
    // SET STOP
    {
        category: "SWITCH",
        block: {
            type: 'function_switch_setStop',
            message0: Lang.CurrentLang.SET_SWITCH_STOP,
            args0: [
                {
                    type: "input_value",
                    name: "switch",
                    check: TYPE.SWITCH
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
            var el = luaGenerator.valueToCode(block, 'switch', luaGenerator.ORDER_NONE);
            var angle = block.getFieldValue('angle');
            return `_G["${el}"].interactable.SetStop(${angle})\n`;
        }
    },
    // TURN ON /OFF
    {
        category: "SWITCH",
        block: {
            type: 'function_switch_turnProp',
            message0: Lang.CurrentLang.TURN_PROP_SWITCH,
            args0: [
                {
                    type: "input_value",
                    name: "switch",
                    check: TYPE.SWITCH
                },
                {
                    type: "field_dropdown",
                    name: "prop",
                    options: [
                        [Lang.CurrentLang.PROP_ON, "true"],
                        [Lang.CurrentLang.PROP_OFF, "false"]
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
            var el = luaGenerator.valueToCode(block, 'switch', luaGenerator.ORDER_NONE);
            var prop = block.getFieldValue('prop');
            return `_G["${el}"].interactable.SetState(${prop})\n`;
        }
    },
    // GET STATE
    {
        category: "SWITCH",
        block: {
            type: 'getter_switch_getState',
            message0: Lang.CurrentLang.GET_SWITCH_STATE,
            args0: [
                {
                    type: "input_value",
                    name: "switch",
                    check: TYPE.SWITCH
                }
            ],
            output: TYPE.BOOLEAN,
            colour: 15,
            tooltip: "",
            helpUrl: ""
        },
        lua: function (block) {
            var el = luaGenerator.valueToCode(block, 'switch', luaGenerator.ORDER_NONE);
            return [`_G["${el}"].interactable.GetState()`, luaGenerator.ORDER_NONE];
        }
    }
];