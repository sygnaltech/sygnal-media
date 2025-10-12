# JavaScript API for External Component Control

This document describes how to implement and use JavaScript APIs to control Webflow Code Components externally.

## Overview

Some components (like Rive animations) can expose JavaScript APIs that allow external scripts to control them dynamically. This is useful for:
- Scroll-based animations
- Form interactions
- Button/event-driven state changes
- Dynamic content switching
- Progress indicators

## Architecture Pattern

### 1. Global Manager Class

Create a singleton manager that maintains a registry of component instances:

```typescript
// managers/RiveManager.ts
class RiveManager {
  private instances: Map<string, any> = new Map();

  register(id: string, riveInstance: any) {
    this.instances.set(id, riveInstance);
  }

  unregister(id: string) {
    this.instances.delete(id);
  }

  // Control methods...
}

export const riveManager = new RiveManager();

// Expose globally for Webflow
declare global {
  interface Window {
    riveManager: RiveManager;
  }
}

if (typeof window !== 'undefined') {
  window.riveManager = riveManager;
}
```

### 2. Component Registration

Components register themselves with the manager on mount and unregister on unmount:

```typescript
export const RiveWebGL2: React.FC<RiveWebGL2Props> = ({
  id,
  // ... other props
}) => {
  const riveInstanceRef = useRef<any>(null);

  useEffect(() => {
    const loadRive = async () => {
      // ... create Rive instance
      riveInstanceRef.current = riveInstance;

      // Register with manager if ID provided
      if (id) {
        riveManager.register(id, riveInstance);
        console.log(`Rive instance "${id}" registered`);
      }
    };

    loadRive();

    return () => {
      // Unregister on cleanup
      if (id && riveInstanceRef.current) {
        riveManager.unregister(id);
      }
      // ... other cleanup
    };
  }, [id, /* other deps */]);
};
```

### 3. Webflow Props

Add an ID prop to the Webflow component declaration:

```typescript
export default declareComponent(RiveWebGL2, {
    props: {
        id: props.ID({
            name: "Component ID",
            tooltip: "Unique ID for external control via JavaScript API (optional)",
            group: "Advanced"
        }),
        // ... other props
    },
});
```

## Rive Manager API Reference

### Artboard Control

```typescript
// Change the active artboard
setArtboard(id: string, artboardName: string): boolean
```

**Example:**
```javascript
window.riveManager.setArtboard('character-animation', 'Walk');
```

### State Machine Control

```typescript
// Switch to a different state machine
setStateMachine(id: string, stateMachineName: string): boolean
```

**Example:**
```javascript
window.riveManager.setStateMachine('character-animation', 'Movement');
```

### Input Control

```typescript
// Set numeric or boolean inputs
setInput(id: string, inputName: string, value: number | boolean): boolean
```

**Examples:**
```javascript
// Set numeric input (e.g., speed slider)
window.riveManager.setInput('character-animation', 'speed', 2.5);

// Set boolean input (e.g., toggle state)
window.riveManager.setInput('character-animation', 'isJumping', true);
```

### Trigger Control

```typescript
// Fire a one-time trigger
fireTrigger(id: string, triggerName: string): boolean
```

**Example:**
```javascript
window.riveManager.fireTrigger('character-animation', 'explode');
```

### Playback Control

```typescript
// Play/pause/reset the animation
play(id: string): boolean
pause(id: string): boolean
reset(id: string): boolean
```

**Examples:**
```javascript
window.riveManager.play('character-animation');
window.riveManager.pause('character-animation');
window.riveManager.reset('character-animation');
```

### Utility Methods

```typescript
// Get all registered instance IDs
getInstanceIds(): string[]

// Get direct access to a Rive instance
getInstance(id: string): any | null
```

**Examples:**
```javascript
// List all available instances
console.log('Available Rive instances:', window.riveManager.getInstanceIds());

// Direct instance access for advanced use
const instance = window.riveManager.getInstance('character-animation');
console.log(instance.bounds);
```

## Usage in Webflow

### Setup in Webflow Designer

1. Add a Rive component to your page
2. Set the **Component ID** field (e.g., `"character-animation"`)
3. Configure artboard, state machine, and other settings
4. Publish your site

### Control via Custom Code

Add JavaScript in Webflow's **Custom Code** section or in an **Embed** element:

```html
<script>
// Wait for components to load
window.addEventListener('load', function() {

  // Check what's available
  console.log('Rive instances:', window.riveManager.getInstanceIds());

  // Control the animation
  window.riveManager.setInput('character-animation', 'speed', 2.0);

});
</script>
```

## Real-World Examples

### Example 1: Interactive Character Selection

```javascript
// Switch character preview on hover
document.querySelectorAll('.character-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    const character = this.dataset.character; // data-character="warrior"
    window.riveManager.setArtboard('character-preview', character);
    window.riveManager.fireTrigger('character-preview', 'appear');
  });
});
```

