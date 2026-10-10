import type { ReactNode } from "react";

const ink = "var(--ink)";
const soft = "var(--ink-soft)";
const sage = "var(--sage)";
const wash = "var(--sage-light)";
const paper = "var(--paper)";

export function ProjectDiagram({ slug, className = "h-auto w-full" }: { slug: string; className?: string }) {
  if (slug === "uav-digital-twin") return <UavDiagram className={className} />;
  if (slug === "ecg-jepa") return <EcgDiagram className={className} />;
  return <ToolsDiagram className={className} />;
}

function Diagram({ className, children }: { className: string; children: ReactNode }) {
  return (
    <svg viewBox="0 0 260 188" className={`font-mono ${className}`} aria-hidden="true">
      {children}
    </svg>
  );
}

function Uav({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="11" fill={paper} stroke={ink} strokeWidth="1.25" />
      <path d="M0 -11 V-17" fill="none" stroke={ink} strokeWidth="1.25" />
      <path d="M0 -4.5 L3.6 3.2 H-3.6 Z" fill={ink} />
    </g>
  );
}

function UavDiagram({ className }: { className: string }) {
  const vehicles = [
    { x: 64, y: 42 },
    { x: 132, y: 36 },
    { x: 98, y: 92 },
  ];

  return (
    <Diagram className={className}>
      <g fill="none" stroke={ink} strokeWidth="1.25" strokeDasharray="2.75 2.4">
        <line x1="64" y1="42" x2="132" y2="36" />
        <line x1="64" y1="42" x2="98" y2="92" />
        <line x1="132" y1="36" x2="98" y2="92" />
        <line x1="98" y1="92" x2="46" y2="128" />
      </g>
      <text x="176" y="28" fill={soft} fontSize="12">
        limit
      </text>
      <path d="M230 40 H244 V122 H230" fill="none" stroke={sage} strokeWidth="1.25" />
      {[0, 1, 2, 3].map((slot) => {
        const allocated = slot === 0 || slot === 2;
        return (
          <rect
            key={slot}
            x="178"
            y={44 + slot * 20}
            width="40"
            height="14"
            fill={allocated ? wash : paper}
            stroke={allocated ? sage : ink}
            strokeWidth="1.25"
          />
        );
      })}
      <text x="178" y="140" fill={soft} fontSize="12">
        band
      </text>
      {vehicles.map((vehicle) => (
        <Uav key={`${vehicle.x}-${vehicle.y}`} x={vehicle.x} y={vehicle.y} />
      ))}
      <rect x="18" y="128" width="56" height="28" fill={paper} stroke={ink} strokeWidth="1.25" />
      <path d="M46 128 V114 M36 114 H56" fill="none" stroke={ink} strokeWidth="1.25" />
      <text x="46" y="146" fill={ink} fontSize="12" textAnchor="middle">
        gcs
      </text>
    </Diagram>
  );
}

function Arrow({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x} ${y} H${x + 12}`} fill="none" stroke={ink} strokeWidth="1.25" />
      <polygon points={`${x + 12},${y - 3.2} ${x + 18},${y} ${x + 12},${y + 3.2}`} fill={ink} />
    </g>
  );
}

function LabelBox({
  x,
  y,
  width,
  label,
  tone = "ink",
}: {
  x: number;
  y: number;
  width: number;
  label: string;
  tone?: "ink" | "sage";
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height="32"
        fill={tone === "sage" ? wash : paper}
        stroke={tone === "sage" ? sage : ink}
        strokeWidth="1.25"
      />
      <text x={x + width / 2} y={y + 21} fill={ink} fontSize="12" textAnchor="middle">
        {label}
      </text>
    </g>
  );
}

function Embedding({ x, y, hat }: { x: number; y: number; hat?: boolean }) {
  const cx = x + 22;
  return (
    <g>
      <rect x={x} y={y} width="44" height="32" fill={paper} stroke={ink} strokeWidth="1.25" />
      <text x={cx} y={y + 22} fill={ink} fontSize="13" textAnchor="middle">
        z
      </text>
      {hat ? (
        <path
          d={`M${cx - 4.5} ${y + 8} L${cx} ${y + 4.5} L${cx + 4.5} ${y + 8}`}
          fill="none"
          stroke={ink}
          strokeWidth="1.15"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : null}
    </g>
  );
}

function EcgDiagram({ className }: { className: string }) {
  return (
    <Diagram className={className}>
      <text x="112" y="12" fill={soft} fontSize="12" textAnchor="middle">
        QRS
      </text>
      <text x="42" y="44" fill={soft} fontSize="12" textAnchor="middle">
        P
      </text>
      <text x="198" y="34" fill={soft} fontSize="12" textAnchor="middle">
        T
      </text>
      <path
        d="M12 64 H28 C34 64 38 56 44 53 C50 50 56 64 62 64 H78"
        fill="none"
        stroke={ink}
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="78" y="18" width="70" height="78" fill={wash} stroke={sage} strokeWidth="1.25" />
      <path
        d="M82 64 H90 L97 74 L109 22 L121 88 L130 64 H144"
        fill="none"
        stroke={sage}
        strokeWidth="1.35"
        strokeDasharray="2.4 1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M148 64 H162 C170 64 178 52 190 46 C200 40 210 64 218 64 H248"
        fill="none"
        stroke={ink}
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <LabelBox x={8} y={104} width={58} label="P, T" />
      <Arrow x={70} y={120} />
      <LabelBox x={92} y={104} width={72} label="context" />
      <Arrow x={168} y={120} />
      <Embedding x={190} y={104} hat />
      <LabelBox x={8} y={146} width={58} label="QRS" tone="sage" />
      <Arrow x={70} y={162} />
      <LabelBox x={92} y={146} width={72} label="target" />
      <Arrow x={168} y={162} />
      <Embedding x={190} y={146} />
      <path d="M242 108 H250 V174 H242" fill="none" stroke={sage} strokeWidth="1.25" />
    </Diagram>
  );
}

function ToolsDiagram({ className }: { className: string }) {
  const rows = [
    { label: "Problem", y: 8, index: "01" },
    { label: "Interface", y: 68, index: "02" },
    { label: "System", y: 128, index: "03" },
  ];

  return (
    <Diagram className={className}>
      {rows.map((row) => (
        <g key={row.label}>
          <text x="0" y={row.y + 30} fill={soft} fontSize="12">
            {row.index}
          </text>
          <rect x="32" y={row.y} width="216" height="52" fill={paper} stroke={ink} strokeWidth="1.25" />
          <line x1="32" y1={row.y} x2="32" y2={row.y + 52} stroke={sage} strokeWidth="2" />
          <text x="46" y={row.y + 31} fill={ink} fontSize="13">
            {row.label}
          </text>
        </g>
      ))}
      <g fill="none" stroke={soft} strokeWidth="1.15" strokeLinecap="round">
        <path d="M128 22 H214" />
        <path d="M128 34 H228" />
        <path d="M128 46 H176" />
      </g>
      <rect x="132" y="80" width="62" height="22" fill={paper} stroke={ink} strokeWidth="1.25" />
      <path d="M140 91 H182" fill="none" stroke={soft} strokeWidth="1.15" strokeLinecap="round" />
      <circle cx="220" cy="91" r="8" fill={paper} stroke={ink} strokeWidth="1.25" />
      <circle cx="220" cy="91" r="2.2" fill={sage} />
      <rect x="132" y="141" width="48" height="26" fill={paper} stroke={ink} strokeWidth="1.25" />
      <rect x="188" y="141" width="48" height="26" fill={paper} stroke={ink} strokeWidth="1.25" />
    </Diagram>
  );
}
