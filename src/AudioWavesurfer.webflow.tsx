import { AudioWavesurfer } from './AudioWavesurfer';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(AudioWavesurfer, {
    name: 'Audio (Wavesurfer)',
    description: 'A wavesurfer audio player',
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
            falseLabel: 'Play once',
            tooltip: "'true' if you want looping, blank otherwise"
//            defaultValue: "Hello World",
        }), 
        preload: props.Boolean({
            name: "Preload",
            defaultValue: true, 
            trueLabel: 'Auto',
            falseLabel: 'Off',
            tooltip: "'true' if you want looping, blank otherwise" 
        }), 

        // Advanced 

        id: props.Id({
            name: "ID",
//            defaultValue: "Hello World", 
            tooltip: "ID used only for external scripting.", 
            group: "Advanced" 
        }),
        namespace: props.Id({
            name: "ID Namespace",
//            defaultValue: "Hello World", 
            tooltip: "Optional namespace to differentiate CMS-slub-bound IDs.", 
            group: "Advanced" 
        }),

        debug: props.Boolean({
            name: "Debug",
            defaultValue: false, 
            trueLabel: 'Debug On',
            falseLabel: 'Debug Off',
            group: "Advanced",  
            tooltip: "Enable to generate console log messages." 
        }), 

    }
});

