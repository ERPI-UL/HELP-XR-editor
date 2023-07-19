import sliderBlocks from './blocks/Slider';
import crankBlocks from './blocks/Crank';
import hingeBlocks from './blocks/Hinge';
import switchBlocks from './blocks/Switch';
import colorBlocks from './blocks/Color';
import soundBlocks from './blocks/Sound';

export let blocks = []
    .concat(sliderBlocks)
    .concat(crankBlocks)
    .concat(hingeBlocks)
    .concat(switchBlocks)
    .concat(colorBlocks)
    .concat(soundBlocks);