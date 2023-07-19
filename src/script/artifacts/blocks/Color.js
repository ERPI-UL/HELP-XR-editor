import Blockly from 'blockly';
import { luaGenerator } from 'blockly/lua';
import Lang from '../../Lang';
import TYPE from './Types';

export default [
    /// COLORS ///
    // SET COLOR
    {
        category: "COLOR",
        block: {
            type: 'function_color_setColor',
            message0: Lang.CurrentLang.SET_COLOR,
            args0: [
                {
                    type: "input_value",
                    name: "el",
                    check: TYPE.COLOR
                },
                { type: "input_dummy" },
                {
                    type: "input_value",
                    name: "color",
                    check: TYPE.COLOUR
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
            var color = luaGenerator.valueToCode(block, 'color', luaGenerator.ORDER_NONE);
            return `_G["${el}"].interactable.SetColor(${color})\n`;
        }
    },
    // GET COLOR
    {
        category: "COLOR",
        block: {
            type: 'getter_color_getColor',
            message0: Lang.CurrentLang.GET_COLOR,
            args0: [
                {
                    type: "input_value",
                    name: "el",
                    check: TYPE.COLOR
                }
            ],
            output: TYPE.COLOUR,
            colour: 15,
            tooltip: "",
            helpUrl: ""
        },
        lua: function (block) {
            var el = luaGenerator.valueToCode(block, 'el', luaGenerator.ORDER_NONE);
            return [`_G["${el}"].interactable.GetColor()`, luaGenerator.ORDER_NONE];
        }
    }
];