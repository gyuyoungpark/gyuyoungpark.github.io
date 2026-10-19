import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react';

type VagueFieldProps = {
  paused: boolean;
  resetKey: number;
  reducedMotion: boolean;
};

type FieldController = {
  configure: (paused: boolean, reducedMotion: boolean) => void;
  reset: () => void;
  move: (event: PointerEvent) => void;
  down: (event: PointerEvent) => void;
  up: (event: PointerEvent) => void;
  leave: () => void;
  cancel: () => void;
};

type Ripple = { x: number; y: number; born: number };

export function VagueField({ paused, resetKey, reducedMotion }: VagueFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<FieldController | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    let width = 1;
    let height = 1;
    let pixelRatio = 1;
    let elapsed = 0;
    let previousFrame = 0;
    let frameId: number | null = null;
    let isPaused = true;
    let prefersReducedMotion = true;
    let disposed = false;
    let ripples: Ripple[] = [];
    const pointer = {
      active: false,
      pressed: false,
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      strength: 0,
      lastRippleX: 0,
      lastRippleY: 0,
    };

    const canAnimate = () => !disposed && !document.hidden && !isPaused && !prefersReducedMotion;

    const draw = () => {
      if (disposed || document.hidden) return;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.clearRect(0, 0, width, height);
      context.lineCap = 'round';
      context.lineJoin = 'round';

      const lineCount = Math.max(40, Math.min(54, Math.round(height / 17)));
      const sampleCount = Math.max(45, Math.ceil(width / 13));
      const influenceRadius = Math.min(215, Math.max(125, width * 0.19));
      const edgeFade = context.createLinearGradient(0, 0, width, 0);
      edgeFade.addColorStop(0, 'rgba(24, 24, 24, 0.05)');
      edgeFade.addColorStop(0.14, 'rgba(24, 24, 24, 0.7)');
      edgeFade.addColorStop(0.55, 'rgba(24, 24, 24, 1)');
      edgeFade.addColorStop(0.86, 'rgba(24, 24, 24, 0.7)');
      edgeFade.addColorStop(1, 'rgba(24, 24, 24, 0.05)');
      context.strokeStyle = edgeFade;

      for (let line = 0; line < lineCount; line += 1) {
        const band = line / (lineCount - 1);
        const offset = (band - 0.5) * 2;
        const baseY = height * (0.12 + band * 0.76);
        context.globalAlpha = 0.11 + (Math.sin(line * 0.74) + 1) * 0.024 + (line % 7 === 0 ? 0.07 : 0);
        context.lineWidth = line % 7 === 0 ? 0.85 : 0.65;
        context.beginPath();

        let lastX = 0;
        let lastY = 0;
        for (let sample = 0; sample <= sampleCount; sample += 1) {
          const normalizedX = sample / sampleCount;
          let x = normalizedX * (width + 64) - 32;
          const envelope = Math.exp(-Math.pow((normalizedX - 0.57) / 0.46, 2));
          let y = baseY + envelope * (
            Math.sin(normalizedX * 5.8 + elapsed * 0.11 + offset * 2.2) * height * 0.052
            + Math.sin(normalizedX * 2.8 - elapsed * 0.07 + offset * 1.1) * height * 0.037
          ) + Math.sin(normalizedX * 12.8 + offset * 2 + elapsed * 0.05) * 4;

          if (pointer.strength > 0.001) {
            const dx = x - pointer.x;
            const dy = y - pointer.y;
            const distance = Math.hypot(dx, dy);
            const falloff = Math.exp(-Math.pow(distance / influenceRadius, 2) * 2.2);
            const push = falloff * pointer.strength * (pointer.pressed ? 59 : 43);
            x += (dx / (distance + 12)) * push * 0.4;
            y += (dy / (distance + 12)) * push;
          }

          for (const ripple of ripples) {
            const age = elapsed - ripple.born;
            const dx = x - ripple.x;
            const dy = y - ripple.y;
            const distance = Math.hypot(dx, dy);
            const ringDistance = distance - (18 + age * 135);
            const displacement = Math.sin(ringDistance / 23)
              * Math.exp(-Math.pow(ringDistance / 58, 2))
              * Math.exp(-age * 1.15) * 10;
            y += (dy / (distance + 10)) * displacement;
          }

          if (sample === 0) {
            context.moveTo(x, y);
          } else {
            context.quadraticCurveTo(lastX, lastY, (lastX + x) / 2, (lastY + y) / 2);
          }
          lastX = x;
          lastY = y;
        }
        context.lineTo(lastX, lastY);
        context.stroke();
      }

      if (pointer.strength > 0.01) {
        context.globalAlpha = pointer.strength * 0.38;
        context.fillStyle = '#242424';
        context.beginPath();
        context.arc(pointer.x, pointer.y, pointer.pressed ? 2.5 : 1.7, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;
    };

    const stop = () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      frameId = null;
      previousFrame = 0;
    };

    const frame = (timestamp: number) => {
      frameId = null;
      if (!canAnimate()) return;
      const delta = previousFrame ? Math.min((timestamp - previousFrame) / 1000, 0.06) : 0;
      previousFrame = timestamp;
      elapsed += delta;
      const blend = 1 - Math.exp(-delta * 12);
      pointer.x += (pointer.targetX - pointer.x) * blend;
      pointer.y += (pointer.targetY - pointer.y) * blend;
      pointer.strength += ((pointer.active ? 1 : 0) - pointer.strength) * blend;
      ripples = ripples.filter((ripple) => elapsed - ripple.born < 3.5);
      draw();
      frameId = requestAnimationFrame(frame);
    };

    const requestFrame = () => {
      if (canAnimate() && frameId === null) frameId = requestAnimationFrame(frame);
    };

    const reflectPointer = () => {
      if (!canAnimate()) {
        pointer.x = pointer.targetX;
        pointer.y = pointer.targetY;
        pointer.strength = pointer.active ? 1 : 0;
        draw();
      }
    };

    const positionPointer = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.targetX = event.clientX - bounds.left;
      pointer.targetY = event.clientY - bounds.top;
      if (!pointer.active) {
        pointer.x = pointer.targetX;
        pointer.y = pointer.targetY;
      }
      pointer.active = true;
    };

    const addRipple = () => {
      ripples.push({ x: pointer.targetX, y: pointer.targetY, born: elapsed });
      if (ripples.length > 6) ripples.shift();
      pointer.lastRippleX = pointer.targetX;
      pointer.lastRippleY = pointer.targetY;
    };

    const controller: FieldController = {
      configure: (nextPaused, nextReducedMotion) => {
        isPaused = nextPaused;
        prefersReducedMotion = nextReducedMotion;
        stop();
        reflectPointer();
        draw();
        requestFrame();
      },
      reset: () => {
        elapsed = 0;
        previousFrame = 0;
        ripples = [];
        pointer.active = false;
        pointer.pressed = false;
        pointer.strength = 0;
        pointer.x = pointer.y = pointer.targetX = pointer.targetY = 0;
        draw();
        requestFrame();
      },
      move: (event) => {
        positionPointer(event);
        if (pointer.pressed && Math.hypot(
          pointer.targetX - pointer.lastRippleX,
          pointer.targetY - pointer.lastRippleY,
        ) > 55) addRipple();
        reflectPointer();
      },
      down: (event) => {
        positionPointer(event);
        pointer.pressed = true;
        addRipple();
        reflectPointer();
      },
      up: (event) => {
        positionPointer(event);
        pointer.pressed = false;
        pointer.active = event.pointerType !== 'touch'
          && pointer.targetX >= 0 && pointer.targetX <= width
          && pointer.targetY >= 0 && pointer.targetY <= height;
        reflectPointer();
      },
      leave: () => {
        if (!pointer.pressed) pointer.active = false;
        reflectPointer();
      },
      cancel: () => {
        pointer.active = false;
        pointer.pressed = false;
        reflectPointer();
      },
    };
    controllerRef.current = controller;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      draw();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    window.addEventListener('resize', resize);

    const visibilityChanged = () => {
      stop();
      if (!document.hidden) {
        draw();
        requestFrame();
      }
    };
    document.addEventListener('visibilitychange', visibilityChanged);
    resize();

    return () => {
      disposed = true;
      stop();
      observer.disconnect();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', visibilityChanged);
      if (controllerRef.current === controller) controllerRef.current = null;
    };
  }, []);

  useEffect(() => {
    controllerRef.current?.configure(paused, reducedMotion);
  }, [paused, reducedMotion]);

  useEffect(() => {
    controllerRef.current?.reset();
  }, [resetKey]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    controllerRef.current?.down(event.nativeEvent);
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    controllerRef.current?.up(event.nativeEvent);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className="vague-field"
      aria-hidden="true"
      onPointerMove={(event) => controllerRef.current?.move(event.nativeEvent)}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={() => controllerRef.current?.leave()}
      onPointerCancel={() => controllerRef.current?.cancel()}
    />
  );
}
