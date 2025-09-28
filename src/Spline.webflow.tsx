import { Spline } from './Spline';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(Spline, {
    name: 'Spline',
    description: 'Interactive 3D Spline scene viewer',
    group: 'Media',
    props: {
        splineUrl: props.Link({
            name: "Spline URL",
            description: "URL to your Spline scene",
            defaultValue: "",
            placeholder: "https://prod.spline.design/your-scene-url/scene.splinecode",
        }),
        width: props.Text({
            name: "Width",
            description: "Width of the Spline container",
            defaultValue: "100%",
        }),
        height: props.Text({
            name: "Height",
            description: "Height of the Spline container",
            defaultValue: "500px",
        }),
        responsive: props.Boolean({
            name: "Responsive",
            description: "Enable responsive behavior",
            defaultValue: true,
        }),
        allowFullscreen: props.Boolean({
            name: "Allow Fullscreen",
            description: "Allow fullscreen mode for the Spline scene",
            defaultValue: true,
        }),
        lazy: props.Boolean({
            name: "Lazy Load",
            description: "Load the scene only when needed",
            defaultValue: false,
        }),
    },
});