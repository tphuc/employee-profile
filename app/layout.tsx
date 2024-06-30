import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import QueryWrapper from "@/components/QueryWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Employee Profile Management",
  description: "Created by TBP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <QueryWrapper>
        <body className={inter.className}>

          {children}
          {/* <Analytics /> */}
          <Toaster />

        </body>
      </QueryWrapper>
    </html>
  );
}
