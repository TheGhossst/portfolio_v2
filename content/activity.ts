export type Activity = {
  date: string;
  dateLabel: string;
  text: string;
  href?: string;
};

export const activity: Activity[] = [
  {
    date: "2026-10-02",
    dateLabel: "02 Oct 2026",
    text: "Writing down why a UAV twin has to include the network constraint, not only the flight.",
    href: "/notes/why-the-twin-is-not-the-system",
  },
  {
    date: "2026-09-28",
    dateLabel: "28 Sep 2026",
    text: "Sketching an ECG mask over the QRS, before choosing anything that could be called a model.",
    href: "/notes/what-the-mask-is-for",
  },
  {
    date: "2026-09-02",
    dateLabel: "02 Sep 2026",
    text: "Pausing the tools list until a problem can be stated without a stack attached.",
    href: "/work/tools-worth-building",
  },
];
