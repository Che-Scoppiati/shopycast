import { Card, CardBody, CardHeader, Image } from "@nextui-org/react";
import { Product } from "@/lib/shopify";

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  isSelectable: boolean;
  onPress: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isSelected,
  isSelectable,
  onPress,
}) => {
  const isNotActive = !isSelectable && !isSelected;
  if (!product) return null;

  const sizesOrder = ["S", "M", "L", "XL"];
  let availableSizes = product.variants.edges.map((edge: any) => {
    const availableForSale = edge.node.availableForSale;
    if (!availableForSale) return null;
    const selectedOptions = edge.node.selectedOptions;
    const sizeOption = selectedOptions.find(
      (option: any) => option.name === "Size",
    );
    return sizeOption.value;
  });
  availableSizes.sort((a, b) => sizesOrder.indexOf(a) - sizesOrder.indexOf(b));
  availableSizes = availableSizes.filter((size) => size !== null);

  const atLeastOneSizeAvailable = availableSizes.some((size) => size !== null);

  return (
    <Card
      className={`p-3 gap-4 ${isSelected ? "bg-primary-light" : "bg-white"} ${isNotActive ? "opacity-60" : ""}`}
      key={product.id}
      isPressable={!isNotActive}
      onPress={onPress}
      style={{
        transition: "all 0.1s ease-in-out",
        cursor: isNotActive ? "not-allowed" : "pointer",
      }}
      onMouseEnter={(e) => {
        isNotActive ? null : (e.currentTarget.style.transform = "scale(0.98)");
      }}
      onMouseLeave={(e) => {
        isNotActive ? null : (e.currentTarget.style.transform = "scale(1)");
      }}
    >
      <CardHeader className="p-0 flex-col items-start gap-2">
        <h4 className="font-bold text-large leading-none">{product.title}</h4>
        <small className="text-default-500 leading-none">
          {product.description}
        </small>
      </CardHeader>
      <CardBody className="overflow-visible p-0">
        <div className="flex flex-col items-center gap-4">
          <Image
            src={product.variants.edges[0].node.image.url}
            alt={product.title}
            className="object-cover rounded-xl aspect-square"
            width={300}
          />
          {atLeastOneSizeAvailable && (
            <div className="flex w-full justify-between">
              <p className="leading-none">Available Sizes</p>
              <p className="leading-none">{availableSizes.join(", ")}</p>
            </div>
          )}
          {!atLeastOneSizeAvailable && (
            <p className="leading-none">Out of stock</p>
          )}
        </div>
      </CardBody>
    </Card>
  );
};
