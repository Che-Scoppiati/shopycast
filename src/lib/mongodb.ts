import { MongoClient } from "mongodb";
import { v4 as uuid } from "uuid";

if (!process.env.MONGODB_URI || !process.env.DATABASE_NAME) {
  throw new Error("Please add your Mongo URI to .env");
}

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db(process.env.DATABASE_NAME);

export type Product = {
  id: string;
  name: string;
  description: string;
  image: string;
};

export type ProductLite = {
  id: string;
  variants: {
    id: string;
    name: string;
    price: number;
  }[];
};

export type Showcase = {
  id: string;
  shopId: string;
  products: ProductLite[];
};

export async function createShowcase(
  shopId: string,
  products: ProductLite[],
): Promise<Showcase> {
  const showcaseId = uuid();

  const showcase: Showcase = {
    id: showcaseId,
    shopId,
    products,
  };

  await db.collection("showcases").insertOne(showcase);

  return showcase;
}

export async function getShowcase(shopId: string, showcaseId: string) {
  return db.collection("showcases").findOne({ shopId, id: showcaseId });
}

export async function getAllShowcases(shopId: string) {
  return db.collection("showcases").find({ shopId }).toArray();
}

export async function deleteShowcase(shopId: string, showcaseId: string) {
  return db
    .collection("showcases")
    .deleteOne({ shopId: shopId, id: showcaseId });
}
