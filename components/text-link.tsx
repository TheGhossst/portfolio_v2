import Link from "next/link";
import type { ReactNode } from "react";

export function TextLink({
  href,
  children,
  className = "",
  external = false,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
}) {
  const classes = `underline decoration-sage decoration-1 underline-offset-[3px] transition-colors duration-150 hover:decoration-ink ${className}`;
  const isExternal = external || href.startsWith("http");

  if (isExternal || href.startsWith("mailto:")) {
    return (
      <a
        href={href}
        className={classes}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
