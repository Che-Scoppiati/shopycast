"use client";

import { Button, Select, SelectItem, Spinner } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { Shop } from "@/lib/mongodb";
import { usePrivy } from "@privy-io/react-auth";
import { AppContext } from "@/app/providers";

export const Shops: React.FC = () => {
  const { user } = usePrivy();
  const context = useContext(AppContext);

  const activeShopId = context?.activeShopId || "";
  const userId = user?.id || "";

  const [refetchShops, setRefetchShops] = useState(false);
  const [shops, setShops] = useState<Shop[] | null>(null);

  const {
    isLoading: isLoadingShops,
    error: errorShops,
    data: dataShops,
  } = useQuery({
    queryKey: ["getAllShops", userId],
    queryFn: () =>
      fetch(`/api/shops/user?user_id=${userId}`).then((res) => res.json()),
    select: (data) => data.shops,
    enabled: refetchShops,
  });

  useEffect(() => {
    if (!!userId) setRefetchShops(true);
  }, [userId]);

  useEffect(() => {
    if (dataShops) {
      setShops(dataShops);
      if (!activeShopId && dataShops.length > 0) {
        context?.setActiveShopId(dataShops[0].id);
      }
      setRefetchShops(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataShops]);

  if (errorShops) return "An error has occurred: " + errorShops.message;

  const handleSelect = (shopId: string) => {
    context?.setActiveShopId(shopId);
  };

  const isLoading = isLoadingShops || !shops;

  return (
    <div className="flex flex-col w-full items-start gap-6">
      <div className="flex w-full justify-between items-end">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Your Shops</h1>
          <h2 className="text-lg text-default-500">
            {(shops && shops?.length > 0) || isLoading
              ? "Select a shop to start creating your showcases"
              : "You don't have any showcases yet. To get started, create one by clicking the button."}
          </h2>
        </div>
      </div>
      {shops ? (
        shops.length > 0 && (
          <Select
            color="default"
            defaultSelectedKeys={[activeShopId || shops[0].id]}
            onChange={(e) => handleSelect(e.target.value)}
            className="w-[33%]"
            size="lg"
            aria-label="Select a shop to start creating your showcases"
            disabledKeys={[activeShopId || shops[0].id]}
          >
            {shops.map((shop, i) => (
              <SelectItem
                key={shop.id}
                value={shop.id}
                color="primary"
                className="text-primary"
              >
                {shop.name}
              </SelectItem>
            ))}
          </Select>
        )
      ) : isLoading ? (
        <Spinner />
      ) : null}
    </div>
  );
};
