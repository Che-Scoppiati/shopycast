import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  Image,
  Input,
  Link,
} from "@nextui-org/react";
import { Product, Showcase, Variant } from "@/lib/mongodb";
import { ImBin } from "react-icons/im";
import { FaPlus } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { ModalHeader } from "../ModalHeader";
import { CopyButton } from "../CopyButton";
import { appURL, createWarpcastIntent } from "@/lib/utils";
import toast from "react-hot-toast";
import { IoIosShareAlt, IoIosStats } from "react-icons/io";

interface ShowcaseModalProps {
  showcase: Omit<Showcase, "createdAt">;
  products: Product[];
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onClose: () => void;
  setRefetchShowcases: Dispatch<SetStateAction<boolean>>;
}

export const ShowcaseModal: React.FC<ShowcaseModalProps> = ({
  showcase,
  products,
  isOpen,
  onOpenChange,
  onClose,
  setRefetchShowcases,
}) => {
  const [deletingProducts, setDeletingProducts] = useState<string[]>([]);

  const [updatedProducts, setUpdatedProducts] = useState<string[]>(
    showcase.products,
  );
  const [showcaseName, setShowcaseName] = useState<string>(showcase.name);

  useEffect(() => {
    if (deletingProducts.length) {
      setUpdatedProducts(
        updatedProducts.filter((id) => !deletingProducts.includes(id)),
      );
    } else {
      setUpdatedProducts(showcase.products);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deletingProducts]);

  const editUrl = `/api/${showcase.shopId}/showcases/${showcase.id}`;

  const [enableUpdate, setEnableUpdate] = useState<boolean>(false);

  const {
    isFetching: isLoadingEdit,
    error: errorEdit,
    data: dataEdit,
  } = useQuery({
    queryKey: [
      `editShowcase/${showcase.id}/${showcase.name}/${showcase.updatedAt || "1"}`,
    ],
    queryFn: () =>
      fetch(editUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          products: updatedProducts,
          name: showcaseName,
        }),
      }).then((res) => res.json()),
    enabled: enableUpdate,
  });

  useEffect(() => {
    if (errorEdit) {
      console.error(errorEdit);
      setEnableUpdate(false);
    }
  }, [errorEdit]);

  const [enableDelete, setEnableDelete] = useState<boolean>(false);

  const {
    isFetching: isLoadingDelete,
    error: errorDelete,
    data: dataDelete,
  } = useQuery({
    queryKey: [`deleteShowcase/${showcase.id}`],
    queryFn: () =>
      fetch(editUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json()),
    enabled: enableDelete,
  });

  useEffect(() => {
    if (errorDelete) {
      console.error(errorDelete);
      setEnableDelete(false);
    }
  }, [errorDelete]);

  const notifyWithToast = (message: string) => {
    toast.success(message);
  };

  useEffect(() => {
    if (dataDelete && !errorDelete) {
      setEnableDelete(false);
      setRefetchShowcases(true);
      onClose();
      notifyWithToast("Showcase deleted successfully");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataDelete]);

  useEffect(() => {
    if (dataEdit && !errorEdit) {
      setEnableUpdate(false);
      setRefetchShowcases(true);
      onClose();
      notifyWithToast("Showcase updated successfully");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataEdit]);

  const isEditing =
    updatedProducts !== showcase.products || showcaseName !== showcase.name;

  const sizesOrder = ["S", "M", "L", "XL"];

  useEffect(() => {
    if (isOpen) {
      setDeletingProducts([]);
      setUpdatedProducts(showcase.products);
      setShowcaseName(showcase.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className="border-1 border-zinc-600"
      backdrop="blur"
      closeButton={<></>}
      size="lg"
    >
      <ModalContent className="bg-zinc-950">
        {(onClose) => (
          <>
            <ModalHeader title={`Edit ${showcase.name}`} onClose={onClose} />
            <ModalBody className="gap-6 overflow-y-auto">
              <h2 className="text-md text-default-500">
                Delete it, change its name or remove some Products
              </h2>
              <div className="flex flex-col gap-3">
                <h2 className="text-md font-bold w-fit">
                  Change the Showcase name
                </h2>
                <Input
                  type="text"
                  placeholder="Give your Showcase a nice name"
                  className="rounded-sm w-[50%]"
                  value={showcaseName}
                  onChange={(e) => setShowcaseName(e.target.value)}
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
              <div className="flex flex-col gap-4 max-h-[450px] overflow-y-auto">
                {products.map((product) => {
                  const isOutOfStock =
                    product.variants && product.variants?.length === 0;
                  let availableSizes = !product.variants
                    ? []
                    : product.variants
                        .filter((variant) => variant !== null)
                        .map((variant: Variant) => {
                          return variant?.value || "";
                        })
                        .sort(
                          (a, b) =>
                            sizesOrder.indexOf(a) - sizesOrder.indexOf(b),
                        );
                  const productIsBeingDeleted = deletingProducts.includes(
                    product.id,
                  );
                  return (
                    <div
                      key={product.id}
                      className="flex w-full justify-between items-center"
                    >
                      <div
                        className={`${productIsBeingDeleted ? "opacity-20" : ""} flex gap-4 transition-all items-start`}
                      >
                        <Image
                          alt="Product image"
                          className="object-cover rounded-xl aspect-square outline outline-1 outline-zinc-300 p-[2px] m-[1px]"
                          src={product.image}
                          width={130}
                        />
                        <div className="flex flex-col gap-3">
                          <div className="flex flex-col gap-1">
                            <h4 className="font-bold text-large leading-none">
                              {product.name}
                            </h4>
                            <small className="text-default-500 leading-none">
                              {product.description}
                            </small>
                          </div>
                          <div className="flex gap-2 items-center">
                            {!isOutOfStock &&
                              availableSizes.map((size) => (
                                <span
                                  key={size}
                                  className={
                                    "px-2 py-1 rounded-small bg-zinc-800 text-default-400"
                                  }
                                >
                                  {size}
                                </span>
                              ))}
                            {isOutOfStock && (
                              <span
                                className={
                                  "px-2 py-1 rounded-small bg-primary bg-opacity-50 text-white"
                                }
                              >
                                Out of Stock
                              </span>
                            )}
                          </div>
                          {product.variants && availableSizes.length > 0 && (
                            <span className="px-2 py-1 rounded-small bg-primary-light bg-opacity-30 text-white w-fit">
                              {product.variants[0]?.price}
                              &nbsp;USD
                            </span>
                          )}
                        </div>
                      </div>
                      {!productIsBeingDeleted && (
                        <Button
                          isIconOnly
                          className="p-1 min-w-0 w-10 h-10 rounded-small bg-danger"
                          onPress={() =>
                            setDeletingProducts([
                              ...deletingProducts,
                              product.id,
                            ])
                          }
                        >
                          <ImBin size={18} color="white" />
                        </Button>
                      )}
                      {productIsBeingDeleted && (
                        <Button
                          isIconOnly
                          className="p-1 min-w-0 w-10 h-10 rounded-small bg-primary"
                          onPress={() =>
                            setDeletingProducts(
                              deletingProducts.filter(
                                (id) => id !== product.id,
                              ),
                            )
                          }
                        >
                          <FaPlus size={18} color="white" />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </ModalBody>
            <ModalFooter className="p-[1.25rem]">
              <div className="flex w-full justify-between">
                <div className="flex gap-2">
                  <CopyButton
                    textToCopy={`${appURL()}/frames/${showcase.shopId}/${showcase.id}`}
                    className="h-auto px-4 py-2"
                  >
                    Copy Frame URL
                  </CopyButton>
                  <Button
                    size="md"
                    color={"primary"}
                    as={Link}
                    href={createWarpcastIntent(
                      `${appURL()}/frames/${showcase.shopId}/${showcase.id}`,
                    )}
                    target="_blank"
                    endContent={<IoIosShareAlt />}
                    isIconOnly
                  />
                  <Button
                    size="md"
                    color={"primary"}
                    as={Link}
                    href={`/showcases/${showcase.id}`}
                    endContent={<IoIosStats />}
                    isIconOnly
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    color="danger"
                    onPress={() => setEnableDelete(true)}
                    isDisabled={isLoadingDelete}
                    isLoading={isLoadingDelete}
                    className="h-auto px-4 py-2"
                  >
                    {!isLoadingDelete && "Delete"}
                  </Button>
                  <Button
                    onPress={() => setEnableUpdate(true)}
                    isDisabled={!isEditing || isLoadingEdit}
                    isLoading={isLoadingEdit}
                    className="h-auto px-4 py-2 bg-primary-light"
                  >
                    {!isLoadingEdit && "Edit"}
                  </Button>
                </div>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
