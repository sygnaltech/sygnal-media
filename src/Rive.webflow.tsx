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
            name: "Rive File",
            tooltip: "Link to a file in assets, or specify a URL to your Rive animation file (.riv)",
        }),
        artboard: props.Text({
            name: "Artboard",
            tooltip: "Name of the artboard to display (optional)",
            defaultValue: "",
            group: "Animation"
        }),
        stateMachine: props.Text({
            name: "State Machine",
            tooltip: "Name of the state machine to use (optional)",
            defaultValue: "",
            group: "Animation"
        }),
        fit: props.Variant({
            name: "Fit",
            tooltip: "How the animation should fit within its container",
            options: ["Contain", "Cover", "Fill", "Fit Width", "Fit Height", "None", "Scale Down"],
            defaultValue: "Contain",
            group: "Layout",
        }),
        // Align
        // Center, Top center, Top right, Center left, Center right, Bottom left, Bottom center, Bottom right 
        width: props.Text({
            name: "Width",
            tooltip: "Width of the Rive container",
            defaultValue: "100%",
            group: "Layout",
        }),
        height: props.Text({
            name: "Height",
            tooltip: "Height of the Rive container",
            defaultValue: "500px",
            group: "Layout",
        }),
        responsive: props.Boolean({
            name: "Responsive",
            tooltip: "Enable responsive behavior",
            defaultValue: true,
            group: "Layout"
        }),

        autoplay: props.Boolean({
            name: "Autoplay",
            tooltip: "Start animation automatically",
            defaultValue: true,
            group: "Behavior"
        }),
        touchScrollBehavior: props.Boolean({
            name: "Touch Scroll Behavior",
            tooltip: "Enable scrolling on touch devices when interacting with the canvas. Disable to prevent scroll behavior during touch/drag actions.",
            defaultValue: true,
            group: "Behavior",
        }),
        automaticallyHandleEvents: props.Boolean({
            name: "Automatically Handle Events",
            tooltip: "Automatically handle Rive events during runtime, like opening a URL when triggered by the animation.",
            defaultValue: false,
            group: "Behavior",
        }),
        lazy: props.Boolean({
            name: "Lazy Load",
            tooltip: "Load the animation only when needed",
            defaultValue: false,
            group: "Advanced"
        }),
    },
});