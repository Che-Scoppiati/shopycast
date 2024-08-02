import prisma from "./prisma";
import { ShowcaseProduct } from "@prisma/client";

export async function getShowcaseProductsByShowcaseId(
  showcaseId: string,
): Promise<ShowcaseProduct[] | null> {
  return await prisma.showcaseProduct.findMany({
    where: { showcaseId: showcaseId },
  });
}

export async function updateShowcaseProduct(
  showcaseId: string,
  productId: string,
  data: ShowcaseProduct,
): Promise<ShowcaseProduct> {
  return await prisma.showcaseProduct.update({
    where: { productId_showcaseId: { productId, showcaseId } },
    data,
  });
}

export async function deleteShowcaseProduct(
  showcaseId: string,
  productId: string,
): Promise<ShowcaseProduct> {
  return await prisma.showcaseProduct.delete({
    where: { productId_showcaseId: { productId, showcaseId } },
  });
}
