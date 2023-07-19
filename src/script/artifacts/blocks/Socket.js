import Blockly from 'blockly';
import { luaGenerator } from 'blockly/lua';
import Lang from '../../Lang';
import TYPE from './Types';

/*
NOT DONE YET, STILL FIGURING OUT HOW TO DO THIS
*/

export default [
    /// SOCKETS ///
    // SET POSITION
    {
        category: "SOCKET",
        block: {
            type: 'function_socket_setPos',
            message0: Lang.CurrentLang.SET_SOCKET_POS,
            args0: [
                {
                    type: "input_value",
                    name: "socket",
                    check: TYPE.SOCKET
                },
                {
                    type: "field_number",
                    name: "x",
                    value: 0
                },
                {
                    type: "field_number",
                    name: "y",
                    value: 0
                },
                {
                    type: "field_number",
                    name: "z",
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
            var el = luaGenerator.valueToCode(block, 'socket', luaGenerator.ORDER_NONE);
            var x = block.getFieldValue('x');
            var y = block.getFieldValue('y');
            var z = block.getFieldValue('z');
            return `_G["${el}"].interactable.SetPosition(${x}, ${y}, ${z})\n`;
        }
    },
    // GET STATE
    {
        category: "SOCKET",
        block: {
            type: 'getter_socket_getState',
            message0: Lang.CurrentLang.GET_SOCKET_STATE,
            args0: [
                {
                    type: "input_value",
                    name: "socket",
                    check: TYPE.SOCKET
                }
            ],
            output: TYPE.BOOLEAN,
            colour: 15,
            tooltip: "",
            helpUrl: ""
        },
        lua: function (block) {
            var el = luaGenerator.valueToCode(block, 'socket', luaGenerator.ORDER_NONE);
            return [`_G["${el}"].interactable.GetState()`, luaGenerator.ORDER_NONE];
        }
    }
];