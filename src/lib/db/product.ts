import prisma from "./prisma";
import { Product } from "@prisma/client";

export async function getProductsByShopId(shopId: string): Promise<Product[]> {
  return await prisma.product.findMany({
    where: { shopId },
    include: {
      Variants: true,
    },
  });
}

export async function getProductById(id: string): Promise<Product | null> {
  return await prisma.product.findUnique({
    where: { id },
  });
}

export async function createProduct(data: Product): Promise<Product> {
  return await prisma.product.create({
    data,
  });
}

export async function updateProduct(
  id: string,
  data: Product,
): Promise<Product> {
  return await prisma.product.update({
    where: { id },
    data,
  });
}

export async function deleteProduct(id: string): Promise<Product> {
  return await prisma.product.delete({
    where: { id },
  });
}
