"use client";

import { Product } from "@/lib/shopify";
import { ProductCard } from "@/app/components/CreateFrame/ProductCard";

interface ProductsProps {
  shopifyData: any;
  selectedProducts: Product[];
  setSelectedProducts: (products: Product[]) => void;
}

export const Products: React.FC<ProductsProps> = ({
  shopifyData,
  selectedProducts,
  setSelectedProducts,
}) => {
  return (
    <>
      {shopifyData &&
        shopifyData.products.nodes.map((product: Product) => (
          <ProductCard
            key={product.id}
            product={product}
            isSelected={selectedProducts.includes(product)}
            isSelectable={selectedProducts.length < 6}
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
