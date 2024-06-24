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
import { Showcase } from "@/lib/mongodb";
import { IoCloseOutline } from "react-icons/io5";
import { ImBin } from "react-icons/im";

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
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      closeButton={<></>}
      size="md"
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
              {showcase.products.map((product) => (
                <div
                  key={product.id}
                  className="flex w-full justify-between items-center"
                >
                  <div className="flex gap-4 items-center">
                    <Image
                      alt="Product image"
                      className="object-cover rounded-xl"
                      src={product.image}
                      width={80}
                    />
                    <div className="flex flex-col gap-1">
                      <h4 className="font-bold text-large leading-none">
                        {product.name}
                      </h4>
                      <small className="text-default-500 leading-none">
                        {product.description}
                      </small>
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
              ))}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Delete
              </Button>
              <Button color="primary" onPress={onClose}>
                Update
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
