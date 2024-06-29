"use client";

import { useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Shop } from "@/lib/mongodb";
import { AppContext } from "@/app/providers";
import { User } from "@privy-io/react-auth";

import { Button, Input, Select, SelectItem, Spinner } from "@nextui-org/react";
import { MdEdit } from "react-icons/md";
import { IoReloadOutline } from "react-icons/io5";

interface ProfileShopsProps {
  user: User | null;
  shops: Shop[] | null;
  activeShopId: string;
  isLoadingShops: boolean;
  errorShops: Error | null;
}

export const ProfileShops: React.FC<ProfileShopsProps> = ({
  user,
  shops,
  activeShopId,
  isLoadingShops,
  errorShops,
}) => {
  const context = useContext(AppContext);
  const [editShop, setEditShop] = useState<boolean>(false);
  const [saveShopInfo, setSaveShopInfo] = useState<boolean>(false);
  const [updateImportProducts, setUpdateImportProducts] =
    useState<boolean>(false);
  const [shopName, setShopName] = useState<string>("");
  const [shopUrl, setShopUrl] = useState<string>("");
  const selectedShop = shops?.find((shop) => shop.id === activeShopId);

  const {
    isLoading: isLoadingUpdateShop,
    error: errorUpdateShop,
    data: dataUpdateShop,
  } = useQuery({
    queryKey: ["updateShopInfo", user?.id, selectedShop?.id],
    queryFn: () =>
      fetch(`/api/shops/`, {
        method: "PUT",
        body: JSON.stringify({
          user_id: user?.id,
          shop_id: selectedShop?.id,
          secretName: selectedShop?.secretName,
          shopName,
          shopUrl,
          updateProducts: updateImportProducts,
        }),
      }).then((res) => res.json()),
    enabled: saveShopInfo,
  });

  useEffect(() => {
    if (selectedShop) {
      setShopName(selectedShop.name);
      setShopUrl(selectedShop.url);
      handleSelect(selectedShop.id);
    }
  }, [selectedShop]);

  const handleSelect = (shopId: string) => {
    context?.setActiveShopId(shopId);
  };

  const handleEdit = () => {
    if (editShop) {
      // Save changes
      setSaveShopInfo(true);
      setEditShop(false);
    } else {
      setEditShop(true);
    }
  };

  const handleUpdateProducts = () => {
    // Update import products
    setUpdateImportProducts(true);
    setSaveShopInfo(true);
  };

  if (errorShops) return "An error has occurred: " + errorShops.message;
  const isLoading = isLoadingShops || !shops;

  return (
    <div className="flex flex-col w-full justify-between gap-6">
      <div className="flex flex-col sm:flex-row w-full justify-between gap-6">
        <div className="flex w-full justify-between items-end">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold">My Shops</h1>
            <h2 className="text-lg text-default-500">
              {(shops && shops?.length > 0) || isLoading
                ? "Select a Shop to manage"
                : "You don't have any shop yet. To get started, create one by clicking the button."}
            </h2>
          </div>
        </div>
        {shops ? (
          shops.length > 0 && (
            <Select
              color="default"
              defaultSelectedKeys={[activeShopId || shops[0].id]}
              onChange={(e) => handleSelect(e.target.value)}
              className="w-full sm:w-[33%]"
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
      {shops && selectedShop ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-bold w-fit">Shop Name</h2>
            <Input
              type="text"
              placeholder="What is your shop name"
              className="rounded-sm sm:w-[33%]"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              isDisabled={!editShop}
              classNames={{
                input: [
                  "group-data-[focus=true]:text-white",
                  "group-data-[hover=true]:text-white",
                  "group-data-[has-value=true]:text-white",
                ],
                inputWrapper: [
                  "bg-zinc-900",
                  "outline",
                  "outline-1",
                  "outline-zinc-700",
                  "group-data-[focus=true]:bg-zinc-800",
                  "group-data-[hover=true]:bg-zinc-800",
                ],
              }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-bold w-fit">Shop Url</h2>
            <Input
              type="text"
              placeholder="https://..."
              className="rounded-sm sm:w-[33%]"
              value={shopUrl}
              onChange={(e) => setShopUrl(e.target.value)}
              isDisabled={!editShop}
              classNames={{
                input: [
                  "group-data-[focus=true]:text-white",
                  "group-data-[hover=true]:text-white",
                  "group-data-[has-value=true]:text-white",
                ],
                inputWrapper: [
                  "bg-zinc-900",
                  "outline",
                  "outline-1",
                  "outline-zinc-700",
                  "group-data-[focus=true]:bg-zinc-800",
                  "group-data-[hover=true]:bg-zinc-800",
                ],
              }}
            />
          </div>
          <div className="flex flex-col gap-1 text-white">
            <Button
              onClick={handleEdit}
              className="sm:w-[33%]"
              color="primary"
              endContent={isLoadingUpdateShop ? <Spinner /> : <MdEdit />}
            >
              {editShop ? "Save" : "Edit shop info"}
            </Button>
          </div>
          <div className="flex flex-col gap-1 mt-10">
            <Button
              onClick={handleUpdateProducts}
              className="sm:w-[33%] text-primary"
              color="secondary"
              endContent={
                isLoadingUpdateShop ? <Spinner /> : <IoReloadOutline />
              }
            >
              Refresh products
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
