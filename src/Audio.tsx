
import React from "react";

interface AudioProps {
//  text: string; 
//  variant: 'Light' | 'Dark';
   id: string; 
   mp3: any; 
   loop: boolean;
   preload: boolean; 
   controls: boolean; 
}

export const Audio = ({ id, loop, mp3, preload, controls }: AudioProps) => (
  <div>
  <audio
//    controls 
    {...(controls ? { controls } : {})}
    {...(loop ? { loop: true } : {})}
    src={mp3.href}
//    xsrc="test" 
//    autoplay="" 
    preload={preload ? "auto": "none"} // "auto"
    {...(id ? { id } : {})}
//    class="webflow-core-components--cc-audio-player"
  ></audio>
  </div>
  );


