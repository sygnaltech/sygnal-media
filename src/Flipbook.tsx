import React, { useState, useEffect, useRef } from 'react';

export interface FlipbookProps {
  jsonUrl: string;
  rotationDirection?: 'clockwise' | 'counterclockwise';
  className?: string;
  style?: React.CSSProperties;
}

interface RotationData {
  images: string[];
}

export const Flipbook: React.FC<FlipbookProps> = ({
  jsonUrl,
  rotationDirection = 'clockwise',
  className = '',
  style = {}
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState<boolean>(false);
  const [loadedImageElements, setLoadedImageElements] = useState<HTMLImageElement[]>([]);

  const startXRef = useRef<number>(0);
  const currentIndexRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const imagesRef = useRef<string[]>([]);
  const rotationDirectionRef = useRef<'clockwise' | 'counterclockwise'>(rotationDirection);

  // Keep refs in sync
  useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    rotationDirectionRef.current = rotationDirection;
  }, [rotationDirection]);

  // Handle global mouse move and mouse up
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || imagesRef.current.length === 0) return;

      const deltaX = e.clientX - startXRef.current;
      const sensitivity = 3; // Pixels per frame
      const frameDelta = Math.floor(deltaX / sensitivity);

      // Apply rotation direction (counterclockwise flips the direction)
      const directionMultiplier = rotationDirectionRef.current === 'clockwise' ? 1 : -1;
      let newIndex = currentIndexRef.current + (frameDelta * directionMultiplier);

      // Wrap around
      while (newIndex < 0) {
        newIndex += imagesRef.current.length;
      }
      newIndex = newIndex % imagesRef.current.length;

      setCurrentIndex(newIndex);
    };

    const handleGlobalMouseUp = () => {
      if (isDraggingRef.current) {
        setIsDragging(false);
        isDraggingRef.current = false;
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []); // Empty dependency array - listeners stay attached

  // Load JSON data
  useEffect(() => {
    if (!jsonUrl) {
      setError('No JSON URL provided');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(jsonUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load JSON: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data: RotationData) => {
        if (!data.images || !Array.isArray(data.images) || data.images.length === 0) {
          throw new Error('Invalid JSON format: must contain an "images" array');
        }

        // Extract base path from JSON URL for relative image paths
        const jsonUrlObj = new URL(jsonUrl, window.location.href);
        const basePath = jsonUrlObj.href.substring(0, jsonUrlObj.href.lastIndexOf('/') + 1);

        // Process images: make relative paths absolute based on JSON file location
        const processedImages = data.images.map(imagePath => {
          // Check if the image path already has an origin (protocol + domain)
          try {
            const imageUrl = new URL(imagePath);
            // If it has a protocol, it's already absolute
            return imagePath;
          } catch {
            // No protocol means it's relative - make it relative to JSON file location
            return new URL(imagePath, basePath).href;
          }
        });

        setImages(processedImages);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [jsonUrl]);

  // Preload images and cache them in memory
  useEffect(() => {
    if (images.length === 0) return;

    setImagesLoaded(false);
    const imageElements: HTMLImageElement[] = [];

    const preloadImages = images.map((src, index) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous'; // Enable CORS if needed
        img.onload = () => {
          imageElements[index] = img;
          resolve();
        };
        img.onerror = reject;
        img.src = src;
      });
    });

    Promise.all(preloadImages)
      .then(() => {
        setLoadedImageElements(imageElements);
        setImagesLoaded(true);
      })
      .catch(err => {
        console.error('Error preloading images:', err);
        setImagesLoaded(true); // Still show the component even if some images fail
      });
  }, [images]);

  // Handle mouse down
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    currentIndexRef.current = currentIndex;
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    isDraggingRef.current = true;
    startXRef.current = e.touches[0].clientX;
    currentIndexRef.current = currentIndex;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || imagesRef.current.length === 0) return;

    const deltaX = e.touches[0].clientX - startXRef.current;
    const sensitivity = 3;
    const frameDelta = Math.floor(deltaX / sensitivity);

    // Apply rotation direction (counterclockwise flips the direction)
    const directionMultiplier = rotationDirectionRef.current === 'clockwise' ? 1 : -1;
    let newIndex = currentIndexRef.current + (frameDelta * directionMultiplier);

    while (newIndex < 0) {
      newIndex += imagesRef.current.length;
    }
    newIndex = newIndex % imagesRef.current.length;

    setCurrentIndex(newIndex);
  };

  const handleTouchEnd = () => {
    if (isDraggingRef.current) {
      setIsDragging(false);
      isDraggingRef.current = false;
    }
  };

  // Calculate degrees per frame for display
  const degreesPerFrame = images.length > 0 ? 360 / images.length : 0;
  const currentDegrees = Math.round(currentIndex * degreesPerFrame);

  if (loading) {
    return (
      <div
        className={className}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          backgroundColor: '#f5f5f5',
          ...style
        }}
      >
        <div style={{ textAlign: 'center', color: '#666' }}>
          <div style={{ fontSize: '18px', marginBottom: '8px' }}>Loading 360° view...</div>
          <div style={{ fontSize: '14px' }}>Please wait</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={className}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          backgroundColor: '#fee',
          border: '2px solid #fcc',
          ...style
        }}
      >
        <div style={{ textAlign: 'center', color: '#c33' }}>
          <div style={{ fontSize: '18px', marginBottom: '8px' }}>Error loading 360° view</div>
          <div style={{ fontSize: '14px' }}>{error}</div>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div
        className={className}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          backgroundColor: '#f5f5f5',
          ...style
        }}
      >
        <div style={{ textAlign: 'center', color: '#666' }}>
          No images to display
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        touchAction: 'none',
        ...style
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {!imagesLoaded && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            zIndex: 10
          }}
        >
          <div style={{ textAlign: 'center', color: '#666' }}>
            <div style={{ fontSize: '16px' }}>Loading images...</div>
          </div>
        </div>
      )}

      {/* Render all images but only show the current one - this ensures browser caching */}
      {images.map((src, index) => (
        <img
          key={src}
          src={src}
          alt={index === currentIndex ? `360° view - ${currentDegrees}°` : ''}
          draggable={false}
          style={{
            width: '100%',
            height: 'auto',
            display: index === currentIndex ? 'block' : 'none',
            pointerEvents: 'none'
          }}
        />
      ))}

      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '4px',
          fontSize: '14px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          pointerEvents: 'none'
        }}
      >
        {currentDegrees}° ({currentIndex + 1}/{images.length})
      </div>

      <div
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '6px 12px',
          borderRadius: '4px',
          fontSize: '12px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          pointerEvents: 'none'
        }}
      >
        Drag to rotate
      </div>
    </div>
  );
};

export default Flipbook;
