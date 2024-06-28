import { Metadata } from "next";
import { fetchMetadata } from "frames.js/next";
import { RedirectToHome } from "@/app/components/RedirectToHome";
import { FRAMES_BASE_PATH } from "@/lib/frames";
import { appURL } from "@/lib/utils";

export async function generateMetadata({
  params: { uuid },
}: {
  params: { uuid: string };
}): Promise<Metadata> {
  return {
    other: {
      ...(await fetchMetadata(
        new URL(FRAMES_BASE_PATH + `/${uuid}/${uuid}/${uuid}/`, appURL()),
      )),
    },
  };
}

export default async function Page({ params }: { params: { uuid: string } }) {
  return (
    <div>
      <RedirectToHome />
    </div>
  );
}

export const dynamic = "force-dynamic";
