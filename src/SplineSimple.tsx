import React, { CSSProperties } from 'react';

export interface SplineProps {
  splineUrl: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: CSSProperties;
  loading?: React.ReactNode;
  error?: React.ReactNode;
  lazy?: boolean;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  responsive?: boolean;
}

export const Spline: React.FC<SplineProps> = ({
  splineUrl,
  width = '100%',
  height = '500px',
  className,
  style,
  loading,
  error,
  responsive = true,
}) => {
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

  const sceneId = splineUrl.split('/').find(part =>
    part && !part.includes('.') && part.length > 10
  ) || 'scene';

  return (
    <div className={className} style={containerStyle}>
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        color: '#6c757d',
        fontSize: '16px',
        border: '2px dashed #dee2e6',
        borderRadius: '8px',
        flexDirection: 'column',
        gap: '8px',
      }}>
        <div style={{ fontSize: '24px' }}>🎯</div>
        <div>Spline Scene</div>
        <div style={{ fontSize: '12px', opacity: 0.7 }}>
          {sceneId}
        </div>
      </div>
    </div>
  );
};

export default Spline;