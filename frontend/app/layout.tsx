import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MEALORA | Smart Meals. Simple Living.",
  description: "Personalized meal planning and smart grocery lists designed around your lifestyle.",
};

import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${inter.variable} antialiased font-sans`}
        suppressHydrationWarning
      >
        <AuthProvider>
          {children}
          <Toaster richColors position="top-center" duration={4000} closeButton />
        </AuthProvider>
      </body>
    </html>
  );
}
