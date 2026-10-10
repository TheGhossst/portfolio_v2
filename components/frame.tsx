import type { ReactNode } from "react";

export function Frame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-[1120px] px-6 md:px-10 lg:px-16 ${className}`}>{children}</div>
  );
}

export function Spread({
  id,
  label,
  children,
  rule = true,
}: {
  id?: string;
  label?: ReactNode;
  children: ReactNode;
  rule?: boolean;
}) {
  return (
    <section id={id}>
      <Frame>
        <div className={rule ? "border-t border-rule py-14 md:py-20" : "pb-16 pt-16 md:pb-20 md:pt-24"}>
          <div className="grid gap-5 md:grid-cols-[9.5rem_minmax(0,1fr)] md:gap-x-12">
            <div>{label}</div>
            <div className="min-w-0">{children}</div>
          </div>
        </div>
      </Frame>
    </section>
  );
}

export function Meta({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`font-mono text-[0.72rem] uppercase leading-[1.45] tracking-[0.14em] text-ink-soft ${className}`}>
      {children}
    </p>
  );
}
