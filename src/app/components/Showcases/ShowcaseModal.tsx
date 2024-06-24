import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Image,
} from "@nextui-org/react";
import { Showcase, Variant } from "@/lib/mongodb";
import { IoCloseOutline } from "react-icons/io5";
import { ImBin } from "react-icons/im";
import { CopyButton } from "../CopyButton";

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
            <ModalHeader className="flex w-full justify-between items-center">
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
                return (
                  <div
                    key={product.id}
                    className="flex w-full justify-between items-center"
                  >
                    <div className="flex gap-4 items-center">
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
                    <Button
                      isIconOnly
                      className="p-1 min-w-0 w-10 h-10 rounded-small bg-danger"
                      onPress={onClose}
                    >
                      <ImBin size={18} color="white" />
                    </Button>
                  </div>
                );
              })}
            </ModalBody>
            <ModalFooter>
              <div className="flex w-full justify-between">
                <CopyButton textToCopy="">Copy Frame URL</CopyButton>
                <div className="flex gap-2">
                  <Button color="danger" variant="light" onPress={onClose}>
                    Delete
                  </Button>
                  <Button color="primary" onPress={onClose}>
                    Update
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
