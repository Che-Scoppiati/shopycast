"use client";

import { Spinner } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { Product as ProductMongo, Showcase } from "@/lib/mongodb";
import { ShowcaseCard } from "./ShowcaseCard";
import { CreateShowcaseModal } from "../CreateShowcaseModal";
import { usePrivy } from "@privy-io/react-auth";
import { AppContext } from "@/app/providers";

export const Showcases: React.FC = () => {
  const { user } = usePrivy();
  const context = useContext(AppContext);

  const userId = user?.id || "";
  const shopId = context?.activeShopId || "";

  const [refetchShowcases, setRefetchShowcases] = useState(false);
  const [showcases, setShowcases] = useState<Showcase[] | null>(null);
  const [products, setProducts] = useState<ProductMongo[] | null>(null);

  const {
    isLoading: isLoadingShowcases,
    error: errorShowcases,
    data: dataShowcases,
  } = useQuery({
    queryKey: ["getAllShowcases", shopId],
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
    select: (data) => data.shopProducts,
    enabled: !!shopId && !!userId,
  });

  useEffect(() => {
    if (!!shopId) {
      setRefetchShowcases(true);
    }
  }, [shopId]);

  useEffect(() => {
    if (dataShowcases) {
      setShowcases(dataShowcases);
      setRefetchShowcases(false);
    }
  }, [dataShowcases]);

  useEffect(() => {
    setProducts(dataProducts);
  }, [dataProducts]);

  const isLoading =
    isLoadingShowcases || isLoadingProducts || !products || !showcases;

  if (errorShowcases) return "An error has occurred: " + errorShowcases.message;
  if (errorProducts) return "An error has occurred: " + errorProducts.message;

  return (
    <div className="flex flex-col w-full items-start gap-6">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 w-full justify-between items-start sm:items-end">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Your Showcases</h1>
          <h2 className="text-lg text-default-500">
            {(showcases?.length && showcases?.length > 0) || isLoading
              ? "Click on a Showcase to view, edit or delete it"
              : "You don't have any showcases yet. To get started, create one by clicking the button."}
          </h2>
        </div>
        <CreateShowcaseModal
          shopId={shopId}
          products={products}
          isLoadingProducts={isLoadingProducts}
          errorProducts={errorProducts}
          setRefetchShowcases={setRefetchShowcases}
        />
      </div>
      {showcases && showcases.length > 0 && products ? (
        <div className="grid sm:grid-cols-4 gap-6">
          {showcases.map((showcase, i) => (
            <ShowcaseCard
              key={showcase.id}
              showcase={showcase}
              products={products}
              setRefetchShowcases={setRefetchShowcases}
            />
          ))}
        </div>
      ) : isLoading ? (
        <Spinner />
      ) : null}
    </div>
  );
};
