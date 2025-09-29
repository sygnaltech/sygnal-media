import React, { useState, useCallback, CSSProperties } from 'react';

// Dynamic import function to avoid webpack issues
const loadSplineComponent = async () => {
  try {
    const module = await import('@splinetool/react-spline');
    return module.default;
  } catch (error) {
    console.warn('Spline library not available:', error);
    return null;
  }
};

export interface SplineProps {
  splineUrl: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: CSSProperties;
  loading?: React.ReactNode;
  error?: React.ReactNode;
  lazy?: boolean;
  onLoad?: (spline?: any) => void;
  onError?: (error: Error) => void;
  responsive?: boolean;
  useLibrary?: boolean;
}

export const Spline: React.FC<SplineProps> = ({
  splineUrl,
  width = '100%',
  height = '500px',
  className,
  style,
  loading,
  error,
  lazy = false,
  onLoad,
  onError,
  responsive = true,
  useLibrary = true,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [SplineComponent, setSplineComponent] = useState<any>(null);

  // Load Spline component dynamically when needed
  React.useEffect(() => {
    if (useLibrary && !SplineComponent) {
      loadSplineComponent().then((Component) => {
        if (Component) {
          setSplineComponent(() => Component);
        } else {
          setHasError(true);
          setLoadError(new Error('Spline library failed to load'));
        }
        setIsLoading(false);
      });
    } else if (!useLibrary) {
      setIsLoading(false);
    }
  }, [useLibrary, SplineComponent]);

  const handleLoad = useCallback((spline?: any) => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.(spline);
  }, [onLoad]);

  const handleError = useCallback((error?: Error) => {
    const err = error || new Error('Failed to load Spline scene');
    setIsLoading(false);
    setHasError(true);
    setLoadError(err);
    onError?.(err);
  }, [onError]);

  const containerStyle: CSSProperties = {
    width,
    height,
    position: 'relative',
    overflow: 'hidden',
    ...(responsive && {
      maxWidth: '100%',
      aspectRatio: typeof width === 'number' && typeof height === 'number'
        ? `${width} / ${height}`
        : undefined,
    }),
    ...style,
  };

  const defaultLoading = (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      backgroundColor: '#f5f5f5',
      color: '#666',
    }}>
      Loading Spline scene...
    </div>
  );

  const defaultError = (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      backgroundColor: '#fff5f5',
      color: '#e53e3e',
      textAlign: 'center',
      padding: '20px',
    }}>
      <div style={{ fontSize: '18px', marginBottom: '8px' }}>
        Failed to load Spline scene
      </div>
      {loadError && (
        <div style={{ fontSize: '14px', opacity: 0.7 }}>
          {loadError.message}
        </div>
      )}
    </div>
  );

  if (lazy && isLoading && !hasError) {
    return (
      <div className={className} style={containerStyle}>
        {loading || defaultLoading}
      </div>
    );
  }

  if (lazy && isLoading && !hasError) {
    return (
      <div className={className} style={containerStyle}>
        {loading || defaultLoading}
      </div>
    );
  }

  return (
    <div className={className} style={containerStyle}>
      {isLoading && !hasError && (loading || defaultLoading)}

      {hasError && (error || defaultError)}

      {!hasError && useLibrary && SplineComponent && (
        <SplineComponent
          scene={splineUrl}
          style={{
            width: '100%',
            height: '100%',
            display: isLoading ? 'none' : 'block',
          }}
          onLoad={handleLoad}
        />
      )}

      {!hasError && !useLibrary && (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f0f0f0',
          color: '#666',
          fontSize: '16px',
        }}>
          Spline Scene: {splineUrl.split('/').pop()?.replace('.splinecode', '') || 'Unknown'}
        </div>
      )}
    </div>
  );
};

export default Spline;