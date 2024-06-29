"use client";
import React, { useContext, useEffect, useState } from "react";
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
import { AppContext } from "@/app/providers";
import { isError } from "util";

interface EditShopModalProps {
  shop: Shop | undefined;
  userId: string | undefined;
}

export const EditShopModal: React.FC<EditShopModalProps> = ({
  shop,
  userId,
}) => {
  const context = useContext(AppContext);

  const {
    isOpen: isOpenModal,
    onOpen: onOpenModal,
    onOpenChange: onOpenChangeModal,
    onClose: onCloseModal,
  } = useDisclosure();

  const [editShop, setEditShop] = useState<boolean>(false);
  const [saveShopInfo, setSaveShopInfo] = useState<boolean>(false);
  const [updateImportProducts, setUpdateImportProducts] =
    useState<boolean>(false);
  const [shopName, setShopName] = useState<string>("");
  const [shopUrl, setShopUrl] = useState<string>("");

  const now = new Date();
  const oneHourAgo = new Date(now.setHours(now.getHours() - 1));
  const isRefreshDisabled =
    !editShop ||
    !shop ||
    new Date(shop?.updatedAt || "").getTime() >= oneHourAgo.getTime();

  const {
    isSuccess: isSuccessUpdateShop,
    isLoading: isLoadingUpdateShop,
    error: errorUpdateShop,
    data: dataUpdateShop,
  } = useQuery({
    queryKey: ["updateShopInfo", userId, shop],
    queryFn: () =>
      fetch(`/api/shops/`, {
        method: "PUT",
        body: JSON.stringify({
          user_id: userId,
          shop_id: shop?.id,
          secretName: shop?.secretName,
          shopName,
          shopUrl,
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

      // close modal
      onOpenChangeModal();
    } else {
      if (errorUpdateShop) {
        toast.error(errorUpdateShop?.message);
      }
    }
  }, [isSuccessUpdateShop, errorUpdateShop]);

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
        size="5xl"
        backdrop="blur"
        className="border-1 border-zinc-600"
        closeButton={<></>}
      >
        <ModalContent className="bg-zinc-950">
          {(onClose) => (
            <>
              <ModalHeader title={"Create Showcase"} onClose={onClose} />
              <ModalBody className="max-h-[600px] overflow-y-auto">
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
                  <p className="text-default-500 text-sm text-end text-balance">
                    {isRefreshDisabled
                      ? `Last refreshed at ${new Date(shop?.updatedAt || "").toLocaleTimeString()}. You can edit your shop info once every hour.`
                      : ""}
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  size="md"
                  color="danger"
                  onClick={onOpenChangeModal}
                  className="h-auto px-4 py-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleEdit}
                  className="sm:w-[33%]"
                  color="primary"
                  endContent={isLoadingUpdateShop ? <Spinner /> : <MdEdit />}
                >
                  {editShop ? "Save" : "Edit"}
                </Button>
                <Button
                  onClick={handleUpdateProducts}
                  className="sm:w-[33%] text-primary"
                  color="secondary"
                  endContent={
                    isLoadingUpdateShop ? <Spinner /> : <IoReloadOutline />
                  }
                  isDisabled={isRefreshDisabled}
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
