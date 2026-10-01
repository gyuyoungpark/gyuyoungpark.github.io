import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { createPortal } from 'react-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { Menu, X } from 'lucide-react';
import { navItems } from '@/data/content';
import { VagueLogo } from './VagueLogo';
import './EdgeNavigation.css';

type ExternalLink = { label: string; href: string; icon: string };
type Gesture = {
  pointerId: number;
  startX: number;
  startY: number;
  width: number;
  wasOpen: boolean;
  locked: boolean;
  distance: number;
};

export function EdgeNavigation({ externalLinks }: { externalLinks: ExternalLink[] }) {
  const [open, setOpen] = useState(false);
  const [offset, setOffset] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [openedByDrag, setOpenedByDrag] = useState(false);
  const gesture = useRef<Gesture | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const [openedByHover, setOpenedByHover] = useState(false);
  const closeButton = useRef<HTMLButtonElement | null>(null);
  const edgeButton = useRef<HTMLButtonElement | null>(null);
  const suppressClick = useRef(false);

  const clearHover = () => {
    if (hoverTimer.current !== null) clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
  };

  const changeOpen = (next: boolean) => {
    clearHover();
    gesture.current = null;
    setDragging(false);
    if (next) {
      setOffset(null);
      setOpenedByDrag(false);
    }
    setOpen(next);
  };

  useEffect(() => {
    const stopGesture = () => {
      gesture.current = null;
      setDragging(false);
      setOffset(null);
    };
    window.addEventListener('resize', stopGesture);
    return () => {
      window.removeEventListener('resize', stopGesture);
      if (hoverTimer.current !== null) clearTimeout(hoverTimer.current);
    };
  }, []);

  const startDrag = (event: PointerEvent<HTMLElement>, wasOpen: boolean) => {
    if (!event.isPrimary || event.button !== 0) return;
    if (wasOpen && (event.target as HTMLElement).closest('a, button')) return;
    clearHover();
    suppressClick.current = false;
    gesture.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      width: Math.min(320, window.innerWidth * 0.86),
      wasOpen,
      locked: false,
      distance: 0,
    };
    if (!wasOpen) returnFocus.current = edgeButton.current;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveDrag = (event: PointerEvent<HTMLElement>) => {
    const current = gesture.current;
    if (!current || current.pointerId !== event.pointerId) return;
    const dx = event.clientX - current.startX;
    const dy = event.clientY - current.startY;
    if (!current.locked) {
      if (Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx)) {
        suppressClick.current = true;
        gesture.current = null;
        event.currentTarget.releasePointerCapture(event.pointerId);
        return;
      }
      if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
      if ((current.wasOpen && dx < 0) || (!current.wasOpen && dx > 0)) return;
      current.locked = true;
      suppressClick.current = true;
      setDragging(true);
      setOpenedByDrag(true);
      if (!current.wasOpen) {
        setOpenedByHover(false);
        setOpen(true);
      }
    }
    current.distance = Math.max(0, current.wasOpen ? dx : -dx);
    setOffset(Math.min(current.width, Math.max(0, current.wasOpen ? dx : current.width + dx)));
  };

  const finishDrag = (event: PointerEvent<HTMLElement>, cancelled = false) => {
    const current = gesture.current;
    if (!current || current.pointerId !== event.pointerId) return;
    gesture.current = null;
    setDragging(false);
    if (!current.locked) return;
    const committed = current.distance >= Math.min(64, current.width * 0.22);
    const nextOpen = cancelled ? current.wasOpen : current.wasOpen ? !committed : committed;
    if (nextOpen) setOffset(0);
    setOpen(nextOpen);
  };

  const dragEvents = {
    onPointerMove: moveDrag,
    onPointerUp: (event: PointerEvent<HTMLElement>) => finishDrag(event),
    onPointerCancel: (event: PointerEvent<HTMLElement>) => finishDrag(event, true),
    onLostPointerCapture: (event: PointerEvent<HTMLElement>) => finishDrag(event, true),
  };

  const navigation = [{ label: 'Home', href: '#top' }, ...navItems];
  const panelStyle = offset === null ? undefined : ({ '--edge-drag-offset': `${offset}px` } as CSSProperties);

  return (
    <Dialog.Root open={open} onOpenChange={changeOpen} modal={!openedByHover}>
      <button
        type="button"
        className="grid h-10 w-10 min-h-[44px] min-w-[44px] place-items-center border-0 bg-transparent text-zinc-700 transition-colors hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#286b8a] lg:hidden"
        aria-label="Open menu"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={(event) => {
          setOpenedByHover(false);
          returnFocus.current = event.currentTarget;
          changeOpen(true);
        }}
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>
      {createPortal(
        <button
          ref={edgeButton}
          type="button"
          className="edge-navigation-handle"
          data-open={open}
          aria-label="Open menu"
          aria-expanded={open}
          aria-haspopup="dialog"
          tabIndex={open ? -1 : 0}
          onPointerEnter={(event) => {
            if (event.pointerType !== 'mouse' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
            clearHover();
            hoverTimer.current = setTimeout(() => {
              setOpenedByHover(true);
              returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
              changeOpen(true);
            }, 250);
          }}
          onPointerLeave={clearHover}
          onPointerDown={(event) => startDrag(event, false)}
          {...dragEvents}
          onClick={(event) => {
            if (suppressClick.current) {
              suppressClick.current = false;
              return;
            }
            setOpenedByHover(false);
            returnFocus.current = event.currentTarget;
            changeOpen(true);
          }}
        >
          <span aria-hidden="true" />
        </button>,
        document.body,
      )}
      <Dialog.Portal>
        <Dialog.Overlay className="edge-navigation-overlay" data-dragging={dragging} />
        <Dialog.Content
          className="edge-navigation-panel"
          data-dragging={dragging}
          data-swipe={openedByDrag}
          style={panelStyle}
          onPointerDown={(event) => startDrag(event, true)}
          {...dragEvents}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            if (!openedByHover) closeButton.current?.focus({ preventScroll: true });
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            returnFocus.current?.focus({ preventScroll: true });
          }}
        >
          <div className="edge-navigation-grip" aria-hidden="true"><span /></div>
          <div className="flex items-center justify-between gap-4">
            <Dialog.Title className="text-sm font-semibold tracking-[0.08em] text-[#56737a]">Menu</Dialog.Title>
            <Dialog.Close asChild>
              <button ref={closeButton} type="button" className="edge-navigation-close" aria-label="Close menu">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">Navigate to a section of the website.</Dialog.Description>
          <nav aria-label="Quick navigation" className="mt-8 flex flex-col gap-1">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={`/${item.href}`}
                className="edge-navigation-link"
                aria-current={window.location.hash === item.href ? 'location' : undefined}
                onClick={() => {
                  changeOpen(false);
                  if (window.location.hash === item.href) {
                    requestAnimationFrame(() => document.getElementById(item.href.slice(1))?.scrollIntoView());
                  }
                }}
              >
                {item.href === '#columns' ? <VagueLogo className="w-[118px]" /> : item.label}
              </a>
            ))}
          </nav>
          <div className="mt-auto flex flex-wrap items-center gap-2 pt-12">
            {externalLinks.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer" aria-label={link.label} title={link.label} className="edge-navigation-social" onClick={() => changeOpen(false)}>
                <img src={link.icon} alt="" className="h-7 w-7 object-contain" />
              </a>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
