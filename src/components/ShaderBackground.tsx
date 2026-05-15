"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

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
  const { theme } = useTheme();

  useEffect(() => {
    if (theme === "light") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasEl: HTMLCanvasElement = canvas;
    const gl = canvasEl.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
    });
    if (!gl) return;
    const glCtx: WebGLRenderingContext = gl;

    function createShader(type: number, source: string) {
      const shader = glCtx.createShader(type);
      if (!shader) return null;
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        glCtx.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(glCtx.VERTEX_SHADER, vertexShaderSource);
    const fs = createShader(glCtx.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vs || !fs) return;

    const program = glCtx.createProgram();
    if (!program) return;
    glCtx.attachShader(program, vs);
    glCtx.attachShader(program, fs);
    glCtx.linkProgram(program);
    if (!glCtx.getProgramParameter(program, glCtx.LINK_STATUS)) {
      glCtx.deleteProgram(program);
      return;
    }
    glCtx.useProgram(program);

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = glCtx.createBuffer();
    glCtx.bindBuffer(glCtx.ARRAY_BUFFER, buffer);
    glCtx.bufferData(glCtx.ARRAY_BUFFER, vertices, glCtx.STATIC_DRAW);

    const positionLocation = glCtx.getAttribLocation(program, "position");
    glCtx.enableVertexAttribArray(positionLocation);
    glCtx.vertexAttribPointer(positionLocation, 2, glCtx.FLOAT, false, 0, 0);

    const timeLocation = glCtx.getUniformLocation(program, "uTime");

    let rafId = 0;

    function resizeCanvas() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvasEl.width = Math.floor(w * dpr);
      canvasEl.height = Math.floor(h * dpr);
      glCtx.viewport(0, 0, canvasEl.width, canvasEl.height);
    }

    resizeCanvas();

    function onResize() {
      resizeCanvas();
    }
    window.addEventListener("resize", onResize);

    function render(time: number) {
      glCtx.uniform1f(timeLocation, time * 0.001);
      glCtx.drawArrays(glCtx.TRIANGLE_STRIP, 0, 4);
      rafId = requestAnimationFrame(render);
    }

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      glCtx.deleteProgram(program);
      glCtx.deleteShader(vs);
      glCtx.deleteShader(fs);
      glCtx.deleteBuffer(buffer);
    };
  }, [theme]);

  if (theme === "light") return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      aria-hidden
    />
  );
}
