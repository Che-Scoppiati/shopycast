import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { NextUIProvider } from "@nextui-org/react";

const inter = Inter({ subsets: ["latin"] });

const description = "Onchain Shop.";
export const metadata: Metadata = {
  title: "Onchain Shop",
  description: description,
  openGraph: {
    title: "Onchain Shop",
    description: description,
    type: "website",
    url: "https://build.top",
    images: [
      "https://build-top-images.s3.eu-west-2.amazonaws.com/BUILD-thumbnail.jpg?1",
    ],
  },
  twitter: {
    title: "Onchain Shop",
    description: description,
    images: [
      "https://build-top-images.s3.eu-west-2.amazonaws.com/BUILD-thumbnail.jpg?1",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-zinc-900`}>
        <NextUIProvider>{children}</NextUIProvider>
      </body>
    </html>
  );
}
