import prisma from "./prisma";
import { ShowcaseStat } from "@prisma/client";

export async function getShowcaseStatsByShowcaseId(
  showcaseId: string,
): Promise<ShowcaseStat[] | null> {
  return await prisma.showcaseStat.findMany({
    where: { showcaseId },
  });
}

export async function updateShowcaseStat(
  id: string,
  data: ShowcaseStat,
): Promise<ShowcaseStat> {
  return await prisma.showcaseStat.update({
    where: { id },
    data,
  });
}

export async function deleteShowcaseStat(id: string): Promise<ShowcaseStat> {
  return await prisma.showcaseStat.delete({
    where: { id },
  });
}
