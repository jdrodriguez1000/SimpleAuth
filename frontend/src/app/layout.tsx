// [TSK-F-01] - Layout raíz con tipografías duales Inter + Manrope (UI Kit §3)
// [TSK-F-04] - Metadata de favicon e iconos configurada con assets SVG premium (G-11)
// [BLQ-H-01] - ThemeProvider de next-themes para persistencia de tema (UI Kit §5 / CC-001)
import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

/* Fuente body: Inter — máxima legibilidad (UI Kit §3) */
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

/* Fuente display: Manrope — precisión geométrica para headlines (UI Kit §3) */
const manrope = Manrope({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SimpleAuth",
  description: "Sistema de autenticación seguro y moderno",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${manrope.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {/* ThemeProvider: clase .dark en <html>, persistencia en localStorage (UI Kit §5) */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
