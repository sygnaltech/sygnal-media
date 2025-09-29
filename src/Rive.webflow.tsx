import { Rive } from './Rive';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

console.log('Rive.webflow.tsx: Declaring Rive component for Webflow');

export default declareComponent(Rive, {
    name: 'Rive',
    description: 'Interactive Rive animation player',
    group: 'Media',
    props: {
        riveUrl: props.Link({
            name: "Rive URL",
            tooltip: "URL to your Rive animation file (.riv)",
//            defaultValue: "",
//            placeholder: "https://cdn.rive.app/animations/your-animation.riv",
        }),
        width: props.Text({
            name: "Width",
            tooltip: "Width of the Rive container",
            defaultValue: "100%",
        }),
        height: props.Text({
            name: "Height",
            tooltip: "Height of the Rive container",
            defaultValue: "500px",
        }),
        responsive: props.Boolean({
            name: "Responsive",
            tooltip: "Enable responsive behavior",
            defaultValue: true,
        }),
        autoplay: props.Boolean({
            name: "Autoplay",
            tooltip: "Start animation automatically",
            defaultValue: true,
        }),
        stateMachine: props.Text({
            name: "State Machine",
            tooltip: "Name of the state machine to use (optional)",
            defaultValue: "",
        }),
        artboard: props.Text({
            name: "Artboard",
            tooltip: "Name of the artboard to display (optional)",
            defaultValue: "",
        }),
        lazy: props.Boolean({
            name: "Lazy Load",
            tooltip: "Load the animation only when needed",
            defaultValue: false,
        }),
    },
});