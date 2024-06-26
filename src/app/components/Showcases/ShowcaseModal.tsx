import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Image,
  Spinner,
} from "@nextui-org/react";
import { Showcase, Variant } from "@/lib/mongodb";
import { IoCloseOutline } from "react-icons/io5";
import { ImBin } from "react-icons/im";
import { CopyButton } from "@/app/components/CopyButton";
import { FaPlus } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";

interface ShowcaseModalProps {
  showcase: Showcase;
  showcaseIndex: number;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onClose: () => void;
  setRefetchShowcases: Dispatch<SetStateAction<boolean>>;
}

export const ShowcaseModal: React.FC<ShowcaseModalProps> = ({
  showcase,
  showcaseIndex,
  isOpen,
  onOpenChange,
  onClose,
  setRefetchShowcases,
}) => {
  const [deletingProducts, setDeletingProducts] = useState<string[]>([]);

  const [updatedProducts, setUpdatedProducts] = useState<Showcase["products"]>(
    showcase.products,
  );

  useEffect(() => {
    if (deletingProducts.length) {
      setUpdatedProducts(
        updatedProducts.filter((product) => {
          return !deletingProducts.includes(product.id);
        }),
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
    queryKey: [`editShowcase/${showcase.id}`],
    queryFn: () =>
      fetch(editUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products: updatedProducts }),
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
    if (dataDelete && !errorDelete) {
      setEnableDelete(false);
      setRefetchShowcases(true);
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataDelete]);

  useEffect(() => {
    if (dataEdit && !errorDelete) {
      setEnableUpdate(false);
      setRefetchShowcases(true);
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataEdit]);

  const isEditing = updatedProducts !== showcase.products;

  const sizesOrder = ["S", "M", "L", "XL"];

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      closeButton={<></>}
      size="lg"
    >
      <ModalContent className="bg-zinc-900">
        {(onClose) => (
          <>
            <ModalHeader className="flex w-full justify-between items-center p-[1.25rem]">
              <p className="text-2xl leading-none">
                Edit Showcase {showcaseIndex + 1}
              </p>
              <Button
                isIconOnly
                className="p-1 min-w-0 w-6 h-6 rounded-small bg-zinc-800"
                onPress={onClose}
              >
                <IoCloseOutline size={20} color="white" />
              </Button>
            </ModalHeader>
            <ModalBody className="gap-4 max-h-[500px] overflow-y-auto">
              {/* here we'll see the details about each product in the showcase */}
              {showcase.products.map((product) => {
                const isOutOfStock = product.variants.length === 0;
                let availableSizes = product.variants
                  .filter((variant) => variant !== null)
                  .map((variant: Variant) => {
                    return variant?.value || "";
                  })
                  .sort(
                    (a, b) => sizesOrder.indexOf(a) - sizesOrder.indexOf(b),
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
                        className="object-cover rounded-xl aspect-square"
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
                                "px-2 py-1 rounded-small bg-danger-800 text-white"
                              }
                            >
                              Out of Stock
                            </span>
                          )}
                        </div>
                        {availableSizes.length > 0 && (
                          <span className="px-2 py-1 rounded-small bg-success-800 text-white w-fit">
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
                          setDeletingProducts([...deletingProducts, product.id])
                        }
                      >
                        <ImBin size={18} color="white" />
                      </Button>
                    )}
                    {productIsBeingDeleted && (
                      <Button
                        isIconOnly
                        className="p-1 min-w-0 w-10 h-10 rounded-small bg-success-700"
                        onPress={() =>
                          setDeletingProducts(
                            deletingProducts.filter((id) => id !== product.id),
                          )
                        }
                      >
                        <FaPlus size={18} color="white" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </ModalBody>
            <ModalFooter className="p-[1.25rem]">
              <div className="flex w-full justify-between">
                <CopyButton
                  textToCopy={`http://localhost:3000/frames/${showcase.shopId}/${showcase.id}`}
                >
                  Copy Frame URL
                </CopyButton>
                <div className="flex gap-2">
                  <Button
                    color="danger"
                    variant="light"
                    onPress={() => setEnableDelete(true)}
                    isDisabled={isLoadingDelete}
                  >
                    {!isLoadingDelete && "Delete"}
                    {isLoadingDelete && <Spinner color="white" size="sm" />}
                  </Button>
                  {isEditing && (
                    <Button
                      color="primary"
                      onPress={() => setEnableUpdate(true)}
                      isDisabled={isLoadingEdit}
                    >
                      {!isLoadingEdit && "Update"}
                      {isLoadingEdit && <Spinner color="white" size="sm" />}
                    </Button>
                  )}
                </div>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
