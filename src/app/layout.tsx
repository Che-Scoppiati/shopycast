import type { Metadata } from "next";
import "@/app/globals.css";
import Providers from "@/app/providers";
import { Outfit } from "next/font/google";

const inter = Outfit({ subsets: ["latin"] });

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
        <Providers>
          <main className="flex min-h-screen flex-col items-center justify-between p-20 pt-10">
            <div className="w-full flex flex-col gap-16 max-w-[1800px]">
              {children}
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
