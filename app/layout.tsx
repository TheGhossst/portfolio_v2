import type { Metadata } from "next";
import { IBM_Plex_Mono, Newsreader, Source_Sans_3 } from "next/font/google";
import { CommandPalette } from "@/components/command-palette";
import { InlineScript } from "@/components/inline-script";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/content/site";
import { THEME_STORAGE_KEY } from "@/lib/theme";
import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  variable: "--font-newsreader",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} — ${site.title}`,
    template: `%s — ${site.title}`,
  },
  description: site.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sourceSans.variable} ${newsreader.variable} ${plexMono.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-paper font-sans text-ink">
        <InlineScript
          html={`(function(){try{if(localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)})==="dark")document.documentElement.classList.add("dark")}catch(e){}})()`}
        />
        <a href="#content" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <main id="content" tabIndex={-1} className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <CommandPalette />
      </body>
    </html>
  );
}
