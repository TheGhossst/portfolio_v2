"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { filterPalette, paletteItems, type PaletteItem } from "@/lib/archive";

const PALETTE_EVENT = "archive:open-palette";
const GROUPS = ["Projects", "Notes", "On this page", "Go to"] as const;

export function SearchTrigger({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <button
      type="button"
      className={className}
      aria-haspopup="dialog"
      aria-keyshortcuts="Control+K Meta+K"
      aria-label="Search the archive"
      onClick={() => window.dispatchEvent(new Event(PALETTE_EVENT))}
    >
      {children}
    </button>
  );
}

export function CommandPalette() {
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const openRef = useRef(false);
  const titleId = useId();
  const listId = useId();
  const [open, setOpen] = useState(false);
  openRef.current = open;
  const [seenPath, setSeenPath] = useState(pathname);
  if (pathname !== seenPath) {
    setSeenPath(pathname);
    setOpen(false);
  }
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const items = paletteItems().filter((item) => item.group !== "On this page" || pathname === "/");
  const filtered = filterPalette(items, query);
  const safeActive = filtered.length === 0 ? 0 : Math.min(active, filtered.length - 1);
  const activeId = filtered[safeActive] ? `palette-${filtered[safeActive].id}` : undefined;

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target instanceof HTMLElement ? event.target : null;
      const typing =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        Boolean(target?.isContentEditable);

      if (event.key === "Escape" && openRef.current) {
        event.preventDefault();
        setOpen(false);
        setQuery("");
        setActive(0);
        return;
      }

      if ((event.key === "k" || event.key === "K") && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
        setQuery("");
        setActive(0);
        return;
      }

      if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        setOpen(true);
        setQuery("");
        setActive(0);
      }
    }

    function onOpen() {
      setOpen(true);
      setQuery("");
      setActive(0);
    }

    window.addEventListener("keydown", onKey);
    window.addEventListener(PALETTE_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(PALETTE_EVENT, onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    inputRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      if (previous && document.contains(previous)) previous.focus();
    };
  }, [open]);

  function revealActive(index: number) {
    const item = filtered[index];
    if (!item) return;
    document.getElementById(`palette-${item.id}`)?.scrollIntoView({ block: "nearest" });
  }

  function closePalette() {
    setOpen(false);
    setQuery("");
    setActive(0);
  }

  function go(item: PaletteItem | undefined) {
    if (!item) return;
    closePalette();
    if (item.href.startsWith("mailto:")) {
      window.location.href = item.href;
      return;
    }
    if (item.href.startsWith("http")) {
      window.open(item.href, "_blank", "noopener,noreferrer");
      return;
    }
    router.push(item.href);
  }

  if (!open) return null;

  let optionIndex = 0;

  return (
    <div className="palette-layer">
      <button type="button" tabIndex={-1} className="palette-backdrop" aria-label="Close search" onClick={closePalette} />
      <div role="dialog" aria-modal="true" aria-labelledby={titleId} className="palette @container">
        <h2 id={titleId} className="sr-only">
          Search the archive
        </h2>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            go(filtered[safeActive]);
          }}
        >
          <div className="flex items-baseline gap-6 border-b border-rule px-5">
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActive(0);
              }}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  const next = Math.min(safeActive + 1, Math.max(filtered.length - 1, 0));
                  setActive(next);
                  revealActive(next);
                } else if (event.key === "ArrowUp") {
                  event.preventDefault();
                  const next = Math.max(safeActive - 1, 0);
                  setActive(next);
                  revealActive(next);
                } else if (event.key === "Home") {
                  event.preventDefault();
                  setActive(0);
                  revealActive(0);
                } else if (event.key === "End") {
                  event.preventDefault();
                  const next = Math.max(filtered.length - 1, 0);
                  setActive(next);
                  revealActive(next);
                }
              }}
              placeholder="Projects, notes, and pages"
              className="min-w-0 flex-1 bg-transparent py-4 font-serif text-[1.35rem] leading-snug text-ink outline-none placeholder:text-ink-soft"
              role="combobox"
              aria-expanded={open}
              aria-controls={listId}
              aria-activedescendant={open ? activeId : undefined}
              aria-autocomplete="list"
              autoComplete="off"
            />
            <button
              type="button"
              onClick={closePalette}
              className="shrink-0 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-soft hover:text-ink"
            >
              Close
            </button>
          </div>
        </form>
        <div id={listId} role="listbox" aria-label="Search results" className="palette-results">
          {filtered.length === 0 ? (
            <p className="px-5 py-8 text-ink-soft">Nothing filed under that name.</p>
          ) : (
            GROUPS.map((group) => {
              const groupItems = filtered.filter((item) => item.group === group);
              if (groupItems.length === 0) return null;
              return (
                <div key={group}>
                  <p className="px-5 pb-1 pt-5 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink-soft">
                    {group}
                  </p>
                  <ul className="border-t border-rule">
                    {groupItems.map((item) => {
                      const index = optionIndex;
                      optionIndex += 1;
                      const selected = index === safeActive;
                      return (
                        <li key={item.id} className="border-b border-rule">
                          <button
                            type="button"
                            id={`palette-${item.id}`}
                            role="option"
                            aria-selected={selected}
                            className="palette-option"
                            onMouseEnter={() => setActive(index)}
                            onClick={() => go(item)}
                          >
                            <span className="min-w-0 truncate font-serif text-[1.15rem] leading-snug">{item.label}</span>
                            <span className="font-mono text-[0.72rem] text-ink-soft @min-[28rem]:text-right">
                              {item.hint}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
