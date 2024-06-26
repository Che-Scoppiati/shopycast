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
import { Product as ProductShopify } from "@/lib/shopify";
import { Product as ProductMongo } from "@/lib/mongodb";
import { useQuery } from "@tanstack/react-query";
import confetti from "canvas-confetti";
import { CreateShowcaseModalBody } from "./CreateShowcaseModalBody";
import { appURL } from "@/lib/utils";
import { ShowcaseCreatedModal } from "../ShowcaseCreatedModal";

interface CreateShowcaseModalProps {
  setRefetchShowcases: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CreateShowcaseModal: React.FC<CreateShowcaseModalProps> = ({
  setRefetchShowcases,
}) => {
  const {
    isOpen: isOpenCreateShowcase,
    onOpen: onOpenCreateShowcase,
    onOpenChange: onOpenChangeCreateShowcase,
    onClose: onCloseCreateShowcase,
  } = useDisclosure();

  const { onOpenChange: onOpenChangeSuccess } = useDisclosure();

  const [selectedProducts, setSelectedProducts] = useState<ProductShopify[]>(
    [],
  );
  const [frameUrl, setFrameUrl] = useState<string>("");
  const [enableCreateShowcase, setEnableCreateShowcase] =
    useState<boolean>(false);
  const [showcaseId, setShowcaseId] = useState<string>("");

  const {
    isLoading: isLoadingProducts,
    error: errorProducts,
    data: dataProducts,
  } = useQuery({
    queryKey: ["getAllProducts"],
    queryFn: () => fetch("/api/shopify/products").then((res) => res.json()),
    select: (data) => data.shopifyData,
  });

  const shopId = dataProducts?.shop?.id.split("/")?.pop();
  const postUrl = `/api/${shopId}/showcases`;

  const mongoDbProducts: ProductMongo[] = selectedProducts.map((product) => {
    return {
      id: product.id,
      name: product.title,
      description: product.description,
      image: product.variants.edges[0].node.image.url,
      currency: "USD",
      variants: product.variants.edges
        .map((variant) => {
          if (!variant.node.availableForSale) return null;
          return {
            id: variant.node.id,
            name: "Size",
            value:
              variant.node.selectedOptions.find(
                (option) => option.name === "Size",
              )?.value || "",
            price: parseFloat(variant.node.price.amount),
          };
        })
        .filter((variant) => variant !== null),
    };
  });

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
        body: JSON.stringify({ products: mongoDbProducts }),
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
    }
  }, [isOpenCreateShowcase]);

  return (
    <>
      <Button
        className="h-auto bg-success text-black"
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
        <ModalContent className="bg-zinc-900">
          {(onClose) => (
            <>
              <ModalHeader title={"Create Showcase"} onClose={onClose} />
              <ModalBody className="max-h-[500px] overflow-y-auto">
                <CreateShowcaseModalBody
                  dataProducts={dataProducts}
                  selectedProducts={selectedProducts}
                  isLoadingProducts={isLoadingProducts}
                  errorProducts={errorProducts}
                  setSelectedProducts={setSelectedProducts}
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
                  color="success"
                  onPress={() => setEnableCreateShowcase(true)}
                  isDisabled={
                    !selectedProducts.length || isLoadingCreateShowcase
                  }
                  className="h-auto px-4 py-2"
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
          products: mongoDbProducts,
        }}
        onOpenChangeSuccess={onOpenChangeSuccess}
        setFrameUrl={setFrameUrl}
        setSelectedProducts={setSelectedProducts}
        onCloseCreateShowcase={onCloseCreateShowcase}
      />
    </>
  );
};
