import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

const IBMPlex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex'
});


export const metadata: Metadata = {
  title: "Learnigng AI Assistant",
  description: "Learning AI Assistant is a platform to help you prepare for your exams. It provides you with previous year questions, coding questions, and other resources to help you prepare for your exams.",
  keywords: ["AI", "Assistant", "Learning", "Exams", "Questions", "Coding", "Resources"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" style={{ scrollBehavior: "smooth"}}>
      <body className={cn("font-IBMPlex antialiased", IBMPlex.variable)}>
        {children}
      </body>
    </html>
  );
}