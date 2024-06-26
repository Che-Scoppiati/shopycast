import { FRAMES_BASE_PATH } from "@/lib/frames";
import { fetchMetadata } from "frames.js/next";
import { Metadata } from "next";
import { Navbar } from "./components/Navbar";
import { appURL } from "@/lib/utils";

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
      <Navbar />
    </>
  );
}
