"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Spinner,
} from "@nextui-org/react";
import { ModalHeader } from "../ModalHeader";
import { useQuery } from "@tanstack/react-query";
import { Shop } from "@/lib/mongodb";
import toast from "react-hot-toast";
import { MdEdit } from "react-icons/md";
import { IoReloadOutline } from "react-icons/io5";

interface EditShopModalProps {
  shop: Shop | undefined;
  userId: string | undefined;
  setRefetchShops: (value: boolean) => void;
}

export const EditShopModal: React.FC<EditShopModalProps> = ({
  shop,
  userId,
  setRefetchShops,
}) => {
  const { isOpen: isOpenModal, onOpenChange: onOpenChangeModal } =
    useDisclosure();

  const [saveShopInfo, setSaveShopInfo] = useState<boolean>(false);
  const [updateImportProducts, setUpdateImportProducts] =
    useState<boolean>(false);
  const [shopName, setShopName] = useState<string>("");
  const [shopUrl, setShopUrl] = useState<string>("");
  const [updateShopCount, setUpdateShopCount] = useState<number>(0);

  const now = new Date();
  const oneHourAgo = new Date(now.setHours(now.getHours() - 1));

  const {
    isSuccess: isSuccessUpdateShop,
    isLoading: isLoadingUpdateShop,
    error: errorUpdateShop,
  } = useQuery({
    queryKey: ["updateShopInfo", userId, updateShopCount],
    queryFn: () =>
      fetch(`/api/shops/`, {
        method: "PUT",
        body: JSON.stringify({
          user_id: userId,
          shop_id: shop?.id,
          secretName: shop?.secretName,
          shopName: updateImportProducts ? shop?.name : shopName,
          shopUrl: updateImportProducts ? shop?.url : shopUrl,
          updateProducts: updateImportProducts,
        }),
      }).then((res) => res.json()),
    enabled: saveShopInfo,
  });

  useEffect(() => {
    if (shop) {
      setShopName(shop.name);
      setShopUrl(shop.url);
    }
  }, [shop]);

  useEffect(() => {
    if (isSuccessUpdateShop) {
      const message = updateImportProducts
        ? "Products imported from Shopify!"
        : "Shop info updated!";
      toast.success(message);
      setUpdateImportProducts(false);
      setSaveShopInfo(false);
      setRefetchShops(true);
      setUpdateShopCount((prev) => prev + 1);
      // close modal
      onOpenChangeModal();
    } else {
      if (errorUpdateShop) {
        toast.error(errorUpdateShop?.message);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessUpdateShop, errorUpdateShop]);

  const isEditing = shop?.name !== shopName || shop?.url !== shopUrl;

  const isRefreshDisabled =
    !shop || new Date(shop?.updatedAt || "") >= oneHourAgo;

  const handleEdit = () => {
    setSaveShopInfo(true);
  };

  const handleUpdateProducts = () => {
    // Update import products
    setUpdateImportProducts(true);
    setSaveShopInfo(true);
  };

  useEffect(() => {
    if (!isOpenModal) {
      setShopName(shop?.name || "");
      setShopUrl(shop?.url || "");
      setSaveShopInfo(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenModal]);

  if (!shop?.id) return null;

  return (
    <>
      <Button
        className="bg-primary-light text-black"
        size="md"
        onPress={onOpenChangeModal}
        startContent={isLoadingUpdateShop ? <Spinner /> : <MdEdit />}
        isIconOnly={true}
      ></Button>
      <Modal
        isOpen={isOpenModal}
        onOpenChange={onOpenChangeModal}
        size="md"
        backdrop="blur"
        className="border-1 border-zinc-600"
        closeButton={<></>}
      >
        <ModalContent className="bg-zinc-950">
          {(onClose) => (
            <>
              <ModalHeader title={"Edit Shop"} onClose={onClose} />
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-bold w-fit">Shop Name</h2>
                    <Input
                      type="text"
                      placeholder="What is your shop name"
                      className="rounded-sm"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
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
                      className="rounded-sm"
                      value={shopUrl}
                      onChange={(e) => setShopUrl(e.target.value)}
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
                  {/* <p className="text-default-500 text-sm text-end text-balance">
                    {isRefreshDisabled
                      ? `Last refreshed at ${new Date(shop?.updatedAt || "").toLocaleString()}. You can edit your shop info once every hour.`
                      : ""}
                  </p> */}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  onClick={handleEdit}
                  color="primary"
                  endContent={
                    isLoadingUpdateShop &&
                    !updateImportProducts && <Spinner size="sm" color="white" />
                  }
                  isDisabled={!isEditing}
                >
                  {"Save"}
                </Button>
                <Button
                  onClick={handleUpdateProducts}
                  className="text-primary"
                  color="secondary"
                  endContent={
                    isLoadingUpdateShop && updateImportProducts ? (
                      <Spinner size="sm" />
                    ) : (
                      <IoReloadOutline />
                    )
                  }
                  // isDisabled={isRefreshDisabled}
                >
                  Refresh products
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
