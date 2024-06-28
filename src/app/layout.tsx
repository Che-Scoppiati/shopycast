import type { Metadata } from "next";
import Providers from "@/app/providers";
import { Toaster } from "react-hot-toast";
import "@/app/globals.css";
import { Outfit } from "next/font/google";

const inter = Outfit({ subsets: ["latin"] });

const description = "Shopycast - Sell your Shopify products on Farcaster.";
export const metadata: Metadata = {
  title: "Shopycast",
  description: description,
  openGraph: {
    title: "Shopycast",
    description: description,
    type: "website",
    url: "https://shopycast.xyz",
    images: ["https://onchain-shop.vercel.app/images/logo.png"],
  },
  twitter: {
    title: "Shopycast",
    description: description,
    images: ["https://onchain-shop.vercel.app/images/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-gradient-to-br from-zinc-950 to-[#1c042f]`}
      >
        <Providers>
          <main className="dark flex min-h-screen flex-col items-center justify-between p-20 pt-10 pb-10">
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  fontSize: "1.25rem",
                  padding: "0.6rem 1.1rem",
                },
                success: {
                  style: {
                    background: "#daa3ff",
                  },
                  iconTheme: {
                    primary: "#a620ff",
                    secondary: "white",
                  },
                },
              }}
            />
            <div className="w-full flex flex-col gap-16 max-w-[1800px]">
              {children}
            </div>
            <p className="text-sm text-default-500 pt-28">
              built with ❤️‍🔥 by builders.garden 🤝 che scoppiati
            </p>
          </main>
        </Providers>
      </body>
    </html>
  );
}
