import { shopifyClient } from "@/lib/shopify";
import { FRAMES_BASE_PATH, appURL } from "@/lib/utils";
import { Button, Input } from "@nextui-org/react";
import { fetchMetadata } from "frames.js/next";
import { Metadata } from "next";
import { ProductCard } from "./components/ProductCard";
import { getAllProductsQuery } from "./utils";

export async function generateMetadata(): Promise<Metadata> {
  const epochTimestamp = new Date().getTime();
  const url = new URL(`${FRAMES_BASE_PATH}?t=${epochTimestamp}`, appURL());
  return {
    other: await fetchMetadata(url).catch(() => ({})),
  };
}

export default async function Home() {
  const { data, errors, extensions } = await shopifyClient.request(
    getAllProductsQuery,
    {
      variables: {
        first: 10,
      },
    },
  );
  // console.log("shopify", { data, errors, extensions }, errors?.graphQLErrors);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-20">
      <div className="w-full flex flex-col gap-16">
        <h1 className="text-6xl font-bold w-fit m-auto">Onchain Shop</h1>
        <div className="w-full flex flex-col gap-16">
          <div className="w-full flex justify-between">
            <Input type="text" label="Your Shopify Key" className="w-[33%]" />
            <p className="text-xl w-[33%] text-end">
              Select your products and create a frame to embed on Farcaster!
            </p>
          </div>
          <div className="w-full flex flex-col gap-6">
            <div className="flex w-full justify-between">
              <h2 className="text-3xl font-bold w-fit">Select Products</h2>
              <Button size="md" color="success">
                Create Frame
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-6">
              {data &&
                data.products.nodes.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
