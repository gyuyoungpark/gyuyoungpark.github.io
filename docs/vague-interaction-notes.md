# VAGUE interactive home

Reviewed on 2026-10-19 for the existing GitHub Pages project.

## Scope

The /vague/ entry is an interactive brand surface with no articles, topic lists, thumbnails, or editorial placeholders. Existing portfolio and article routes remain independent.

## Skills and references reviewed

- Anthropic frontend-design: https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md
  Use one deliberate visual idea, established typography, restrained copy, responsive layouts, and interaction that responds to the visitor.
- Vercel Web Interface Guidelines: https://github.com/vercel-labs/web-interface-guidelines
  Keep navigation and controls semantic, provide visible focus and pause controls, respect reduced motion, and handle touch and safe areas.
- Local Sites presentation-led guidance was reviewed for design principles. This project continues to deploy to GitHub Pages.
- Local visualize is intended for in-conversation visualizations; it is not the workflow for this standalone project page.

## Implementation choices

- Preserve Pretendard and the established VAGUE opacity minimum around G.
- Use a decorative Canvas 2D line field and real HTML for the wordmark, navigation, and controls.
- Pointer Events support mouse, touch, and pen without rendering React state on every frame.
- requestAnimationFrame uses elapsed time; paused, reduced-motion, and hidden-tab states stop the automatic frame loop.
- Cap device pixel ratio, resize the backing buffer, and remove observers, listeners, and animation callbacks on unmount.
- Keep the home free of interaction hints and playback/reset controls. Motion follows the operating-system reduced-motion preference; navigation remains available independently of the canvas.
- GSAP is already a project dependency, but this single-screen field does not need it. Consider ScrollTrigger only if future editorial scenes require scroll-linked sequences.

## Browser documentation

- https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
- https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events
- https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion
- https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/
