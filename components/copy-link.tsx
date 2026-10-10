"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { asides } from "@/content/site";

export function CopyLink() {
  const pathname = usePathname();
  const [seenPath, setSeenPath] = useState(pathname);
  const [notice, setNotice] = useState<{ text: string; id: number } | null>(null);

  if (pathname !== seenPath) {
    setSeenPath(pathname);
    setNotice(null);
  }

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(null), 4200);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  async function onCopy() {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setNotice({ text: asides.copied, id: Date.now() });
      return;
    } catch {
      /* Some browsers only allow the older copy path from a click. */
    }

    const field = document.createElement("textarea");
    field.value = url;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.left = "-9999px";
    document.body.append(field);
    field.select();
    const copied = document.execCommand("copy");
    field.remove();
    setNotice({ text: copied ? asides.copied : asides.copyFailed, id: Date.now() });
  }

  return (
    <div className="flex max-w-[18rem] flex-col items-start gap-1.5 md:items-end">
      <button
        type="button"
        onClick={onCopy}
        className="w-fit uppercase tracking-[0.12em] underline decoration-sage underline-offset-[3px] hover:text-ink"
      >
        Copy link
      </button>
      <p
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={
          notice
            ? "font-serif text-[1.05rem] italic leading-snug tracking-normal text-ink normal-case text-pretty md:text-right"
            : "sr-only"
        }
      >
        {notice?.text ?? ""}
      </p>
    </div>
  );
}
