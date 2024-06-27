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
};

export type Product = {
  id: string;
  name: string;
  description: string;
  image: string;
  currency: string;
  variants: Variant[];
};

export type ProductCart = {
  id: string;
  name: string;
  description: string;
  image: string;
  currency: string;
  variant: Variant;
  quantity: number;
};

export type Cart = {
  user: string;
  shopId: string;
  showcaseId: string;
  products: ProductCart[];
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

  // no variants === no available sizes
  //
  // if (!product.variants.length) {
  //   throw new Error("Product variants are required");
  // }

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

export async function addProductToCart(
  user: string,
  shopId: string,
  showcaseId: string,
  product: ProductCart,
) {
  const cart = (await db.collection("carts").findOne({
    user: user,
    shopId: shopId,
    showcaseId: showcaseId,
  })) as Cart | null;

  let res;
  if (!cart) {
    res = await db.collection("carts").insertOne({
      user: user,
      shopId: shopId,
      showcaseId: showcaseId,
      products: [
        {
          ...product,
          quantity: 1,
        },
      ],
    });
  } else {
    console.log("cart", cart);
    // check if product already exists in cart and increment quantity
    const existingProduct = cart.products.find(
      (p) => p.id === product.id && p.variant.id === product.variant.id,
    );
    if (existingProduct) {
      existingProduct.quantity += 1;
      res = db.collection("carts").updateOne(
        {
          user: user,
          shopId: shopId,
          showcaseId: showcaseId,
        },
        {
          $set: {
            products: cart.products,
          },
        },
      );
    } else {
      res = await db.collection("carts").updateOne(
        {
          user: user,
          shopId: shopId,
          showcaseId: showcaseId,
        },
        {
          $set: {
            products: cart.products.concat(product),
          },
        },
      );
    }
  }
  return res;
}

export async function getCart(
  user: string,
  shopId: string,
  showcaseId: string,
): Promise<Cart | null> {
  return db.collection("carts").findOne({
    user: user,
    shopId: shopId,
    showcaseId: showcaseId,
  }) as Promise<Cart | null>;
}

export async function deleteCart(
  user: string,
  shopId: string,
  showcaseId: string,
) {
  return db
    .collection("carts")
    .deleteOne({ user: user, shopId: shopId, showcaseId: showcaseId });
}
