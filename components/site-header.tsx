"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SearchTrigger } from "@/components/command-palette";
import { Frame } from "@/components/frame";
import { ThemeToggle } from "@/components/theme-toggle";
import profile from "@/content/profile.json";
import { navLinks, site } from "@/content/site";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [seenPath, setSeenPath] = useState(pathname);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  if (pathname !== seenPath) {
    setSeenPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    function onSearch() {
      setOpen(false);
    }
    window.addEventListener("archive:open-palette", onSearch);
    return () => window.removeEventListener("archive:open-palette", onSearch);
  }, []);

  useEffect(() => {
    if (!open) return;
    firstLinkRef.current?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-30 bg-paper no-print">
      <Frame>
        <div className="flex items-center justify-between gap-4 border-b border-rule py-4">
          <div className="flex min-w-0 items-baseline gap-5">
            <Link href="/" className="font-serif text-[1.02rem] lowercase leading-none tracking-[-0.01em] text-ink">
              {profile.name}
              <span className="text-ink-soft"> / {site.wordmarkRest}</span>
            </Link>
            <Link
              href={site.statusHref}
              className="hidden items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink-soft xl:inline-flex"
            >
              <span className="size-1.5 rounded-full bg-sage" aria-hidden="true" />
              {site.statusLabel}
            </Link>
          </div>
          <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
            {navLinks.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={
                    active
                      ? "text-[0.9375rem] underline decoration-sage decoration-2 underline-offset-[6px]"
                      : "text-[0.9375rem] text-ink underline decoration-transparent underline-offset-[6px] hover:decoration-sage"
                  }
                >
                  {link.label}
                </Link>
              );
            })}
            <ThemeToggle />
            <SearchTrigger className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-soft hover:text-ink">
              Search
            </SearchTrigger>
          </nav>
          <div className="flex shrink-0 items-center gap-4 md:hidden">
            <ThemeToggle />
            <button
              ref={menuButtonRef}
              type="button"
              className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </Frame>
      {open ? (
        <nav id="mobile-nav" aria-label="Primary" className="border-b border-rule md:hidden">
          <Frame>
            <ul className="flex flex-col py-2">
              <li className="border-b border-rule">
                <Link
                  ref={firstLinkRef}
                  href={site.statusHref}
                  className="flex items-center gap-2 py-3 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink-soft"
                >
                  <span className="size-1.5 rounded-full bg-sage" aria-hidden="true" />
                  {site.statusLabel}
                </Link>
              </li>
              {navLinks.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <li key={link.href} className="border-b border-rule">
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className="block py-3 text-[0.9375rem]"
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
              <li>
                <SearchTrigger className="py-3 font-mono text-[0.72rem] uppercase tracking-[0.14em]">
                  Search
                </SearchTrigger>
              </li>
            </ul>
          </Frame>
        </nav>
      ) : null}
    </header>
  );
}
