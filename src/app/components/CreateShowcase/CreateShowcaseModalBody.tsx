"use client";

import { Products } from "@/app/components/CreateShowcase/Products";
import { Product } from "@/lib/shopify";
import { Spinner } from "@nextui-org/react";

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
      <div className="flex items-end gap-2">
        <h2 className="text-xl font-bold w-fit">Select Products</h2>
        <p>(Max 6)</p>
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
