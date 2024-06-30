import { Navbar } from "./components/Navbar";
import { LandingPageCard } from "./components/Home/LandingPageCard";
import { Suspense } from "react";
import { FaShopify } from "react-icons/fa";
import { SiFarcaster } from "react-icons/si";
import TopCard from "./components/Home/TopCard";
import { Image } from "@nextui-org/react";

export default function Home() {
  const iconSize = 130;

  return (
    <>
      <Suspense>
        <Navbar />
      </Suspense>
      <div className="w-full flex flex-col gap-24 m-auto mt-5 max-w-[1211px]">
        <LandingPageCard />
        <div className="flex flex-col items-center gap-14">
          <div className="flex flex-col items-center text-center gap-2">
            <h2 className="text-3xl sm:text-5xl font-bold">
              It&apos;s super simple 😼
            </h2>
            <h3 className="text-2xl sm:text-3xl text-default-600">
              This time for real.
            </h3>
          </div>
          <div className="grid sm:grid-cols-3 gap-14 w-full">
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
