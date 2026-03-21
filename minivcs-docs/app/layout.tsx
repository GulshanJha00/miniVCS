import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "MiniVCS",
  description: "Faster than git. just use in your project, because it always fit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
    <html lang="en">
      <body>
        <div className="flex">


          {/* Content */}
          <main className="flex-1 px-20 py-14">
            {children}
          </main>

        </div>
      </body>
    </html>
  )
}
