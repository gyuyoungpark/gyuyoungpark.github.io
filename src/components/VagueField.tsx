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
  down: (event: PointerEvent) => boolean;
  up: (event: PointerEvent) => void;
  leave: (event: PointerEvent) => void;
  cancel: (event: PointerEvent) => void;
};

type Ripple = { x: number; y: number; born: number };
type DrawingPoint = { x: number; y: number };
type DrawingStroke = { points: DrawingPoint[]; lastInput: number; active: boolean };

const MAX_STROKES = 24;
const MAX_POINTS_PER_STROKE = 1500;
const STROKE_HOLD_MS = 600;
const STROKE_FADE_MS = 3000;

export function VagueField({ paused, resetKey, reducedMotion }: VagueFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<FieldController | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const drawingCanvas = drawingCanvasRef.current;
    const context = canvas?.getContext('2d');
    const drawingContext = drawingCanvas?.getContext('2d');
    if (!canvas || !context || !drawingCanvas || !drawingContext) return;

    let width = 1;
    let height = 1;
    let pixelRatio = 1;
    let elapsed = 0;
    let previousFrame = 0;
    let frameId: number | null = null;
    let drawingFrameId: number | null = null;
    let isPaused = true;
    let prefersReducedMotion = true;
    let disposed = false;
    let ripples: Ripple[] = [];
    let strokes: DrawingStroke[] = [];
    let activeStroke: DrawingStroke | null = null;
    let activePointerId: number | null = null;
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

    const drawDrawing = (now: number) => {
      if (disposed || document.hidden) return;
      const hold = prefersReducedMotion ? 150 : STROKE_HOLD_MS;
      const fade = prefersReducedMotion ? 900 : STROKE_FADE_MS;
      strokes = strokes.filter((stroke) => stroke.active || now - stroke.lastInput < hold + fade);
      drawingContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      drawingContext.clearRect(0, 0, width, height);
      drawingContext.lineCap = 'round';
      drawingContext.lineJoin = 'round';
      drawingContext.lineWidth = 2.5;
      drawingContext.strokeStyle = '#27272a';
      drawingContext.fillStyle = '#27272a';

      for (const stroke of strokes) {
        const progress = stroke.active ? 0 : Math.max(0, Math.min(1, (now - stroke.lastInput - hold) / fade));
        const opacity = 1 - progress * progress * (3 - 2 * progress);
        drawingContext.globalAlpha = opacity * 0.84;
        const first = stroke.points[0];
        if (stroke.points.length === 1) {
          drawingContext.beginPath();
          drawingContext.arc(first.x, first.y, 1.25, 0, Math.PI * 2);
          drawingContext.fill();
          continue;
        }

        drawingContext.beginPath();
        drawingContext.moveTo(first.x, first.y);
        for (let index = 1; index < stroke.points.length - 1; index += 1) {
          const current = stroke.points[index];
          const next = stroke.points[index + 1];
          drawingContext.quadraticCurveTo(current.x, current.y, (current.x + next.x) / 2, (current.y + next.y) / 2);
        }
        const last = stroke.points[stroke.points.length - 1];
        drawingContext.lineTo(last.x, last.y);
        drawingContext.stroke();
      }
      drawingContext.globalAlpha = 1;
    };

    const stopDrawing = () => {
      if (drawingFrameId !== null) cancelAnimationFrame(drawingFrameId);
      drawingFrameId = null;
    };

    const drawingFrame = (now: number) => {
      drawingFrameId = null;
      if (disposed || document.hidden) return;
      drawDrawing(now);
      if (strokes.some((stroke) => !stroke.active)) {
        drawingFrameId = requestAnimationFrame(drawingFrame);
      }
    };

    const requestDrawingFrame = () => {
      if (!disposed && !document.hidden && drawingFrameId === null && strokes.some((stroke) => !stroke.active)) {
        drawingFrameId = requestAnimationFrame(drawingFrame);
      }
    };

    const appendPoint = (event: PointerEvent, bounds: DOMRect, now: number) => {
      if (!activeStroke) return;
      const point = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
      const last = activeStroke.points[activeStroke.points.length - 1];
      activeStroke.lastInput = now;
      if (last && Math.hypot(point.x - last.x, point.y - last.y) < 0.65) return;
      if (activeStroke.points.length >= MAX_POINTS_PER_STROKE) {
        const lastIndex = activeStroke.points.length - 1;
        activeStroke.points = activeStroke.points.filter((_, index) => index % 2 === 0 || index === lastIndex);
      }
      activeStroke.points.push(point);
    };

    const appendPointerInput = (event: PointerEvent) => {
      if (!activeStroke || event.pointerId !== activePointerId) return;
      const bounds = canvas.getBoundingClientRect();
      const now = performance.now();
      const coalesced = typeof event.getCoalescedEvents === 'function' ? event.getCoalescedEvents() : [];
      for (const sample of coalesced) appendPoint(sample, bounds, now);
      appendPoint(event, bounds, now);
      drawDrawing(now);
    };

    const finishStroke = () => {
      if (activeStroke) {
        activeStroke.active = false;
        activeStroke.lastInput = performance.now();
      }
      activeStroke = null;
      activePointerId = null;
      pointer.pressed = false;
      drawDrawing(performance.now());
      requestDrawingFrame();
    };

    const releaseCapture = () => {
      const capturedPointerId = activePointerId;
      finishStroke();
      if (capturedPointerId !== null && canvas.hasPointerCapture(capturedPointerId)) {
        canvas.releasePointerCapture(capturedPointerId);
      }
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
        drawDrawing(performance.now());
        requestDrawingFrame();
        requestFrame();
      },
      reset: () => {
        releaseCapture();
        stopDrawing();
        strokes = [];
        elapsed = 0;
        previousFrame = 0;
        ripples = [];
        pointer.active = false;
        pointer.pressed = false;
        pointer.strength = 0;
        pointer.x = pointer.y = pointer.targetX = pointer.targetY = 0;
        draw();
        drawDrawing(performance.now());
        requestFrame();
      },
      move: (event) => {
        if (!event.isPrimary || (activePointerId !== null && event.pointerId !== activePointerId)) return;
        if (activePointerId !== null && (event.buttons & 1) === 0) releaseCapture();
        positionPointer(event);
        if (pointer.pressed) appendPointerInput(event);
        if (pointer.pressed && Math.hypot(
          pointer.targetX - pointer.lastRippleX,
          pointer.targetY - pointer.lastRippleY,
        ) > 55) addRipple();
        reflectPointer();
      },
      down: (event) => {
        if (!event.isPrimary || event.button !== 0 || activePointerId !== null) return false;
        positionPointer(event);
        pointer.pressed = true;
        activePointerId = event.pointerId;
        activeStroke = { points: [], lastInput: performance.now(), active: true };
        strokes.push(activeStroke);
        if (strokes.length > MAX_STROKES) strokes.shift();
        appendPointerInput(event);
        addRipple();
        reflectPointer();
        return true;
      },
      up: (event) => {
        if (event.pointerId !== activePointerId) return;
        appendPointerInput(event);
        positionPointer(event);
        releaseCapture();
        pointer.active = event.pointerType !== 'touch'
          && pointer.targetX >= 0 && pointer.targetX <= width
          && pointer.targetY >= 0 && pointer.targetY <= height;
        reflectPointer();
      },
      leave: (event) => {
        if (activePointerId !== null && event.pointerId !== activePointerId) return;
        if (activePointerId !== null) appendPointerInput(event);
        releaseCapture();
        pointer.active = false;
        reflectPointer();
      },
      cancel: (event) => {
        if (activePointerId !== null && event.pointerId !== activePointerId) return;
        releaseCapture();
        pointer.active = false;
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
      drawingCanvas.width = canvas.width;
      drawingCanvas.height = canvas.height;
      draw();
      drawDrawing(performance.now());
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    window.addEventListener('resize', resize);

    const visibilityChanged = () => {
      stop();
      stopDrawing();
      if (document.hidden) releaseCapture();
      if (!document.hidden) {
        draw();
        drawDrawing(performance.now());
        requestDrawingFrame();
        requestFrame();
      }
    };
    const windowBlurred = () => {
      releaseCapture();
      pointer.active = false;
      reflectPointer();
    };
    document.addEventListener('visibilitychange', visibilityChanged);
    window.addEventListener('blur', windowBlurred);
    resize();

    return () => {
      disposed = true;
      stop();
      stopDrawing();
      releaseCapture();
      observer.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('blur', windowBlurred);
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
    if (controllerRef.current?.down(event.nativeEvent)) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    controllerRef.current?.up(event.nativeEvent);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        className="vague-field"
        aria-hidden="true"
        onPointerMove={(event) => controllerRef.current?.move(event.nativeEvent)}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={(event) => controllerRef.current?.leave(event.nativeEvent)}
        onPointerCancel={(event) => controllerRef.current?.cancel(event.nativeEvent)}
        onLostPointerCapture={(event) => controllerRef.current?.cancel(event.nativeEvent)}
      />
      <canvas ref={drawingCanvasRef} className="vague-drawing" aria-hidden="true" />
    </>
  );
}
