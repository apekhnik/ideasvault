"use client";

import { useEffect, useRef } from "react";

const vertexShaderSource = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;

  // Псевдо-рандомная функция шума
  float hash(float n) { return fract(sin(n) * 43758.5453); }

  float noise(in vec2 x) {
    vec2 p = floor(x);
    vec2 f = fract(x);
    f = f*f*(3.0-2.0*f);
    float n = p.x + p.y*57.0;
    return mix(mix(hash(n+0.0), hash(n+1.0), f.x),
               mix(hash(n+57.0), hash(n+58.0), f.x), f.y);
  }

  void main() {
    vec2 st = vUv;
    float time = uTime * 0.15; // Скорость волн

    // Создаем несколько слоев волн с разной частотой и скоростью
    float n1 = noise(st * 3.0 + time * 1.0);
    float n2 = noise(st * 4.5 - time * 0.5 + vec2(1.0, 2.0));
    float n3 = noise(st * 2.0 + time * 1.5 + vec2(-2.0, 1.0));

    // Смешиваем волны, чтобы они перетекали друг в друга
    float wave = (n1 + n2 + n3) / 3.0;

    // --- ПАРАМЕТРЫ ЦВЕТА (как в image_63498a.png) ---
    vec3 baseColor = vec3(0.02, 0.02, 0.02); // Deep Charcoal #050505
    vec3 waveColor = vec3(0.24, 0.17, 0.12); // #3d2b1f Muted Bronze
    
    // --- ПАРАМЕТРЫ РАЗМЫТИЯ И ИНТЕНСИВНОСТИ ---
    // mix создает плавный переход между базовым цветом и цветом волны.
    // Умножение wave * 0.6 задает яркость волн и их "прозрачность".
    // smoothstep(0.3, 0.7, wave) создает мягкий "размытый" край.
    float blurMix = smoothstep(0.3, 0.7, wave);
    vec3 color = mix(baseColor, waveColor, blurMix * 0.6);

    // Зернистость (оставляем для текстуры)
    float n_grain = fract(sin(dot(vUv.xy, vec2(12.9898,78.233))) * 43758.5453123) * 0.03;
    color += n_grain;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
    });
    if (!gl) return;

    function createShader(type: number, source: string) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return;
    }
    gl.useProgram(program);

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const timeLocation = gl.getUniformLocation(program, "uTime");

    let rafId = 0;

    function resizeCanvas() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    resizeCanvas();

    function onResize() {
      resizeCanvas();
    }
    window.addEventListener("resize", onResize);

    function render(time: number) {
      gl.uniform1f(timeLocation, time * 0.001);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafId = requestAnimationFrame(render);
    }

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      aria-hidden
    />
  );
}
