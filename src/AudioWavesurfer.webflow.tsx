import { AudioWavesurfer } from './AudioWavesurfer';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(AudioWavesurfer, {
    name: 'Audio (Waveform)',
    description: 'An audio player that displays the waveform.',
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

        designerMode: props.Boolean({
            name: "Designer Mode",
            defaultValue: false,
            trueLabel: 'On',
            falseLabel: 'Off',
            group: "Advanced",
            tooltip: "Shows a button to copy waveform data in Webflow Designer only."
        }),

        waveformData: props.Text({
            name: "Waveform Data",
            defaultValue: "",
            tooltip: "Pre-encoded waveform data for instant rendering. Generate using Debug mode.",
            group: "Advanced"
        }),

        label: props.Text({
            name: "Label",
            defaultValue: "",
            tooltip: "Optional label for identifying this audio in debug output.",
            group: "Advanced"
        }),

    }
});

