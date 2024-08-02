import prisma from "./prisma";
import { Shop } from "@prisma/client";

export async function getShopById(id: string) {
  return await prisma.shop.findUnique({
    where: { id },
  });
}

export async function updateShop(id: string, data: Shop) {
  return await prisma.shop.update({
    where: { id },
    data,
  });
}

export async function deleteShop(id: string) {
  return await prisma.shop.delete({
    where: { id },
  });
}

export async function createShop(data: Shop) {
  return await prisma.shop.create({
    data,
  });
}
