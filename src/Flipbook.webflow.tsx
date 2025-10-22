import { declareComponent } from '@webflow/react';
import { Flipbook } from './Flipbook';
import { props } from '@webflow/data-types';
import React from 'react';

// Wrapper component to convert Link and boolean props for the main component
const FlipbookWrapper: React.FC<{
  jsonUrl: { href: string };
  direction?: boolean;
  className?: string;
  style?: React.CSSProperties;
}> = ({ jsonUrl, direction = true, className, style }) => {
  return (
    <Flipbook
      jsonUrl={jsonUrl.href}
      rotationDirection={direction ? 'clockwise' : 'counterclockwise'}
      className={className}
      style={style}
    />
  );
};

export default declareComponent(FlipbookWrapper, {
  name: 'Flipbook',
  description: 'Display high-resolution 360A� rotatable product images with mouse/touch drag interaction',
  group: 'Media',
  props: {
    jsonUrl: props.Link({
      name: 'JSON File',
      tooltip: 'URL to JSON file containing array of image URLs for 360A� rotation sequence (0A� to 360A�)'
    }),
    direction: props.Boolean({
      name: 'Direction',
      tooltip: 'Forward or reverse image sequence direction when dragging',
      defaultValue: true,
      trueLabel: 'Forward',
      falseLabel: 'Reverse'
    })
  }
});
