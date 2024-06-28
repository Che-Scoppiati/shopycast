"use client";

import { Select, SelectItem, Spinner } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { Shop } from "@/lib/mongodb";
import { usePrivy } from "@privy-io/react-auth";
import { AppContext } from "@/app/providers";

export const Shops: React.FC = () => {
  const { user } = usePrivy();
  const context = useContext(AppContext);

  const userId = user?.id || "";

  const [refetchShops, setRefetchShops] = useState(false);
  const [shops, setShops] = useState<Shop[] | null>(null);

  const {
    isLoading: isLoadingShowcases,
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
      context?.setActiveShopId(dataShops[0].id);
      setRefetchShops(false);
    }
  }, [dataShops]);

  if (isLoadingShowcases || !shops) {
    return <Spinner />;
  }

  if (errorShops) return "An error has occurred: " + errorShops.message;

  const handleSelect = (shopId: string) => {
    context?.setActiveShopId(shopId);
  };

  return (
    <div className="flex flex-col w-full items-start gap-6">
      <div className="flex w-full justify-between items-end">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Your Showcases</h1>
          {shops?.length && shops?.length > 0 ? (
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
      </div>
      {shops && shops.length > 0 && (
        <Select
          selectionMode="single"
          label="Select your Store"
          color="default"
          defaultSelectedKeys={[shops[0].id]}
          onChange={(e) => handleSelect(e.target.value)}
        >
          {shops.map((shop, i) => (
            <SelectItem key={shop.id} value={shop.id} color="default">
              {shop.name}
            </SelectItem>
          ))}
        </Select>
      )}
    </div>
  );
};
