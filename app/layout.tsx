import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { isClerkConfigured } from "@/lib/clerk-config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "1635Funcs — Everything happening at school",
    template: "%s · 1635Funcs",
  },
  description:
    "Find clubs, sports, meetings, fundraisers, and other events happening around your school.",
};

export const viewport: Viewport = {
  themeColor: "#050506",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full bg-background antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {isClerkConfigured ? (
          <ClerkProvider>
            <SiteHeader />
            <div className="flex-1">{children}</div>
            <SiteFooter />
          </ClerkProvider>
        ) : (
          <>
            <SiteHeader />
            <div className="flex-1">{children}</div>
            <SiteFooter />
          </>
        )}
      </body>
    </html>
  );
}