### Example 2: Scroll-Based Progress

```javascript
// Update animation based on scroll position
window.addEventListener('scroll', function() {
  const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  window.riveManager.setInput('progress-indicator', 'progress', scrollPercent);
});
```

### Example 3: Form Validation Feedback

```javascript
// Animate validation states
const emailInput = document.querySelector('#email-input');

emailInput.addEventListener('blur', function() {
  const isValid = this.validity.valid;

  window.riveManager.setInput('form-feedback', 'isValid', isValid);
  window.riveManager.fireTrigger('form-feedback', isValid ? 'success' : 'error');
});
```

### Example 4: Button-Triggered Animation

```javascript
// Play animation on button click
document.querySelector('#cta-button').addEventListener('click', function() {
  window.riveManager.setArtboard('hero-animation', 'Excited');
  window.riveManager.fireTrigger('hero-animation', 'celebrate');
});
```

### Example 5: Loading Progress Bar

```javascript
// Simulate loading with progress updates
let progress = 0;
const interval = setInterval(function() {
  progress += 10;
  window.riveManager.setInput('loader', 'percentage', progress);

  if (progress >= 100) {
    clearInterval(interval);
    window.riveManager.fireTrigger('loader', 'complete');
  }
}, 200);
```

### Example 6: Mouse Position Tracking

```javascript
// Animation follows mouse movement
document.addEventListener('mousemove', function(e) {
  const x = (e.clientX / window.innerWidth) * 100;
  const y = (e.clientY / window.innerHeight) * 100;

  window.riveManager.setInput('eye-tracking', 'mouseX', x);
  window.riveManager.setInput('eye-tracking', 'mouseY', y);
});
```

## Best Practices

### 1. Always Check for Existence

```javascript
if (window.riveManager) {
  window.riveManager.play('my-animation');
} else {
  console.warn('Rive manager not available');
}
```

### 2. Wait for Load

Components register on mount, so wait for the page to load:

```javascript
window.addEventListener('load', function() {
  // Safe to use API here
  window.riveManager.play('my-animation');
});
```

### 3. Handle Errors

All methods return `boolean` for success/failure:

```javascript
const success = window.riveManager.setInput('my-animation', 'speed', 2.0);
if (!success) {
  console.error('Failed to set input - check ID and input name');
}
```

### 4. Unique IDs

Ensure each component has a unique ID on the page:
- ✅ `character-animation`
- ✅ `hero-loader`
- ❌ `animation` (too generic)

### 5. Debug with getInstanceIds()

When things don't work, check what's registered:

```javascript
console.log('Available:', window.riveManager.getInstanceIds());
// Output: ['character-animation', 'hero-loader']
```

## Implementation Checklist

To add JS API support to a new component:

- [ ] Create a Manager class (e.g., `RiveManager.ts`)
- [ ] Implement `register()` and `unregister()` methods
- [ ] Add control methods specific to the component type
- [ ] Export singleton instance
- [ ] Expose on `window` object
- [ ] Add `id` prop to component interface
- [ ] Register instance in component's `useEffect`
- [ ] Unregister on cleanup
- [ ] Add `props.ID()` to Webflow declaration
- [ ] Document API in this file
- [ ] Test in Webflow environment

## Similar Patterns

This pattern is already used in this codebase for:

- **MediaPlayerManager** - Controls AudioWavesurfer components
  - `window.mediaPlayerManager.playPlayer(id)`
  - `window.mediaPlayerManager.pausePlayer(id)`
  - `window.mediaPlayerManager.pauseAll()`

The Rive Manager follows the same architectural pattern for consistency.

## TypeScript Support

For better developer experience, you can add type definitions:

```typescript
// types/rive-api.d.ts
interface RiveManagerAPI {
  setArtboard(id: string, artboardName: string): boolean;
  setStateMachine(id: string, stateMachineName: string): boolean;
  setInput(id: string, inputName: string, value: number | boolean): boolean;
  fireTrigger(id: string, triggerName: string): boolean;
  play(id: string): boolean;
  pause(id: string): boolean;
  reset(id: string): boolean;
  getInstanceIds(): string[];
  getInstance(id: string): any | null;
}

declare global {
  interface Window {
    riveManager: RiveManagerAPI;
  }
}
```

## Future Enhancements

Possible additions to the API pattern:

- **Event listeners** - Subscribe to animation events
- **Batch operations** - Control multiple instances at once
- **State queries** - Get current artboard, inputs, etc.
- **Animation events** - onStateChange, onLoop, etc.
- **Typed input configs** - Define expected inputs per animation

## Support

For questions about implementing JS APIs for components:
1. Review existing `MediaPlayerManager` implementation
2. Follow the patterns documented here
3. Test thoroughly in Webflow published sites
4. Document any new APIs added to components
