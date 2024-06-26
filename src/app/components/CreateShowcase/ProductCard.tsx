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
      className={`p-4 gap-4 ${isSelected ? "bg-zinc-700" : "bg-zinc-800"} ${isNotActive ? "opacity-60" : ""}`}
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
      <CardHeader className="p-0 flex-col items-start gap-1">
        <h4 className="font-bold text-large leading-none text-default-100">
          {product.title}
        </h4>
        <div className="text-default-500 whitespace-nowrap overflow-hidden text-ellipsis w-full text-left">
          <small className="leading-none text-left">
            {product.description}
          </small>
        </div>
      </CardHeader>
      <CardBody className="overflow-visible p-0">
        <div className="flex flex-col items-center gap-4">
          <Image
            src={product.variants.edges[0].node.image.url}
            alt={product.title}
            className="object-cover rounded-xl aspect-square"
            width={500}
          />
          <div className="flex flex-col w-full gap-2">
            <div className="flex w-full justify-between">
              <p className="leading-none font-semibold text-default-300">
                Price
              </p>
              <div className="flex items-center gap-1 text-default-400">
                <p className="leading-none">
                  {product.variants.edges[0].node.price.amount}
                </p>
                <p className="leading-none">
                  {product.variants.edges[0].node.price.currencyCode}
                </p>
              </div>
            </div>
            {atLeastOneSizeAvailable && (
              <div className="flex w-full justify-between">
                <p className="leading-none font-semibold text-default-300">
                  Available Sizes
                </p>
                <p className="leading-none text-default-400">
                  {availableSizes.join(", ")}
                </p>
              </div>
            )}
            {!atLeastOneSizeAvailable && (
              <p className="leading-none ml-auto text-danger">Out of stock</p>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
