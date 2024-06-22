import { FRAMES_BASE_PATH, appURL } from "@/lib/utils";
import { fetchMetadata } from "frames.js/next";
import { Metadata } from "next";
import CreateFrame from "@/app/components/CreateFrame/CreateFrame";

export async function generateMetadata(): Promise<Metadata> {
  const epochTimestamp = new Date().getTime();
  const url = new URL(`${FRAMES_BASE_PATH}?t=${epochTimestamp}`, appURL());
  return {
    other: await fetchMetadata(url).catch(() => ({})),
  };
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-20 pt-10">
      <div className="w-full flex flex-col gap-16 max-w-[1800px]">
        <h1 className="text-6xl font-bold w-fit m-auto">⚡ Onchain Shop ⚡</h1>
        <CreateFrame />
      </div>
    </main>
  );
}
