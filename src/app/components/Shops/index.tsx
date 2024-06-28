"use client";

import { Select, SelectItem, Spinner } from "@nextui-org/react";
import { useContext } from "react";
import { Shop } from "@/lib/mongodb";
import { AppContext } from "@/app/providers";

interface ShopsProps {
  shops: Shop[] | null;
  activeShopId: string;
  isLoadingShops: boolean;
  errorShops: Error | null;
}

export const Shops: React.FC<ShopsProps> = ({
  shops,
  activeShopId,
  isLoadingShops,
  errorShops,
}) => {
  const context = useContext(AppContext);

  if (errorShops) return "An error has occurred: " + errorShops.message;

  const handleSelect = (shopId: string) => {
    context?.setActiveShopId(shopId);
  };

  const isLoading = isLoadingShops || !shops;

  return (
    <div className="flex w-full justify-between gap-6">
      <div className="flex w-full justify-between items-end">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Select Shop</h1>
          <h2 className="text-lg text-default-500">
            {(shops && shops?.length > 0) || isLoading
              ? "Select a Shop to manage your showcases or create new ones"
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
            popoverProps={{
              classNames: {
                content: "bg-zinc-900",
              },
            }}
            listboxProps={{
              itemClasses: {
                base: [
                  "data-[selectable=true]:focus:bg-zinc-800",
                  "data-[selectable=true]:focus:text-white",
                ],
              },
            }}
            classNames={{
              trigger: [
                "bg-zinc-950",
                "outline",
                "outline-1",
                "outline-zinc-700",
                "transition-all",
                "duration-300",
                "data-[hover=true]:bg-zinc-900",
              ],
            }}
          >
            {shops.map((shop, i) => (
              <SelectItem
                key={shop.id}
                value={shop.id}
                color="default"
                className="text-white"
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
