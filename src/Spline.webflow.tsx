import { Spline } from './SplineSimple';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

console.log('Spline.webflow.tsx: Declaring Spline component for Webflow');

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
        lazy: props.Boolean({
            name: "Lazy Load",
            description: "Load the scene only when needed",
            defaultValue: false,
        }),
    },
});