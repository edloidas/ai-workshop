import { useRef } from 'react';

import { useWebGL } from '../hooks/useWebGL';
import fragmentShader from '../shaders/blob.frag';
import vertexShader from '../shaders/blob.vert';

interface ShaderCanvasProps {
  className?: string;
}

export function ShaderCanvas({ className = '' }: ShaderCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useWebGL(canvasRef, {
    vertexShader,
    fragmentShader,
  });

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        // Fallback gradient if WebGL fails to render
        background: 'radial-gradient(ellipse at center, rgba(184, 90, 64, 0.3) 0%, #1a1a1a 70%)',
      }}
    />
  );
}
