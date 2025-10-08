import { BackgroundVideo } from './BackgroundVideo';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(BackgroundVideo, {
  name: 'Background Video',
  description: 'A background video component with optional controls and fallback poster image',
  group: 'Media',
  props: {
    videoUrlMp4: props.Link({
      name: 'Video URL (MP4)',
      tooltip: 'URL to the MP4 video file',
    }),
    videoUrlWebm: props.Link({
      name: 'Video URL (WEBM)',
      tooltip: 'URL to the WEBM video file (optional, for better browser support)',
    }),
    posterImage: props.Image({
      name: 'Poster Image',
      tooltip: 'Fallback poster image shown before video loads and for reduced motion',
    }),
    showControls: props.Boolean({
      name: 'Show Controls',
      defaultValue: false,
      trueLabel: 'Show',
      falseLabel: 'Hide',
      tooltip: 'Show play/pause control button',
    }),
  },
});
