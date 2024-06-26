"use client";

import { Product } from "@/lib/shopify";
import { Spinner } from "@nextui-org/react";
import { Products } from "./Products";

interface CreateShowcaseModalBodyProps {
  dataProducts: any;
  selectedProducts: Product[];
  isLoadingProducts: boolean;
  errorProducts: Error | null;
  setSelectedProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export const CreateShowcaseModalBody: React.FC<
  CreateShowcaseModalBodyProps
> = ({
  dataProducts,
  selectedProducts,
  isLoadingProducts,
  errorProducts,
  setSelectedProducts,
}) => {
  if (isLoadingProducts) return <Spinner color="primary" size="lg" />;
  if (errorProducts) return "An error has occurred: " + errorProducts.message;
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col items-start gap-1">
        <h2 className="text-xl font-bold w-fit">
          Your imported Shopify products
        </h2>
        <h4 className="text-default-500">
          Select a maximum of 6 products to create a showcase
        </h4>
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
