import { FRAMES_BASE_PATH } from "@/lib/frames";
import { fetchMetadata } from "frames.js/next";
import { Metadata } from "next";
import { Navbar } from "./components/Navbar";
import { appURL } from "@/lib/utils";
import { LandingPageCard } from "./components/Home/LandingPageCard";
import { Suspense } from "react";
import { FaShopify } from "react-icons/fa";
import { SiFarcaster } from "react-icons/si";
import TopCard from "./components/Home/TopCard";
import { Image } from "@nextui-org/react";

export async function generateMetadata(): Promise<Metadata> {
  const epochTimestamp = new Date().getTime();
  const url = new URL(`${FRAMES_BASE_PATH}?t=${epochTimestamp}`, appURL());
  return {
    other: await fetchMetadata(url).catch(() => ({})),
  };
}

export default function Home() {
  const iconSize = 130;

  return (
    <>
      <Suspense>
        <Navbar />
      </Suspense>
      <div className="w-full flex flex-col gap-24 mt-5">
        <LandingPageCard />
        <div className="flex flex-col items-center gap-14">
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-5xl font-bold">It&apos;s super simple 😼</h2>
            <h3 className="text-3xl text-default-600">This time for real.</h3>
          </div>
          <div className="grid grid-cols-3 gap-14 max-w-[1160px]">
            <TopCard
              title={
                <>
                  <span className="underline">Import</span> your Shop
                </>
              }
              description="Connect your Shopify store and import your products"
              icon={<FaShopify size={iconSize} className="text-success" />}
            />
            <TopCard
              title={
                <>
                  <span className="underline">Create</span> a Showcase
                </>
              }
              description="Customize the frame and showcase your products"
              icon={
                <Image
                  src="/images/logo.png"
                  alt="Shopycast Logo"
                  width={iconSize}
                  height={iconSize}
                />
              }
            />
            <TopCard
              title={
                <>
                  <span className="underline">Publish</span> the Frame
                </>
              }
              description="Share the frame with your customers and let them shop"
              icon={<SiFarcaster size={iconSize} className="text-primary" />}
            />
          </div>
        </div>
      </div>
    </>
  );
}
