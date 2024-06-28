"use client";

import { Product } from "@/lib/mongodb";
import { ProductCard } from "./ProductCard";

interface ProductsProps {
  products: Product[];
  selectedProducts: string[];
  setSelectedProducts: (productIds: string[]) => void;
}

export const Products: React.FC<ProductsProps> = ({
  products,
  selectedProducts,
  setSelectedProducts,
}) => {
  return (
    <>
      {products.map((product: Product) => (
        <ProductCard
          key={product.id}
          product={product}
          isSelected={selectedProducts.includes(product.id)}
          isSelectable={selectedProducts.length < 6}
          onPress={
            selectedProducts.includes(product.id)
              ? () =>
                  setSelectedProducts(
                    selectedProducts.filter((p) => p !== product.id),
                  )
              : () => setSelectedProducts([...selectedProducts, product.id])
          }
        />
      ))}
    </>
  );
};
