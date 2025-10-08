import { BackgroundVideo } from './BackgroundVideo';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(BackgroundVideo, {
  name: 'Background Video',
  description: 'A background video component with optional controls and fallback poster image',
  group: 'Media',
  props: {
    videoUrlMp4: props.Text({
      name: 'Video URL (MP4)',
      tooltip: 'URL to the MP4 video file',
    }),
    videoUrlWebm: props.Text({
      name: 'Video URL (WEBM)',
      tooltip: 'URL to the WEBM video file (optional, for better browser support)',
    }),
    posterImage: props.Image({
      name: 'Poster Image',
      tooltip: 'Fallback poster image shown before video loads and for reduced motion',
    }),
    aspectRatio: props.Variant({
      name: 'Aspect Ratio',
      options: ['Auto', '16:9', '4:3', '21:9', '1:1', '9:16'],
      defaultValue: 'Auto',
      tooltip: 'Container aspect ratio. Auto uses the video\'s natural aspect ratio.',
    }),
    showControls: props.Boolean({
      name: 'Show Controls',
      defaultValue: false,
      trueLabel: 'Show',
      falseLabel: 'Hide',
      tooltip: 'Show play/pause control button',
    }),
    debug: props.Boolean({
      name: 'Debug',
      defaultValue: false,
      trueLabel: 'Debug On',
      falseLabel: 'Debug Off',
      group: 'Advanced',
      tooltip: 'Enable to generate console log messages',
    }),
  },
});
