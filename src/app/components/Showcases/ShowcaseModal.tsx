import React, { useEffect, useState } from "react";
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
import { CopyButton } from "../CopyButton";
import { FaPlus } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";

interface ShowcaseModalProps {
  showcase: Showcase;
  showcaseIndex: number;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const ShowcaseModal: React.FC<ShowcaseModalProps> = ({
  showcase,
  showcaseIndex,
  isOpen,
  onOpenChange,
}) => {
  const sizesOrder = ["S", "M", "L", "XL"];

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

  const putUrl = `/api/${showcase.shopId}/showcases/${showcase.id}`;

  const [enableUpdate, setEnableUpdate] = useState<boolean>(false);

  const { isLoading, error, data } = useQuery({
    queryKey: ["editShowcase"],
    queryFn: () =>
      fetch(putUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products: updatedProducts }),
      }).then((res) => res.json()),
    enabled: enableUpdate,
  });

  const isEditing = updatedProducts !== showcase.products;

  if (isLoading) return <Spinner color="primary" size="lg" />;
  if (error) return "An error has occurred: " + error.message;

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
              <p className="leading-none">Edit Showcase {showcaseIndex + 1}</p>
              <Button
                isIconOnly
                className="p-1 min-w-0 w-6 h-6 rounded-small bg-zinc-800"
                onPress={onClose}
              >
                <IoCloseOutline size={20} color="white" />
              </Button>
            </ModalHeader>
            <ModalBody>
              {/* here we'll see the details about each product in the showcase */}
              {showcase.products.map((product) => {
                const availableSizes = product.variants.map(
                  (variant: Variant) => {
                    return variant.value;
                  },
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
                      className={`${productIsBeingDeleted ? "opacity-20" : ""} flex gap-4 items-center transition-all`}
                    >
                      <Image
                        alt="Product image"
                        className="object-cover rounded-xl"
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
                          {sizesOrder.map((size) => (
                            <span
                              key={size}
                              className={`px-2 py-1 rounded-small ${
                                availableSizes.includes(size)
                                  ? "bg-primary text-white"
                                  : "bg-zinc-800 text-default-500"
                              }`}
                            >
                              {size}
                            </span>
                          ))}
                        </div>
                        <div className="flex w-full justify-between">
                          <span className="px-2 py-1 rounded-small bg-success-800 text-white">
                            {product.variants[0].price}
                            &nbsp;USD
                          </span>
                        </div>
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
                <CopyButton textToCopy="">Copy Frame URL</CopyButton>
                <div className="flex gap-2">
                  <Button color="danger" variant="light" onPress={onClose}>
                    Delete
                  </Button>
                  {isEditing && (
                    <Button
                      color="primary"
                      onPress={() => setEnableUpdate(true)}
                    >
                      Update
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
