import React from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { ModalHeader } from "./ModalHeader";
import { Showcase } from "@/lib/mongodb";
import { Product as ProductShopify } from "@/lib/shopify";
import { ShowcaseCard } from "./Showcases/ShowcaseCard";

interface ShowcaseCreatedModalProps {
  isOpenSuccess: boolean;
  showcase: Showcase;
  onOpenChangeSuccess: (isOpen: boolean) => void;
  setFrameUrl: React.Dispatch<React.SetStateAction<string>>;
  setSelectedProducts: React.Dispatch<React.SetStateAction<ProductShopify[]>>;
  onCloseCreateShowcase: () => void;
}

export const ShowcaseCreatedModal: React.FC<ShowcaseCreatedModalProps> = ({
  isOpenSuccess,
  showcase,
  onOpenChangeSuccess,
  setFrameUrl,
  setSelectedProducts,
  onCloseCreateShowcase,
}) => {
  const handleClose = () => {
    setFrameUrl("");
    setSelectedProducts([]);
    onOpenChangeSuccess(false);
  };

  const handleBackToShowcases = () => {
    onCloseCreateShowcase();
    handleClose();
  };

  return (
    <Modal
      isOpen={isOpenSuccess}
      onOpenChange={onOpenChangeSuccess}
      backdrop="blur"
      closeButton={<></>}
      size="sm"
    >
      <ModalContent className="bg-zinc-900">
        <ModalHeader title={"🎉 Showcase created!"} onClose={handleClose} />
        <ModalBody className="pt-0 gap-4">
          <div className="flex flex-col items-start">
            <span className="text-default-500 text-md">
              Your showcase is ready to be shared!
            </span>
            <span className="text-default-500 text-md">
              Copy the Frame URL and cast it 🚀
            </span>
          </div>
          <ShowcaseCard
            showcase={showcase}
            index={0}
            setRefetchShowcases={() => {}}
            clickable={false}
            customTitleClassNames="text-default-100"
          />
        </ModalBody>
        <ModalFooter className="flex justify-end gap-4">
          <Button
            color="primary"
            onClick={handleBackToShowcases}
            className="h-auto px-4 py-2"
          >
            Back to Showcases
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
