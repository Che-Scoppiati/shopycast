import { FRAMES_BASE_PATH } from "@/lib/frames";
import { fetchMetadata } from "frames.js/next";
import { Metadata } from "next";
import { Navbar } from "./components/Navbar";
import { appURL } from "@/lib/utils";
import { LandingPageCard } from "./components/LandingPageCard";
import { Suspense } from "react";

export async function generateMetadata(): Promise<Metadata> {
  const epochTimestamp = new Date().getTime();
  const url = new URL(`${FRAMES_BASE_PATH}?t=${epochTimestamp}`, appURL());
  return {
    other: await fetchMetadata(url).catch(() => ({})),
  };
}

export default function Home() {
  return (
    <>
      <Suspense>
        <Navbar />
      </Suspense>
      <div className="w-full flex flex-col gap-12 mt-5">
        <LandingPageCard />
      </div>
    </>
  );
}
