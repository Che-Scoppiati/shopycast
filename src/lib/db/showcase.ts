import prisma from "./prisma";
import { Showcase } from "@prisma/client";

export async function getShowcaseById(id: string): Promise<Showcase | null> {
  return await prisma.showcase.findUnique({
    where: { id },
    include: {
      ShowcaseProduct: true,
    },
  });
}

export async function createShowcase(data: Showcase): Promise<Showcase> {
  return await prisma.showcase.create({
    data,
  });
}

export async function updateShowcase(
  id: string,
  data: Showcase,
): Promise<Showcase> {
  return await prisma.showcase.update({
    where: { id },
    data,
  });
}

export async function deleteShowcase(id: string): Promise<Showcase> {
  return await prisma.showcase.delete({
    where: { id },
  });
}
