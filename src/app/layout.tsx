import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import ShaderBackground from "@/components/ShaderBackground";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "IdeaVault | Premium Idea Management",
  description: "Capture and manage your ideas in a premium, secure environment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} h-full antialiased dark`}>
        <body className="relative min-h-full flex flex-col bg-transparent text-on-background font-body">
          <ShaderBackground />
          <div className="relative z-10 flex min-h-full flex-1 flex-col">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
