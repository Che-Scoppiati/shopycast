"use client";

import { Spinner } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { Product as ProductMongo, Showcase, Variant } from "@/lib/mongodb";
import { ShowcaseCard } from "./ShowcaseCard";
import { CreateShowcaseModal } from "../CreateShowcaseModal";
import { usePrivy } from "@privy-io/react-auth";
import { AppContext } from "@/app/providers";
import { Product as ShopifyProduct } from "@/lib/shopify";

export const Showcases: React.FC = () => {
  const { user } = usePrivy();
  const context = useContext(AppContext);

  const userId = user?.id || "";
  const shopId = context?.activeShopId || "";

  const [refetchShowcases, setRefetchShowcases] = useState(true);
  const [showcases, setShowcases] = useState<Showcase[] | null>(null);
  const [products, setProducts] = useState<ProductMongo[] | null>(null);

  const {
    isLoading: isLoadingShowcases,
    error: errorShowcases,
    data: dataShowcases,
  } = useQuery({
    queryKey: ["getAllShowcases"],
    queryFn: () => fetch(`/api/${shopId}/showcases`).then((res) => res.json()),
    select: (data) => data.showcases,
    enabled: refetchShowcases,
  });

  const {
    isLoading: isLoadingProducts,
    error: errorProducts,
    data: dataProducts,
  } = useQuery({
    queryKey: ["getAllProducts", userId, shopId],
    queryFn: () =>
      fetch(`/api/shopify/products`, {
        method: "POST",
        body: JSON.stringify({ user_id: userId, shop_id: shopId }),
      }).then((res) => res.json()),
    select: (data) => data.shopifyData,
  });

  useEffect(() => {
    setShowcases(dataShowcases);
    setRefetchShowcases(false);
  }, [dataShowcases]);

  useEffect(() => {
    if (dataProducts && dataProducts.products) {
      const shopifyProducts = dataProducts.products.nodes;
      const mongoDbProducts: ProductMongo[] = (
        shopifyProducts as ShopifyProduct[]
      ).map((product) => {
        const variants = product.variants.edges
          .map((variant) => {
            if (variant.node.availableForSale)
              return {
                id: variant.node.id,
                name: "Size",
                value:
                  variant.node.selectedOptions.find(
                    (option) => option.name === "Size",
                  )?.value || "",
                price: parseFloat(variant.node.price.amount),
              };
          })
          .filter((variant) => variant !== undefined) as Variant[];
        return {
          id: product.id,
          name: product.title,
          description: product.description,
          image: product.variants.edges[0].node.image.url,
          currency: "USD",
          variants,
        };
      });
      setProducts(mongoDbProducts);
    }
  }, [dataProducts]);

  // if it's loading, or it's loading and at the same time there are no showcases or products, show the loader

  if (isLoadingShowcases || (isLoadingProducts && (!products || !showcases))) {
    return <Spinner />;
  }

  if (errorShowcases) return "An error has occurred: " + errorShowcases.message;
  if (errorProducts) return "An error has occurred: " + errorProducts.message;

  if (!products) return null;

  return (
    <div className="flex flex-col w-full items-start gap-6">
      <div className="flex w-full justify-between items-end">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Your Showcases</h1>
          {showcases?.length && showcases?.length > 0 ? (
            <h2 className="text-lg text-default-500">
              Click on a Showcase to view, edit or delete it
            </h2>
          ) : (
            <div className="flex gap-[6px]">
              <h2 className="text-lg text-default-500">
                You don&apos;t have any showcases yet. To get started, create
                one by clicking the button.
              </h2>
            </div>
          )}
        </div>
        <CreateShowcaseModal
          shopId={shopId}
          products={products}
          isLoadingProducts={isLoadingProducts}
          errorProducts={errorProducts}
          setRefetchShowcases={setRefetchShowcases}
        />
      </div>
      {showcases && showcases.length > 0 && (
        <div className="grid grid-cols-4 gap-6">
          {showcases.map((showcase, i) => (
            <ShowcaseCard
              key={showcase.id}
              showcase={showcase}
              products={products}
              setRefetchShowcases={setRefetchShowcases}
            />
          ))}
        </div>
      )}
    </div>
  );
};
