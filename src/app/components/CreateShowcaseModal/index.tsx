import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { ModalHeader } from "../ModalHeader";
import { Product as ProductMongo } from "@/lib/mongodb";
import { useQuery } from "@tanstack/react-query";
import confetti from "canvas-confetti";
import { CreateShowcaseModalBody } from "./CreateShowcaseModalBody";
import { appURL } from "@/lib/utils";
import { ShowcaseCreatedModal } from "../ShowcaseCreatedModal";

interface CreateShowcaseModalProps {
  shopId: string;
  products: ProductMongo[] | null;
  isLoadingProducts: boolean;
  errorProducts: Error | null;

  setRefetchShowcases: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CreateShowcaseModal: React.FC<CreateShowcaseModalProps> = ({
  shopId,
  products,
  isLoadingProducts,
  errorProducts,
  setRefetchShowcases,
}) => {
  const {
    isOpen: isOpenCreateShowcase,
    onOpen: onOpenCreateShowcase,
    onOpenChange: onOpenChangeCreateShowcase,
    onClose: onCloseCreateShowcase,
  } = useDisclosure();

  const { onOpenChange: onOpenChangeSuccess } = useDisclosure();

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [frameUrl, setFrameUrl] = useState<string>("");
  const [enableCreateShowcase, setEnableCreateShowcase] =
    useState<boolean>(false);
  const [showcaseId, setShowcaseId] = useState<string>("");
  const [showcaseName, setShowcaseName] = useState<string>("");

  const postUrl = `/api/${shopId}/showcases`;

  const {
    isLoading: isLoadingCreateShowcase,
    error: errorCreateShowcase,
    data: dataCreateShowcase,
  } = useQuery({
    queryKey: ["postShowCase"],
    queryFn: () =>
      fetch(postUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productIds: selectedProducts,
          name: showcaseName,
        }),
      }).then((res) => res.json()),
    enabled: shopId !== undefined && enableCreateShowcase,
  });

  useEffect(() => {
    if (dataCreateShowcase) {
      const createdShowcaseId = dataCreateShowcase.showcase.id;
      setShowcaseId(createdShowcaseId);
      setFrameUrl(`${appURL()}/frames/${shopId}/${createdShowcaseId}`);
      confetti({
        particleCount: 200,
        spread: 70,
        origin: { y: 0.5 },
      });
      setEnableCreateShowcase(false);
      setRefetchShowcases(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataCreateShowcase]);

  useEffect(() => {
    if (errorCreateShowcase) {
      console.error(errorCreateShowcase);
      setEnableCreateShowcase(false);
    }
  }, [errorCreateShowcase]);

  const handleResetSelection = () => {
    setSelectedProducts([]);
  };

  useEffect(() => {
    if (!isOpenCreateShowcase) {
      setSelectedProducts([]);
      setFrameUrl("");
      setShowcaseName("");
    }
  }, [isOpenCreateShowcase]);

  if (!products) {
    return (
      <Button className="bg-primary-light text-black" size="md" isDisabled>
        Create
      </Button>
    );
  }

  return (
    <>
      <Button
        className="bg-primary-light text-black"
        size="md"
        onPress={onOpenCreateShowcase}
      >
        Create
      </Button>
      <Modal
        isOpen={isOpenCreateShowcase}
        onOpenChange={onOpenChangeCreateShowcase}
        size="5xl"
        backdrop="blur"
        closeButton={<></>}
      >
        <ModalContent className="bg-zinc-950">
          {(onClose) => (
            <>
              <ModalHeader title={"Create Showcase"} onClose={onClose} />
              <ModalBody className="max-h-[600px] overflow-y-auto">
                <CreateShowcaseModalBody
                  products={products}
                  selectedProducts={selectedProducts}
                  isLoadingProducts={isLoadingProducts}
                  errorProducts={errorProducts}
                  setSelectedProducts={setSelectedProducts}
                  showcaseName={showcaseName}
                  setShowcaseName={setShowcaseName}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  size="md"
                  color="danger"
                  onClick={handleResetSelection}
                  isDisabled={!selectedProducts.length}
                  className="h-auto px-4 py-2"
                >
                  Reset
                </Button>
                <Button
                  size="md"
                  onPress={() => setEnableCreateShowcase(true)}
                  isDisabled={
                    !showcaseName ||
                    !selectedProducts.length ||
                    isLoadingCreateShowcase
                  }
                  className="h-auto px-4 py-2 bg-primary-light"
                  isLoading={isLoadingCreateShowcase}
                >
                  {!isLoadingCreateShowcase && "Create"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <ShowcaseCreatedModal
        isOpenSuccess={!!frameUrl}
        showcase={{
          id: showcaseId,
          shopId: shopId,
          products: selectedProducts,
          name: showcaseName,
        }}
        products={products}
        onOpenChangeSuccess={onOpenChangeSuccess}
        setFrameUrl={setFrameUrl}
        setSelectedProducts={setSelectedProducts}
        onCloseCreateShowcase={onCloseCreateShowcase}
      />
    </>
  );
};
