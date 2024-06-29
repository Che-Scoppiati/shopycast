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
  variants: Variant[] | null;
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
  createdAt: Date;
  updatedAt: Date;
};

export type Showcase = {
  id: string;
  name: string;
  shopId: string;
  products: string[];
  createdAt: Date;
  updatedAt?: Date;
};

export type Shop = {
  id: string;
  name: string;
  url: string;
  products: Product[];
  type: string;
  owner: string;
  secretName: string;
  createdAt: Date;
  updatedAt?: Date;
};

export type ShowcaseWithDetails = {
  id: string;
  name: string;
  shop: Shop;
  products: Product[];
  createdAt: Date;
  updatedAt?: Date;
};

const productRequiredFields = [
  "id",
  "name",
  "description",
  "image",
  "currency",
  "variants",
];

export async function createShowcase(
  shopId: string,
  productIds: string[],
  name: string,
): Promise<Showcase> {
  const showcaseId = uuid();

  if (!shopId || !productIds || !name) {
    throw new Error("shopId, products and name are required");
  }

  const showcase: Showcase = {
    id: showcaseId,
    shopId,
    products: productIds,
    name,
    createdAt: new Date(),
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

export async function getShowcaseWithDetails(
  shopId: string,
  showcaseId: string,
): Promise<ShowcaseWithDetails | null> {
  // aggregate Showcases collection with Shops collection to get shop name
  const showcases = await db
    .collection("showcases")
    .aggregate([
      {
        $match: {
          shopId: shopId,
          id: showcaseId,
        },
      },
      {
        $lookup: {
          from: "shops",
          localField: "shopId",
          foreignField: "id",
          as: "shop",
        },
      },
      {
        $unwind: "$shop",
      },
      {
        $addFields: {
          productsDetails: {
            $map: {
              input: "$products",
              as: "productId",
              in: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: "$shop.products",
                      as: "product",
                      cond: { $eq: ["$$product.id", "$$productId"] },
                    },
                  },
                  0,
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          id: 1,
          name: 1,
          shop: 1,
          products: "$productsDetails",
        },
      },
    ])
    .toArray();

  if (showcases.length === 0) {
    return null;
  }

  return showcases[0] as ShowcaseWithDetails;
}

export async function getAllShowcases(shopId: string) {
  return db.collection("showcases").find({ shopId }).toArray();
}

export async function getAllShowcasesWithDetails(
  shopId: string,
): Promise<ShowcaseWithDetails[]> {
  return db
    .collection("showcases")
    .aggregate([
      {
        $match: {
          shopId: shopId,
        },
      },
      {
        $lookup: {
          from: "shops",
          localField: "shopId",
          foreignField: "id",
          as: "shop",
        },
      },
      {
        $unwind: "$shop",
      },
      {
        $addFields: {
          productsDetails: {
            $map: {
              input: "$products",
              as: "productId",
              in: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: "$shop.products",
                      as: "product",
                      cond: { $eq: ["$$product.id", "$$productId"] },
                    },
                  },
                  0,
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          id: 1,
          name: 1,
          shop: 1,
          products: "$productsDetails",
        },
      },
    ])
    .toArray() as Promise<ShowcaseWithDetails[]>;
}

export async function deleteShowcase(shopId: string, showcaseId: string) {
  return db
    .collection("showcases")
    .deleteOne({ shopId: shopId, id: showcaseId });
}

export async function updateShowcase(
  shopId: string,
  showcaseId: string,
  products: string[],
  name: string,
) {
  if (!shopId || !showcaseId || !products || !name) {
    throw new Error("shopId, showcaseId, products and name are required");
  }

  return db
    .collection("showcases")
    .updateOne(
      { shopId, id: showcaseId },
      { $set: { products, updatedAt: new Date(), name } },
    );
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
  shopId: string,
  secretName: string,
  products: Product[],
) {
  return db.collection("shops").insertOne({
    id: shopId,
    createdAt: new Date(),
    updatedAt: new Date(),
    name: shopName,
    url: shopUrl,
    secretName,
    type: "shopify",
    owner: user,
    products,
  });
}

export async function editShopInfo(
  userId: string,
  shopId: string,
  shopName: string,
  shopUrl: string,
) {
  return db.collection("shops").updateOne(
    { id: shopId, owner: userId },
    {
      $set: {
        name: shopName,
        url: shopUrl,
        updatedAt: new Date(),
      },
    },
  );
}
export async function editShopProducts(
  userId: string,
  shopId: string,
  shopName: string,
  shopUrl: string,
  products: Product[],
) {
  return db.collection("shops").updateOne(
    { id: shopId, owner: userId },
    {
      $set: {
        name: shopName,
        url: shopUrl,
        products,
        updatedAt: new Date(),
      },
    },
  );
}

export async function getShopsByUser(user: string) {
  return db.collection("shops").find({ owner: user }).toArray();
}

export async function getShop(user_id: string, shop_id: string) {
  return db.collection("shops").findOne({ owner: user_id, id: shop_id });
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
      createdAt: new Date(),
    });
  } else {
    // check if product already exists in cart and increment quantity
    const existingProduct = cart.products.find(
      (p) => p.id === product.id && p.variant.id === product.variant.id,
    );
    let updatedProductsToStore = [];
    if (existingProduct) {
      existingProduct.quantity += 1;
      updatedProductsToStore = cart.products;
    } else {
      updatedProductsToStore = cart.products.concat({
        ...product,
        quantity: 1,
      });
    }
    res = await db.collection("carts").updateOne(
      {
        user: user,
        shopId: shopId,
        showcaseId: showcaseId,
      },
      {
        $set: {
          products: updatedProductsToStore,
          updatedAt: new Date(),
        },
      },
    );
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

export async function getAllProductsByShop(
  shopId: string,
  owner: string,
  secretName: string,
) {
  const shop = (await db
    .collection("shops")
    .findOne({ id: shopId, owner, secretName })) as Shop | null;

  if (!shop) {
    throw new Error("Shop not found");
  }

  return shop.products;
}
