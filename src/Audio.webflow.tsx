import { Audio } from './Audio';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(Audio, {
    name: 'Audio',
    description: 'A basic HTML5 audio player',
    group: 'Media',
    props: {
        mp3: props.Link({
            name: "MP3", 
            tooltip: "Choose an mp3 file from assets, or link to an MP3 file hosted externally."
        }), 
        loop: props.Boolean({
            name: "Loop",
            defaultValue: false, 
            trueLabel: 'Loop',
            falseLabel: 'Play once'
        }), 
        preload: props.Boolean({
            name: "Preload",
            defaultValue: true, 
            trueLabel: 'Auto',
            falseLabel: 'Off',
            tooltip: "If Auto, the browser may preload the whole file if it thinks it’s appropriate." 
        }), 
        controls: props.Boolean({
            name: "Controls",
            defaultValue: true, 
            trueLabel: 'Show Controls',
            falseLabel: 'Hide Controls' 
        }), 
        id: props.Id({
            name: "ID",
            tooltip: "ID used only for external scripting.", 
            group: "Advanced" 
        }), 
    }
});
