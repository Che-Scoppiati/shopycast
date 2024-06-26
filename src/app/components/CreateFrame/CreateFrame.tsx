"use client";

import { useEffect, useState } from "react";
import { Button, Input, Spinner } from "@nextui-org/react";
import { Products } from "@/app/components/CreateFrame/Products";
import { Product as ProductShopify } from "@/lib/shopify";
import { Product as ProductMongo } from "@/lib/mongodb";
import { useQuery } from "@tanstack/react-query";
import confetti from "canvas-confetti";
import { CopyButton } from "@/app/components/CopyButton";

const CreateFrame = () => {
  const [selectedProducts, setSelectedProducts] = useState<ProductShopify[]>(
    [],
  );
  const [frameUrl, setFrameUrl] = useState<string>("");
  const [enableCreateShowcase, setEnableCreateShowcase] =
    useState<boolean>(false);

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

  const handleResetSelection = () => {
    setSelectedProducts([]);
    setFrameUrl("");
  };

  useEffect(() => {
    if (dataCreateShowcase) {
      console.log(dataCreateShowcase);
      const showcaseId = dataCreateShowcase.showcase.id;
      setFrameUrl(`http://localhost:3000/frames/${shopId}/${showcaseId}`);
      confetti({
        particleCount: 200,
        spread: 70,
        origin: { y: 0.5 },
      });
      setEnableCreateShowcase(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataCreateShowcase]);

  useEffect(() => {
    if (errorCreateShowcase) {
      console.error(errorCreateShowcase);
      setEnableCreateShowcase(false);
    }
  }, [errorCreateShowcase]);

  if (isLoadingProducts) return <Spinner color="primary" size="lg" />;
  if (errorProducts) return "An error has occurred: " + errorProducts.message;

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex w-full justify-between">
        <div className="flex items-end gap-2">
          <h2 className="text-xl font-bold w-fit">Select Products</h2>
          <p>(Max 6)</p>
        </div>
        <div className="flex gap-4">
          <Button
            size="md"
            color="danger"
            onClick={handleResetSelection}
            isDisabled={!selectedProducts.length && !frameUrl}
            className="h-auto px-4 py-2"
          >
            Reset
          </Button>
          <Button
            size="md"
            color="primary"
            onPress={() => setEnableCreateShowcase(true)}
            isDisabled={!selectedProducts.length || isLoadingCreateShowcase}
            className="h-auto px-4 py-2"
          >
            {!isLoadingCreateShowcase && "Create Frame"}
            {isLoadingCreateShowcase && <Spinner color="white" size="sm" />}
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-6">
        <Products
          shopifyData={dataProducts}
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
        />
      </div>
    </div>
  );
};

export default CreateFrame;
