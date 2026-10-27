import type { Metadata, Viewport } from "next";
import { Anton, Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const anton = Anton({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif-accent",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fabrizio Saunero — Built by Experience. Driven by Purpose.",
  description:
    "Portfolio of Fabrizio Saunero: student-athlete, community volunteer and young entrepreneur from La Paz, Bolivia. From Bolivia's 4th Division to Primera A, state champion, varsity captain, Operation Smile fundraiser and hands-on builder ready for college.",
  keywords: [
    "Fabrizio Saunero",
    "student athlete",
    "soccer",
    "La Paz",
    "Bolivia",
    "portfolio",
    "college recruiting",
    "Primera A",
    "Operation Smile",
  ],
  authors: [{ name: "Fabrizio Saunero" }],
  openGraph: {
    title: "Fabrizio Saunero — Built by Experience. Driven by Purpose.",
    description:
      "Student-athlete, volunteer and entrepreneur from La Paz, Bolivia. Athletics & leadership, service & community, entrepreneurship & work, independence & life skills.",
    type: "profile",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0b0d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${anton.variable} ${inter.variable} ${instrumentSerif.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
