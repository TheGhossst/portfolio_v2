"use client";

import { useEffect, useRef } from "react";

const TEXTUAL =
  "input:not([type='button']):not([type='submit']):not([type='reset']):not([type='checkbox']):not([type='radio']), textarea, select, [contenteditable='true']";
const INTERACTIVE = "a[href], button, summary, [role='button'], label[for]";

export function SiteCursor() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rootNode = rootRef.current;
    if (!rootNode) return;

    const dotNode = rootNode.querySelector<HTMLElement>(".site-cursor-dot");
    const ringNode = rootNode.querySelector<HTMLElement>(".site-cursor-ring");
    const motionNode = rootNode.querySelector<HTMLElement>(".site-cursor-ring-motion");
    const labelNode = rootNode.querySelector<HTMLElement>(".site-cursor-label");
    const ripples = [...rootNode.querySelectorAll<HTMLElement>(".site-cursor-ripple")];
    if (!dotNode || !ringNode || !motionNode || !labelNode || ripples.length === 0) return;

    const root: HTMLDivElement = rootNode;
    const dot: HTMLElement = dotNode;
    const ring: HTMLElement = ringNode;
    const motion: HTMLElement = motionNode;
    const label: HTMLElement = labelNode;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let pointerX = 0;
    let pointerY = 0;
    let ringX = 0;
    let ringY = 0;
    let sampleX = 0;
    let sampleY = 0;
    let vx = 0;
    let vy = 0;
    let angle = 0;
    let stretch = 1;
    let moved = false;
    let last = 0;
    let raf = 0;
    let idleTimer = 0;
    let rippleIndex = 0;
    let running = false;
    let visible = false;
    let active = false;
    let mode = "";
    let labelText = "";
    let magnet: HTMLElement | null = null;
    let lit: HTMLElement | null = null;
    let figure: SVGElement | null = null;
    let labeledEl: Element | null = null;

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
      root.classList.toggle("is-mark", next === "mark");
    }

    function applyLabel(text: string) {
      if (text === labelText) return;
      labelText = text;
      label.textContent = text;
      root.classList.toggle("has-label", text.length > 0);
    }

    function clip(value: string) {
      const clean = value.replace(/\s+/g, " ").trim().toLowerCase();
      if (!clean) return "";
      return clean.length > 32 ? `${clean.slice(0, 30)}…` : clean;
    }

    function labelFor(el: HTMLElement) {
      if (el.closest(".palette, .skip-link")) return "";
      const custom = el.getAttribute("data-cursor")?.trim();
      if (custom) return clip(custom);

      if (el instanceof HTMLAnchorElement) {
        const href = el.getAttribute("href") ?? "";
        if (href.startsWith("mailto:")) return clip(href.slice("mailto:".length).split("?")[0] || "email");
        if (/^https?:/i.test(href)) {
          try {
            return clip(new URL(href).host.replace(/^www\./, ""));
          } catch {
            return "external";
          }
        }

        let url: URL;
        try {
          url = new URL(href, window.location.href);
        } catch {
          return "";
        }

        if (url.search) return clip(el.innerText.replace(/\s+/g, " ") || "filter");

        const samePage = url.pathname === window.location.pathname;
        const path = samePage && url.hash ? url.hash.slice(1) : `${url.pathname}${url.hash}`;
        return clip(path.replace(/^\//, "").replace(/#/g, " · ") || "home");
      }

      const visible = el.innerText.replace(/\s+/g, " ").trim();
      if (visible) return clip(visible);
      return clip(el.getAttribute("aria-label") ?? "");
    }

    function restLabel() {
      const hit = document.elementFromPoint(pointerX, pointerY);
      const placeName =
        hit instanceof Element ? hit.closest<HTMLElement>("aside[id], section[id]") : null;
      if (placeName?.id && placeName.id.length <= 24) return placeName.id.replace(/-/g, " ");
      const x = Math.round(pointerX).toString().padStart(4, "0");
      const y = Math.round(pointerY).toString().padStart(4, "0");
      return `${x} · ${y}`;
    }

    function shiftOf(el: Element) {
      const value = getComputedStyle(el).transform;
      if (!value || value === "none") return { x: 0, y: 0 };
      const matrix = new DOMMatrix(value);
      return { x: matrix.m41, y: matrix.m42 };
    }

    function setLit(next: HTMLElement | null) {
      if (next && !next.isConnected) next = null;
      if (lit === next) return;
      lit?.classList.remove("is-cursor-lit");
      lit = next;
      next?.classList.add("is-cursor-lit");
    }

    function findSpot(element: Element | null) {
      if (!element || element.closest(".palette")) return null;
      return element.closest<HTMLElement>(".cursor-field");
    }

    function nudge(el: SVGElement) {
      const rect = el.getBoundingClientRect();
      const shift = shiftOf(el);
      const cx = rect.left + rect.width / 2 - shift.x;
      const cy = rect.top + rect.height / 2 - shift.y;
      const dx = pointerX - cx;
      const dy = pointerY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < 1) {
        el.style.transform = "translate3d(0, 0, 0)";
        return;
      }
      const mag = Math.min(5, dist * 0.04);
      el.style.transform = `translate3d(${(dx / dist) * mag}px, ${(dy / dist) * mag}px, 0)`;
    }

    function setFigure(next: SVGElement | null) {
      if (figure === next) {
        if (next) nudge(next);
        return;
      }
      if (figure) figure.style.transform = "";
      figure = next;
      if (next) nudge(next);
    }

    function updatePulls() {
      document.querySelectorAll<HTMLElement>(".cursor-pull").forEach((el) => {
        const rect = el.getBoundingClientRect();
        const shift = shiftOf(el);
        const cx = rect.left + rect.width / 2 - shift.x;
        const cy = rect.top + rect.height / 2 - shift.y;
        if (rect.width === 0 || cy < -240 || cy > window.innerHeight + 240) {
          if (el.style.transform) el.style.transform = "";
          return;
        }
        const dx = pointerX - cx;
        const dy = pointerY - cy;
        const dist = Math.hypot(dx, dy);
        const reach = 460;
        if (dist < 0.5 || dist > reach) {
          if (el.style.transform) el.style.transform = "";
          return;
        }
        const max = Number(el.dataset.pull);
        const strength = (1 - dist / reach) ** 2 * (Number.isFinite(max) && max > 0 ? max : 8);
        el.style.transform = `translate3d(${(dx / dist) * strength}px, ${(dy / dist) * strength}px, 0)`;
      });
    }

    function resetPulls() {
      document.querySelectorAll<HTMLElement>(".cursor-pull").forEach((el) => {
        el.style.transform = "";
      });
    }

    function readTarget(target: EventTarget | null) {
      const element = target instanceof Element ? target : null;
      const textual = element?.closest(TEXTUAL);
      const graphic = textual ? null : element?.closest("svg.cursor-figure");
      const interactive = textual ? null : element?.closest(INTERACTIVE);
      setMode(textual ? "text" : graphic ? "mark" : interactive ? "link" : "default");

      magnet = null;
      if (
        !graphic &&
        interactive instanceof HTMLElement &&
        !interactive.classList.contains("palette-backdrop") &&
        interactive.getAttribute("aria-label") !== "Close search"
      ) {
        const rect = interactive.getBoundingClientRect();
        if (rect.width > 0 && rect.width <= 260 && rect.height <= 72) magnet = interactive;
      }

      if (textual || interactive?.closest(".palette, .skip-link")) {
        labeledEl = null;
        applyLabel("");
      } else if (interactive instanceof HTMLElement) {
        if (interactive !== labeledEl) {
          labeledEl = interactive;
          applyLabel(labelFor(interactive));
        }
      } else if (graphic) {
        if (graphic !== labeledEl) {
          labeledEl = graphic;
          applyLabel("figure");
        }
      } else {
        labeledEl = null;
        applyLabel("");
      }

      setLit(textual ? null : findSpot(element));
      setFigure(graphic instanceof SVGElement ? graphic : null);
    }

    function placeLabel() {
      root.classList.toggle("is-label-flip-x", pointerX > window.innerWidth - 220);
      root.classList.toggle("is-label-flip-y", pointerY < 72);
    }

    function enterRest() {
      if (!visible || mode === "text") return;
      root.classList.add("is-rest");
      if (mode === "default") applyLabel(restLabel());
    }

    function scheduleRest() {
      root.classList.remove("is-rest");
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(enterRest, 700);
    }

    function hide() {
      visible = false;
      magnet = null;
      mode = "";
      moved = false;
      vx = 0;
      vy = 0;
      angle = 0;
      stretch = 1;
      labelText = "";
      labeledEl = null;
      label.textContent = "";
      motion.style.transform = "";
      root.style.setProperty("--cursor-speed", "0");
      root.classList.remove(
        "is-on",
        "is-press",
        "is-link",
        "is-text",
        "is-mark",
        "is-rest",
        "has-label",
        "is-label-flip-x",
        "is-label-flip-y",
      );
      running = false;
      cancelAnimationFrame(raf);
      window.clearTimeout(idleTimer);
      setLit(null);
      setFigure(null);
      resetPulls();
    }

    function lerpAngle(from: number, to: number, t: number) {
      const delta = Math.atan2(Math.sin(to - from), Math.cos(to - from));
      return from + delta * t;
    }

    function frame(now: number) {
      const dt = last === 0 ? 16 : Math.min(34, now - last);
      last = now;

      const glide = 1 - Math.exp(-dt / 42);
      const instX = Math.max(-90, Math.min(90, moved ? pointerX - sampleX : 0));
      const instY = Math.max(-90, Math.min(90, moved ? pointerY - sampleY : 0));
      sampleX = pointerX;
      sampleY = pointerY;
      moved = false;
      vx += (instX - vx) * glide;
      vy += (instY - vy) * glide;

      const speed = Math.hypot(vx, vy);
      const marking = mode === "mark";
      const cap = mode === "link" ? 0.18 : marking ? 0 : 0.75;
      stretch += (1 + Math.min(cap, speed / 34) - stretch) * glide;
      if (marking) angle = lerpAngle(angle, 0, glide);
      else if (speed > 0.45) angle = lerpAngle(angle, Math.atan2(vy, vx), glide);
      motion.style.transform = `rotate(${angle}rad) scaleX(${stretch})`;
      root.style.setProperty("--cursor-speed", Math.min(1, speed / 18).toFixed(3));

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

      const gap = Math.hypot(aimX - ringX, aimY - ringY);
      const follow = 1 - Math.exp(-dt / (gap > 140 ? 16 : 46));
      ringX += (aimX - ringX) * follow;
      ringY += (aimY - ringY) * follow;
      place(dot, pointerX, pointerY);
      place(ring, ringX, ringY);

      const settled =
        Math.abs(aimX - ringX) < 0.2 &&
        Math.abs(aimY - ringY) < 0.2 &&
        Math.abs(stretch - 1) < 0.012 &&
        speed < 0.2 &&
        (!marking || Math.abs(angle) < 0.02);

      if (settled) {
        ringX = aimX;
        ringY = aimY;
        stretch = 1;
        vx = 0;
        vy = 0;
        if (marking) angle = 0;
        place(ring, ringX, ringY);
        motion.style.transform = marking ? "rotate(0rad) scaleX(1)" : `rotate(${angle}rad) scaleX(1)`;
        root.style.setProperty("--cursor-speed", "0");
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

    function burst(x: number, y: number) {
      const ripple = ripples[rippleIndex];
      rippleIndex = (rippleIndex + 1) % ripples.length;
      ripple.classList.remove("is-burst");
      place(ripple, x, y);
      void ripple.offsetWidth;
      ripple.classList.add("is-burst");
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
      moved = true;
      scheduleRest();
      readTarget(event.target);
      placeLabel();

      if (!visible) {
        visible = true;
        ringX = pointerX;
        ringY = pointerY;
        sampleX = pointerX;
        sampleY = pointerY;
        moved = false;
        place(dot, pointerX, pointerY);
        place(ring, ringX, ringY);
        root.classList.add("is-on");
      }

      if (mode === "text") resetPulls();
      else updatePulls();
      start();
    }

    function onScroll() {
      if (!visible) return;
      readTarget(document.elementFromPoint(pointerX, pointerY));
      if (root.classList.contains("is-rest") && mode === "default") applyLabel(restLabel());
      if (mode === "text") resetPulls();
      else updatePulls();
      start();
    }

    function onLeave() {
      active = false;
      hide();
      syncCursorClass();
    }

    function onPress(event: PointerEvent) {
      const x = (event.clientX / window.innerWidth) * 100;
      const y = (event.clientY / window.innerHeight) * 100;
      document.documentElement.style.setProperty("--ripple-x", `${x}%`);
      document.documentElement.style.setProperty("--ripple-y", `${y}%`);
      if (!visible || event.pointerType === "touch") return;
      root.classList.add("is-press");
      if (mode !== "text") burst(event.clientX, event.clientY);
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
      <span className="site-cursor-ripple">
        <i />
      </span>
      <span className="site-cursor-ripple">
        <i />
      </span>
      <span className="site-cursor-ripple">
        <i />
      </span>
      <div className="site-cursor-ring">
        <span className="site-cursor-ring-motion">
          <span className="site-cursor-ring-mark" />
        </span>
      </div>
      <div className="site-cursor-dot">
        <span className="site-cursor-ticks">
          <i />
          <i />
          <i />
          <i />
        </span>
        <span className="site-cursor-dot-mark" />
        <span className="site-cursor-label" />
      </div>
    </div>
  );
}
