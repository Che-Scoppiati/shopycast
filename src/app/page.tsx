import { FRAMES_BASE_PATH } from "@/lib/frames";
import { fetchMetadata } from "frames.js/next";
import { Metadata } from "next";
import { Navbar, NavbarLink } from "./components/Navbar";
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
      <div className="flex flex-col items-center gap-12 p-6">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-5xl font-bold">
            Build in <span className="underline">seconds</span> your{" "}
            <span className="text-success">Shopify</span> frame
          </h1>
          <h2 className="text-3xl text-default-500">
            Let users fill their 🛒 directly on{" "}
            <span className="text-primary">Farcaster</span>
          </h2>
        </div>
        <div className="flex gap-2">
          <p className="text-xl text-default-500">Start now and</p>
          <NavbarLink
            href={"/dashboard"}
            isSelected={false}
            className="text-xl"
          >
            create
          </NavbarLink>{" "}
          <p className="text-xl text-default-500">your first Showcase</p>
        </div>
      </div>
    </>
  );
}
