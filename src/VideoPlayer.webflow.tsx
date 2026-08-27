import { VideoPlayer } from './VideoPlayer';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(VideoPlayer, {
  name: 'Video Player',
  description: 'A video player with standard, autoplay-muted, and autoplay-with-unmute playback modes',
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
      tooltip: 'Fallback poster image shown before the video loads and for reduced motion',
    }),
    aspectRatio: props.Variant({
      name: 'Aspect Ratio',
      options: ['Auto', '16:9', '4:3', '21:9', '1:1', '9:16'],
      defaultValue: 'Auto',
      tooltip: 'Container aspect ratio. Auto uses the video\'s natural aspect ratio.',
    }),
    playbackMode: props.Variant({
      name: 'Playback Mode',
      options: ['Standard', 'Autoplay Muted', 'Autoplay Muted with Unmute'],
      defaultValue: 'Standard',
      tooltip:
        'Standard: starts paused and unmuted, click the play button to start. Autoplay Muted: plays silently on load. Autoplay Muted with Unmute: plays silently on load with a speaker button — the first click restarts the video with sound, later clicks just mute/unmute.',
    }),
    loopVideo: props.Boolean({
      name: 'Loop',
      defaultValue: true,
      trueLabel: 'Loop',
      falseLabel: 'Play Once',
      tooltip: 'Repeat the video when it reaches the end',
    }),
    playIconColor: props.Text({
      name: 'Play Icon Color',
      group: 'Colors',
      tooltip: 'Any CSS color for the centred play button, e.g. #ffffff. Leave blank to use --cc-video-player-play-color.',
    }),
    audioIconColor: props.Text({
      name: 'Audio Icon Color',
      group: 'Colors',
      tooltip: 'Any CSS color for the speaker icon, e.g. #ffffff. Leave blank to use --cc-video-player-audio-color.',
    }),
    audioButtonColor: props.Text({
      name: 'Audio Button Color',
      group: 'Colors',
      tooltip: 'Any CSS color for the circle behind the speaker icon, e.g. rgba(0, 0, 0, 0.5). Leave blank to use --cc-video-player-audio-bg.',
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
