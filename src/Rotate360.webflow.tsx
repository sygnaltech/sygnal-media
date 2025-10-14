import { declareComponent } from '@webflow/react';
import { Rotate360 } from './Rotate360';
import { props } from '@webflow/data-types';
import React from 'react';

// Wrapper component to convert Link and boolean props for the main component
const Rotate360Wrapper: React.FC<{
  jsonUrl: { href: string };
  rotationDirection?: boolean;
  className?: string;
  style?: React.CSSProperties;
}> = ({ jsonUrl, rotationDirection = true, className, style }) => {
  return (
    <Rotate360
      jsonUrl={jsonUrl.href}
      rotationDirection={rotationDirection ? 'clockwise' : 'counterclockwise'}
      className={className}
      style={style}
    />
  );
};

export default declareComponent(Rotate360Wrapper, {
  name: 'Rotate 360',
  description: 'Display high-resolution 360° rotatable product images with mouse/touch drag interaction',
  group: 'Media',
  props: {
    jsonUrl: props.Link({
      name: 'JSON File',
      tooltip: 'URL to JSON file containing array of image URLs for 360° rotation sequence (0° to 360°)'
    }),
    rotationDirection: props.Boolean({
      name: 'Clockwise Rotation',
      tooltip: 'Direction of rotation when dragging left to right',
      defaultValue: true,
      trueLabel: 'Clockwise',
      falseLabel: 'Counterclockwise'
    })
  }
});
