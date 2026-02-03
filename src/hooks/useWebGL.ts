import { useCallback, useEffect, useRef } from 'react';

interface WebGLState {
  gl: WebGL2RenderingContext;
  program: WebGLProgram;
  vao: WebGLVertexArrayObject;
  uniforms: {
    time: WebGLUniformLocation;
    resolution: WebGLUniformLocation;
  };
}

interface UseWebGLOptions {
  vertexShader: string;
  fragmentShader: string;
}

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(
  gl: WebGL2RenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

function createFullscreenQuad(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
): WebGLVertexArrayObject | null {
  const vao = gl.createVertexArray();
  if (!vao) return null;

  gl.bindVertexArray(vao);

  // Fullscreen quad vertices (two triangles)
  const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const positionLoc = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(positionLoc);
  gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

  gl.bindVertexArray(null);

  return vao;
}

export function useWebGL(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  options: UseWebGLOptions,
) {
  const stateRef = useRef<WebGLState | null>(null);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const pausedRef = useRef(false);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    const gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
    });

    if (!gl) {
      console.warn('WebGL2 not supported');
      return false;
    }

    const vertShader = compileShader(gl, gl.VERTEX_SHADER, options.vertexShader);
    const fragShader = compileShader(gl, gl.FRAGMENT_SHADER, options.fragmentShader);

    if (!vertShader || !fragShader) return false;

    const program = createProgram(gl, vertShader, fragShader);
    if (!program) return false;

    const vao = createFullscreenQuad(gl, program);
    if (!vao) return false;

    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');

    if (!timeLocation || !resolutionLocation) {
      console.error('Failed to get uniform locations');
      return false;
    }

    stateRef.current = {
      gl,
      program,
      vao,
      uniforms: {
        time: timeLocation,
        resolution: resolutionLocation,
      },
    };

    // Cleanup shaders after linking
    gl.deleteShader(vertShader);
    gl.deleteShader(fragShader);

    return true;
  }, [canvasRef, options.vertexShader, options.fragmentShader]);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    const state = stateRef.current;
    if (!canvas || !state) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    const rect = canvas.getBoundingClientRect();
    const width = Math.floor(rect.width * dpr);
    const height = Math.floor(rect.height * dpr);

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      state.gl.viewport(0, 0, width, height);
    }
  }, [canvasRef]);

  const render = useCallback((timestamp: number) => {
    if (pausedRef.current) {
      rafRef.current = requestAnimationFrame(render);
      return;
    }

    const state = stateRef.current;
    if (!state) return;

    const { gl, program, vao, uniforms } = state;

    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const time = (timestamp - startTimeRef.current) / 1000;

    // biome-ignore lint/correctness/useHookAtTopLevel: gl.useProgram is a WebGL method, not a React hook
    gl.useProgram(program);
    gl.uniform1f(uniforms.time, time);
    gl.uniform2f(uniforms.resolution, gl.canvas.width, gl.canvas.height);

    gl.bindVertexArray(vao);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    rafRef.current = requestAnimationFrame(render);
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      pausedRef.current = true;
    }

    if (!init()) return;

    resize();
    rafRef.current = requestAnimationFrame(render);

    const handleVisibilityChange = () => {
      pausedRef.current = document.hidden;
    };

    const resizeObserver = new ResizeObserver(resize);
    const canvas = canvasRef.current;
    if (canvas) {
      resizeObserver.observe(canvas);
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      resizeObserver.disconnect();

      const state = stateRef.current;
      if (state) {
        state.gl.deleteProgram(state.program);
        state.gl.deleteVertexArray(state.vao);
      }
    };
  }, [init, resize, render, canvasRef]);

  return { resize };
}
