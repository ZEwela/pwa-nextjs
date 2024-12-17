import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utilis/supabase/server";
import { signOutAction } from "./actions";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PWA NextJS",
  description: "It's a simple progressive web application made with NextJS",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["nextjs", "next14", "pwa", "next-pwa"],
  authors: [
    {
      name: "ewelaZ",
      url: "https://www.linkedin.com/in/ewelina-zawol-94526998/",
    },
  ],
  icons: [
    { rel: "apple-touch-icon", url: "abstract-128-mascable.png" },
    { rel: "icon", url: "abstract-128-mascable.png" },
  ],
};

export const themeColor = [
  { media: "(prefers-color-scheme: dark)", color: "#ffffff" },
];

export const viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  shrinkToFit: "no",
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full flex flex-col`}
      >
        {/* Navbar */}
        <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
          <Link href={"/"} className="text-lg font-bold">
            MyApp
          </Link>
          {user ? (
            <div className="flex items-center gap-4">
              Hey, {user.email}!
              <form action={signOutAction}>
                <Button type="submit" variant={"outline"}>
                  Sign out
                </Button>
              </form>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button asChild size="sm" variant={"outline"}>
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild size="sm" variant={"default"}>
                <Link href="/sign-up">Sign up</Link>
              </Button>
            </div>
          )}
        </nav>

        {/* Main content */}
        <main className="flex-grow px-6 py-8">{children}</main>

        {/* Footer */}
        <footer className="bg-gray-100 text-gray-700 py-4">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <p>© 2024 MyApp</p>
            <Link href="/privacy-policy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms of Service
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
