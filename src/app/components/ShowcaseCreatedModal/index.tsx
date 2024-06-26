import React from "react";
import { Modal, ModalContent, ModalBody, ModalFooter } from "@nextui-org/react";
import { ModalHeader } from "../ModalHeader";
import { CopyButton } from "../CopyButton";
import { Product } from "@/lib/shopify";

interface ShowcaseCreatedModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  frameUrl: string;
  setFrameUrl: React.Dispatch<React.SetStateAction<string>>;
  setSelectedProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export const ShowcaseCreatedModal: React.FC<ShowcaseCreatedModalProps> = ({
  isOpen,
  onOpenChange,
  frameUrl,
  setFrameUrl,
  setSelectedProducts,
}) => {
  const handleClose = () => {
    setFrameUrl("");
    setSelectedProducts([]);
    onOpenChange(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      closeButton={<></>}
      size="lg"
    >
      <ModalContent className="bg-zinc-900">
        <ModalHeader
          title={"🎉 Showcase created successfully!"}
          onClose={handleClose}
        />
        <ModalBody>
          <p></p>
        </ModalBody>
        <ModalFooter>
          <CopyButton textToCopy={frameUrl} className="h-auto p-2">
            Copy Frame URL
          </CopyButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
