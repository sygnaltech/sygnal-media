import logo from './logo.svg';
import './App.css';
import { AudioWavesurfer } from './AudioWavesurfer';
import { Spline } from './Spline';
import { RiveCanvas } from './RiveCanvas';
import { Flipbook } from './Flipbook';

declare global {
  interface Window {
    mediaPlayerManager?: {
      playPlayer: (id: string) => boolean;
      pausePlayer: (id: string) => boolean;
      pauseAll: () => void;
      getPlayerIds: () => string[];
    };
  }
}

//import { MapPin } from './MapPin'; 

// Test controls component
const MediaPlayerControls = () => {
  const playPlayer = (id: string) => {
    if (window.mediaPlayerManager) {
      const success = window.mediaPlayerManager.playPlayer(id);
      console.log(`Play ${id}:`, success ? 'Success' : 'Failed');
    }
  };

  const pausePlayer = (id: string) => {
    if (window.mediaPlayerManager) {
      const success = window.mediaPlayerManager.pausePlayer(id);
      console.log(`Pause ${id}:`, success ? 'Success' : 'Failed');
    }
  };

  const pauseAll = () => {
    if (window.mediaPlayerManager) {
      window.mediaPlayerManager.pauseAll();
      console.log('Paused all players');
    }
  };

  const getPlayerIds = () => {
    if (window.mediaPlayerManager) {
      const ids = window.mediaPlayerManager.getPlayerIds();
      console.log('Available player IDs:', ids);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ccc', 
      margin: '20px 0',
      backgroundColor: '#f5f5f5'
    }}>



      <h3>Media Player Test Controls</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <h4>Individual Player Controls:</h4>
        <button onClick={() => playPlayer('chainsmokers-player')} style={{ margin: '5px' }}>
          Play Chainsmokers
        </button>
        <button onClick={() => pausePlayer('chainsmokers-player')} style={{ margin: '5px' }}>
          Pause Chainsmokers
        </button>
        
        <button onClick={() => playPlayer('alan-walker-player')} style={{ margin: '5px' }}>
          Play Alan Walker
        </button>
        <button onClick={() => pausePlayer('alan-walker-player')} style={{ margin: '5px' }}>
          Pause Alan Walker
        </button>
        
        <button onClick={() => playPlayer('kygo-mashup-player')} style={{ margin: '5px' }}>
          Play Kygo Mashup
        </button>
        <button onClick={() => pausePlayer('kygo-mashup-player')} style={{ margin: '5px' }}>
          Pause Kygo Mashup
        </button>
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <h4>Global Controls:</h4>
        <button onClick={pauseAll} style={{ margin: '5px', backgroundColor: '#ff6b6b' }}>
          Pause All Players
        </button>
        <button onClick={getPlayerIds} style={{ margin: '5px', backgroundColor: '#4ecdc4' }}>
          Log Player IDs (Check Console)
        </button>
      </div>
      
      <p style={{ fontSize: '12px', color: '#666' }}>
        Check the browser console for success/failure messages
      </p>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Sygnal Media</h1>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>




      <h1>Audio Player Test</h1>
      
      {/* Test Controls */}
      <MediaPlayerControls />




    
      {/* Audio Players with IDs */}
      <div style={{ margin: '20px 0' }}>
        <h2>Chainsmokers Track</h2>
        <AudioWavesurfer 
          mp3={{ href: "https://cdn.prod.website-files.com/68853e90d57507843bfd4e55/6885e30a3ded00edb2723011_Chainsmokers.mp3" }}
          id="chainsmokers-player"
          loop="false"
          preload="true"
        />
      </div>

      <div style={{ margin: '20px 0' }}>
        <h2>Alan Walker Track</h2>
        <AudioWavesurfer 
          mp3={{ href: "https://cdn.prod.website-files.com/68853e90d57507843bfd4e55/6885e2f140ff0915c936f9dd_Alan%20Walker.mp3" }}
          id="alan-walker-player"
          loop="false"
          preload="true"
        />
      </div>

      <div style={{ margin: '20px 0' }}>
        <h2>Kygo x Alan Walker Mashup</h2>
        <AudioWavesurfer 
          mp3={{ href: "https://cdn.prod.website-files.com/68853e90d57507843bfd4e55/6885d76ef7b4ab651cb3525b_Kygo%20x%20Alan%20Walker%20ft.%20Selena%20Gomez%20-%20It%20Ain%27t%20Faded%20(STBBRN%20Mashup).mp3" }}
          id="kygo-mashup-player"
          loop="false"
          preload="true"
        />
      </div>

      {/* Example of player without ID (for testing mixed scenarios) */}
      <div style={{ margin: '20px 0' }}>
        <h2>Player Without ID (No External Control)</h2>
        <AudioWavesurfer
          mp3={{ href: "https://cdn.prod.website-files.com/68853e90d57507843bfd4e55/6885e30a3ded00edb2723011_Chainsmokers.mp3" }}
          loop="false"
          preload="true"
        />
      </div>

      {/* Spline 3D Scene Test */}
      <div style={{ margin: '20px 0' }}>
        <h2>3D Spline Scene1</h2>
        <Spline
          splineUrl="https://prod.spline.design/yVDxdZWJmBEGK11j/scene.splinecode"
          width="100%"
          height="600px"
          onLoad={() => console.log('Spline scene loaded')}
          onError={(error: unknown) => console.error('Spline error:', error)}
        />
      </div>



<div>





</div>




      {/* Rive Animation Test */}
      <div style={{ margin: '20px 0' }}>
        <h2>Rive Animation - Vehicles (Canvas)</h2>
        <RiveCanvas
          riveUrl="/wf-rive-placeholder.riv"
          width="100%"
          height="400px"
          artboard="Jeep"
          autoplay={true}
          onLoad={() => console.log('Rive animation loaded successfully')}
          onError={(error: unknown) => console.error('Rive error:', error)}
        />
      </div>




<div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
  <h1>Flipbook Component Demo</h1>
  <p style={{ marginBottom: '20px', color: '#666' }}>
    Drag left or right to rotate the 360° view
  </p>

  <h3>Forward Direction (default):</h3>
  <Flipbook
    jsonUrl="/demo-rotation.json"
    rotationDirection="clockwise"
  />

  <h3 style={{ marginTop: '40px' }}>Backward Direction:</h3>
  <Flipbook
    jsonUrl="/demo-rotation.json"
    rotationDirection="counterclockwise"
  />

  <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
    <h3>How it works:</h3>
    <ul style={{ lineHeight: '1.8' }}>
      <li>Click and drag (or swipe on mobile) to rotate</li>
      <li>The component loads 36 images (10° between each frame)</li>
      <li>Seamlessly wraps from 360° back to 0°</li>
      <li>Shows current angle and frame number at the bottom</li>
      <li>Toggle between clockwise and counterclockwise rotation directions</li>
    </ul>
  </div>
</div>







    </div>
  );
}

export default App;
