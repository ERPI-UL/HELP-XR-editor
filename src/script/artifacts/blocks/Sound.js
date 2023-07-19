import Blockly from 'blockly';
import { luaGenerator } from 'blockly/lua';
import Lang from '../../Lang';
import TYPE from './Types';

export default [
    /// SOUNDS ///
    // SET SOUND ID
    {
        category: "SOUND",
        block: {
            type: 'function_sound_setSoundId',
            message0: Lang.CurrentLang.SET_SOUND_ID,
            args0: [
                {
                    type: "input_value",
                    name: "el",
                    check: TYPE.SOUND
                },
                {
                    type: "field_number",
                    name: "id",
                    check: TYPE.NUMBER
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
            var id = luaGenerator.valueToCode(block, 'id', luaGenerator.ORDER_NONE);
            return `_G["${el}"].interactable.SetSoundId(${id})\n`;
        }
    },
    // SET SOUND PLAY
    {
        category: "SOUND",
        block: {
            type: 'function_sound_setPlay',
            message0: Lang.CurrentLang.SET_SOUND_PLAY,
            args0: [
                {
                    type: "input_value",
                    name: "el",
                    check: TYPE.SOUND
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
            return `_G["${el}"].interactable.SetPlaying(true)\n`;
        }
    },
    // SET SOUND STOP
    {
        category: "SOUND",
        block: {
            type: 'function_sound_setStop',
            message0: Lang.CurrentLang.SET_SOUND_STOP,
            args0: [
                {
                    type: "input_value",
                    name: "el",
                    check: TYPE.SOUND
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
            return `_G["${el}"].interactable.SetPlaying(false)\n`;
        }
    },
    // GET PLAYING
    {
        category: "SOUND",
        block: {
            type: 'getter_sound_getPlaying',
            message0: Lang.CurrentLang.GET_SOUND_PLAYING,
            args0: [
                {
                    type: "input_value",
                    name: "el",
                    check: TYPE.SOUND
                }
            ],
            output: TYPE.BOOLEAN,
            colour: 15,
            tooltip: "",
            helpUrl: ""
        },
        lua: function (block) {
            var el = luaGenerator.valueToCode(block, 'el', luaGenerator.ORDER_NONE);
            return [`_G["${el}"].interactable.GetPlaying()`, luaGenerator.ORDER_NONE];
        }
    },
    // GET LOOPING
    {
        category: "SOUND",
        block: {
            type: 'getter_sound_getLooping',
            message0: Lang.CurrentLang.GET_SOUND_LOOPING,
            args0: [
                {
                    type: "input_value",
                    name: "el",
                    check: TYPE.SOUND
                }
            ],
            output: TYPE.BOOLEAN,
            colour: 15,
            tooltip: "",
            helpUrl: ""
        },
        lua: function (block) {
            var el = luaGenerator.valueToCode(block, 'el', luaGenerator.ORDER_NONE);
            return [`_G["${el}"].interactable.GetLooping()`, luaGenerator.ORDER_NONE];
        }
    }
];