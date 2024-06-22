"use client";

import { useState } from "react";
import { Product } from "@/lib/shopify";
import { ProductCard } from "@/app/components/CreateFrame/ProductCard";

interface ProductsProps {
  shopifyData: any;
}

export const Products: React.FC<ProductsProps> = ({ shopifyData }) => {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  return (
    <>
      {shopifyData &&
        shopifyData.products.nodes.map((product: Product) => (
          <ProductCard
            key={product.id}
            product={product}
            isSelected={selectedProducts.includes(product)}
            onPress={
              selectedProducts.includes(product)
                ? () =>
                    setSelectedProducts(
                      selectedProducts.filter((p) => p !== product),
                    )
                : () => setSelectedProducts([...selectedProducts, product])
            }
          />
        ))}
    </>
  );
};
