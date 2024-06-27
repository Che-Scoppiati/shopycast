import { MongoClient, ServerApiVersion } from "mongodb";
import { v4 as uuid } from "uuid";
import { type User as PrivyUser } from "@privy-io/react-auth";

if (!process.env.MONGODB_URI || !process.env.DATABASE_NAME) {
  throw new Error("Please add your Mongo URI to .env");
}

const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
await client.connect();
const db = client.db(process.env.DATABASE_NAME);

export type Variant = {
  id: string;
  name: string;
  value: string;
  price: number;
} | null;

export type Product = {
  id: string;
  name: string;
  description: string;
  image: string;
  currency: string;
  variants: (Variant | null)[];
};

const productRequiredFields = [
  "id",
  "name",
  "description",
  "image",
  "currency",
  "variants",
];

export type Showcase = {
  id: string;
  shopId: string;
  products: Product[];
};

export function validateProduct(product: Product) {
  for (const field of productRequiredFields) {
    if (!product[field as keyof Product]) {
      throw new Error(`Product ${field} is required`);
    }
  }

  if (product.variants === null) {
    return;
  }

  for (const variant of product.variants) {
    if (variant !== null) {
      if (!variant.id || !variant.name || !variant.value || !variant.price) {
        throw new Error("Variant id, name, value, and price are required");
      }
    }
  }
}

export async function createShowcase(
  shopId: string,
  products: Product[],
): Promise<Showcase> {
  const showcaseId = uuid();

  if (!shopId || !products) {
    throw new Error("shopId and products are required");
  }

  console.log("validating products");
  for (const product of products) {
    validateProduct(product);
  }
  console.log("products validated");

  const showcase: Showcase = {
    id: showcaseId,
    shopId,
    products,
  };

  await db.collection("showcases").insertOne(showcase);

  return showcase;
}

export async function getShowcase(
  shopId: string,
  showcaseId: string,
): Promise<Showcase | null> {
  return db
    .collection("showcases")
    .findOne({ shopId, id: showcaseId }) as Promise<Showcase | null>;
}

export async function getAllShowcases(shopId: string) {
  return db.collection("showcases").find({ shopId }).toArray();
}

export async function deleteShowcase(shopId: string, showcaseId: string) {
  return db
    .collection("showcases")
    .deleteOne({ shopId: shopId, id: showcaseId });
}

export async function updateShowcase(
  shopId: string,
  showcaseId: string,
  products: Product[],
) {
  if (!shopId || !showcaseId || !products) {
    throw new Error("shopId, showcaseId, and products are required");
  }

  for (const product of products) {
    validateProduct(product);
  }

  return db
    .collection("showcases")
    .updateOne({ shopId, id: showcaseId }, { $set: { products } });
}

export async function addUser(user: PrivyUser) {
  const res = await db.collection("users").insertOne(user);

  return res;
}

export async function getUser(user_id: string) {
  return db.collection("users").findOne({ id: user_id });
}

export async function addApikeyUser(user_id: string) {
  return db
    .collection("users")
    .updateOne({ id: user_id }, { $set: { apiKey: true } });
}

export async function setApikeyUser(user_id: string) {
  return db
    .collection("users")
    .updateOne({ id: user_id }, { $set: { apiKey: true } });
}

export async function addShop(
  user: string,
  shopName: string,
  shopUrl: string,
  secretName: string,
  shopifyData: any,
) {
  const id = uuid();
  return db.collection("shops").insertOne({
    id: id,
    created_at: new Date(),
    name: shopName,
    url: shopUrl,
    secretName,
    type: "shopify",
    owner: user,
    products: shopifyData,
  });
}

export async function getShopsByUser(user: string) {
  return db.collection("shops").find({ owner: user });
}

export async function getShop(user_id: string, shop_id: string) {
  return db.collection("shops").findOne({ owner: user_id, id: shop_id });
}
