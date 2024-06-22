"use client";

import { useEffect, useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { Products } from "@/app/components/CreateFrame/Products";

const CreateFrame = () => {
  const [shopifyData, setShopifyData] = useState();
  //  TODO use react-query to fetch shopify data
  useEffect(() => {
    const fetchShopifyData = async () => {
      const response = await fetch("/api/shopify/products");
      const data = await response.json();
      setShopifyData(data.shopifyData);
    };

    fetchShopifyData();
  }, []);

  return (
    <div className="w-full flex flex-col gap-16">
      <div className="w-full flex justify-between">
        <Input type="text" label="Your Shopify Key" className="w-[33%]" />
        <p className="text-xl w-[33%] text-end">
          Select your products and create a frame to embed on Farcaster!
        </p>
      </div>
      <div className="w-full flex flex-col gap-6">
        <div className="flex w-full justify-between">
          <h2 className="text-3xl font-bold w-fit">Select Products</h2>
          <Button size="md" color="primary">
            Create Frame
          </Button>
        </div>
        <div className="grid grid-cols-4 gap-6">
          <Products shopifyData={shopifyData} />
        </div>
      </div>
    </div>
  );
};

export default CreateFrame;
