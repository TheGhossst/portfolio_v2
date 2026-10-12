import type { Metadata } from "next";
import { IBM_Plex_Mono, Newsreader, Source_Sans_3 } from "next/font/google";
import { CommandPalette } from "@/components/command-palette";
import { InlineScript } from "@/components/inline-script";
import { SiteCursor } from "@/components/site-cursor";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import profile from "@/content/profile.json";
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

// The in-editor browser stamps data-cursor-ref onto the server HTML before hydration.
const stripCursorRefs = `(function(){function strip(node){if(!node||node.nodeType!==1)return;if(node.hasAttribute("data-cursor-ref"))node.removeAttribute("data-cursor-ref");var list=node.querySelectorAll("[data-cursor-ref]");for(var i=0;i<list.length;i++)list[i].removeAttribute("data-cursor-ref")}var root=document.documentElement;strip(root);new MutationObserver(function(records){for(var i=0;i<records.length;i++){var record=records[i];if(record.type==="attributes"){if(record.target.hasAttribute("data-cursor-ref"))record.target.removeAttribute("data-cursor-ref");continue}var nodes=record.addedNodes;for(var j=0;j<nodes.length;j++)strip(nodes[j])}}).observe(root,{subtree:true,childList:true,attributes:true,attributeFilter:["data-cursor-ref"]})})();`;

export const metadata: Metadata = {
  title: {
    default: `${profile.name} — ${site.title}`,
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
        {process.env.NODE_ENV === "development" ? <InlineScript html={stripCursorRefs} /> : null}
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
        <SiteCursor />
      </body>
    </html>
  );
}
