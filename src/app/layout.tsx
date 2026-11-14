import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import JoinPopup from "@/components/JoinPopup";
import { site } from "@/site.config";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.balloutboysathletics.com"),
  title: { default: `${site.name} | Baseball & Softball Player Development · Metro Atlanta`, template: `%s | ${site.name}` },
  description:
    "BallOutBoys Athletics is a baseball and softball player development program in metro Atlanta. Memberships, summer program, 1-on-1 lessons, merch and the How To Move Like A Pro ebook.",
  openGraph: { siteName: site.name, type: "website", images: ["/brand/logo-transparent.png"] },
};

export const viewport: Viewport = { themeColor: "#06080c", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,700;0,800;1,700;1,800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <Reveal />
        <JoinPopup />
      </body>
    </html>
  );
}
