import prisma from "./prisma";
import { Variant } from "@prisma/client";

export async function getVariantsByProductId(
  productId: string,
): Promise<Variant[] | null> {
  return await prisma.variant.findMany({
    where: { productId },
  });
}

export async function getVariantById(id: string): Promise<Variant | null> {
  return await prisma.variant.findUnique({
    where: { id },
  });
}

export async function createVariant(data: Variant): Promise<Variant> {
  return await prisma.variant.create({
    data,
  });
}

export async function updateVariant(
  id: string,
  data: Variant,
): Promise<Variant> {
  return await prisma.variant.update({
    where: { id },
    data,
  });
}

export async function deleteVariant(id: string): Promise<Variant> {
  return await prisma.variant.delete({
    where: { id },
  });
}
