"use client";

import { useEffect, useRef } from "react";

const TEXTUAL =
  "input:not([type='button']):not([type='submit']):not([type='reset']):not([type='checkbox']):not([type='radio']), textarea, select, [contenteditable='true']";
const INTERACTIVE = "a[href], button, summary, [role='button'], label[for]";

export function SiteCursor() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const dot = root.querySelector<HTMLElement>(".site-cursor-dot");
    const ring = root.querySelector<HTMLElement>(".site-cursor-ring");
    if (!dot || !ring) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let pointerX = 0;
    let pointerY = 0;
    let ringX = 0;
    let ringY = 0;
    let last = 0;
    let raf = 0;
    let running = false;
    let visible = false;
    let active = false;
    let mode = "";
    let magnet: HTMLElement | null = null;

    function syncCursorClass() {
      document.documentElement.classList.toggle("has-custom-cursor", active);
    }

    const classObserver = new MutationObserver(() => {
      if (active && !document.documentElement.classList.contains("has-custom-cursor")) syncCursorClass();
    });
    classObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    function enabled() {
      return fine.matches && !reduced.matches;
    }

    function place(element: HTMLElement, x: number, y: number) {
      element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }

    function setMode(next: string) {
      if (next === mode) return;
      mode = next;
      root.classList.toggle("is-text", next === "text");
      root.classList.toggle("is-link", next === "link");
    }

    function readTarget(target: EventTarget | null) {
      const element = target instanceof Element ? target : null;
      const textual = element?.closest(TEXTUAL);
      const interactive = textual ? null : element?.closest(INTERACTIVE);
      setMode(textual ? "text" : interactive ? "link" : "default");

      magnet = null;
      if (
        interactive instanceof HTMLElement &&
        !interactive.classList.contains("palette-backdrop") &&
        interactive.getAttribute("aria-label") !== "Close search"
      ) {
        const rect = interactive.getBoundingClientRect();
        if (rect.width > 0 && rect.width <= 260 && rect.height <= 72) magnet = interactive;
      }
    }

    function hide() {
      visible = false;
      magnet = null;
      mode = "";
      root.classList.remove("is-on", "is-press", "is-link", "is-text");
      running = false;
      cancelAnimationFrame(raf);
    }

    function frame(now: number) {
      const dt = last === 0 ? 16 : Math.min(34, now - last);
      last = now;

      let aimX = pointerX;
      let aimY = pointerY;
      if (magnet?.isConnected) {
        const rect = magnet.getBoundingClientRect();
        if (rect.width > 0 && rect.width <= 260 && rect.height <= 72) {
          let offsetX = (rect.left + rect.width / 2 - pointerX) * 0.42;
          let offsetY = (rect.top + rect.height / 2 - pointerY) * 0.42;
          const distance = Math.hypot(offsetX, offsetY);
          if (distance > 16) {
            offsetX = (offsetX / distance) * 16;
            offsetY = (offsetY / distance) * 16;
          }
          aimX = pointerX + offsetX;
          aimY = pointerY + offsetY;
        } else {
          magnet = null;
        }
      }

      const follow = 1 - Math.exp(-dt / 46);
      ringX += (aimX - ringX) * follow;
      ringY += (aimY - ringY) * follow;
      place(dot, pointerX, pointerY);
      place(ring, ringX, ringY);

      if (Math.abs(aimX - ringX) < 0.2 && Math.abs(aimY - ringY) < 0.2) {
        ringX = aimX;
        ringY = aimY;
        place(ring, ringX, ringY);
        running = false;
        return;
      }

      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    }

    function onPointerMove(event: PointerEvent) {
      if (!enabled() || event.pointerType === "touch") {
        active = false;
        hide();
        syncCursorClass();
        return;
      }

      active = true;
      syncCursorClass();
      pointerX = event.clientX;
      pointerY = event.clientY;
      readTarget(event.target);

      if (!visible) {
        visible = true;
        ringX = pointerX;
        ringY = pointerY;
        place(dot, pointerX, pointerY);
        place(ring, ringX, ringY);
        root.classList.add("is-on");
      }

      start();
    }

    function onScroll() {
      if (!visible) return;
      readTarget(document.elementFromPoint(pointerX, pointerY));
      start();
    }

    function onLeave() {
      active = false;
      hide();
      syncCursorClass();
    }

    function onPress() {
      if (!visible) return;
      root.classList.add("is-press");
    }

    function onRelease() {
      root.classList.remove("is-press");
    }

    function onMedia() {
      if (!enabled()) onLeave();
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPress, { passive: true });
    window.addEventListener("pointerup", onRelease, { passive: true });
    window.addEventListener("pointercancel", onRelease, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    fine.addEventListener("change", onMedia);
    reduced.addEventListener("change", onMedia);

    return () => {
      active = false;
      hide();
      syncCursorClass();
      classObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPress);
      window.removeEventListener("pointerup", onRelease);
      window.removeEventListener("pointercancel", onRelease);
      window.removeEventListener("scroll", onScroll, { capture: true });
      document.documentElement.removeEventListener("mouseleave", onLeave);
      fine.removeEventListener("change", onMedia);
      reduced.removeEventListener("change", onMedia);
    };
  }, []);

  return (
    <div ref={rootRef} className="site-cursor" aria-hidden="true">
      <div className="site-cursor-ring">
        <span className="site-cursor-ring-mark" />
      </div>
      <div className="site-cursor-dot">
        <span className="site-cursor-dot-mark" />
      </div>
    </div>
  );
}
