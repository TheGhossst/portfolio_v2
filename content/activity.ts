export type Activity = {
  date: string;
  dateLabel: string;
  text: string;
  href?: string;
};

export const activity: Activity[] = [
  {
    date: "2026-10-10",
    dateLabel: "10 Oct 2026",
    text: "Learning Go, and the shape of a backend an application can call.",
    href: "/now",
  },
  {
    date: "2026-10-10",
    dateLabel: "10 Oct 2026",
    text: "Filing the blockchain work: e-voting, and a patient consent record that can be granted and withdrawn.",
    href: "/work/e-voting",
  },
  {
    date: "2026-04-16",
    dateLabel: "16 Apr 2026",
    text: "Episode Alerts — a mobile app that follows shows and says when a new episode is out.",
    href: "/work/episode-alerts",
  },
];
