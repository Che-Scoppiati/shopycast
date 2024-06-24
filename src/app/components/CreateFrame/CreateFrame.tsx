"use client";

import { useState } from "react";
import { Button, Input, Spinner } from "@nextui-org/react";
import { Products } from "@/app/components/CreateFrame/Products";
import { Product } from "@/lib/shopify";
import { useQuery } from "@tanstack/react-query";
import confetti from "canvas-confetti";
import { CopyButton } from "../CopyButton";

const CreateFrame = () => {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [frameUrl, setFrameUrl] = useState<string>("");
  const [shopId, setShopId] = useState<string>("[shopId]");
  const [frameId, setFrameId] = useState<string>("[frameId]");

  const { isLoading, error, data } = useQuery({
    queryKey: ["getAllProducts"],
    queryFn: () => fetch("/api/shopify/products").then((res) => res.json()),
    select: (data) => data.shopifyData,
  });

  if (isLoading) return <Spinner color="primary" size="lg" />;
  if (error) return "An error has occurred: " + error.message;

  const handleCreateFrame = () => {
    setFrameUrl(`http://localhost:3000/frames/${shopId}/${frameId}`);
    confetti({
      particleCount: 200,
      spread: 70,
      origin: { y: 0.5 },
    });
  };

  const handleResetSelection = () => {
    setSelectedProducts([]);
    setFrameUrl("");
  };

  return (
    <div className="w-full flex flex-col gap-16">
      <div className="w-full flex justify-between">
        <Input
          type="text"
          label="Your Shopify Key"
          classNames={{
            label: ["text-black"],
            inputWrapper: ["w-[33%] bg-primary-light"],
          }}
        />
        {!frameUrl && (
          <p className="text-xl w-[33%] text-end">
            Select your products and create a frame to embed on Farcaster!
          </p>
        )}
        {frameUrl && (
          <CopyButton textToCopy={frameUrl}>Copy Frame URL</CopyButton>
        )}
      </div>
      <div className="w-full flex flex-col gap-6">
        <div className="flex w-full justify-between h-[40px]">
          <div className="flex items-end gap-2">
            <h2 className="text-3xl font-bold w-fit">Select Products</h2>
            <p>(Max 6)</p>
          </div>
          <div className="flex gap-4">
            {(selectedProducts.length > 0 || frameUrl) && (
              <Button size="md" color="danger" onClick={handleResetSelection}>
                Reset
              </Button>
            )}
            {selectedProducts.length > 0 && (
              <Button size="md" color="primary" onClick={handleCreateFrame}>
                Create Frame
              </Button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-6">
          <Products
            shopifyData={data}
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateFrame;
