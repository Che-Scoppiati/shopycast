import { Product } from "@/lib/mongodb";
import { Badge, Card, CardBody, CardHeader, Image } from "@nextui-org/react";
import { FaCheck } from "react-icons/fa";

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
  let availableSizes = product.variants?.map((variant) => variant.value);
  availableSizes?.sort((a, b) => sizesOrder.indexOf(a) - sizesOrder.indexOf(b));
  availableSizes = availableSizes?.filter((size) => size !== null);

  const isOutOfStock = availableSizes?.length === 0;

  return (
    <Badge
      content={<FaCheck color="black" />}
      className={`rounded-full p-1 border-none ${isSelected ? "opacity-100" : "opacity-0"} transition-all duration-100 ease-in-out absolute top-1 right-1 bg-primary-light`}
    >
      <Card
        className={`p-4 gap-4 outline-1 outline-zinc-700 ${isSelected ? "bg-zinc-800 outline-2 outline-primary-light" : isNotActive ? "bg-zinc-900" : "bg-zinc-900 hover:outline-2 hover:outline-primary-light hover:shadow-neon  hover:outline-offset-4"} ${isNotActive ? "opacity-60 cursor-not-allowed" : "cursor-pointer"} transition-all duration-100 ease-in-out`}
        style={{
          transition: "all 0.1s ease-in-out",
        }}
        key={product.id}
        isPressable={!isNotActive}
        onPress={onPress}
      >
        <CardHeader className="p-0 flex-col items-start gap-1">
          <h4 className="font-bold text-md sm:text-lg leading-none text-default-100">
            {product.name}
          </h4>
          <div className="text-sm sm:text-md text-default-500 whitespace-nowrap overflow-hidden text-ellipsis w-full text-left">
            <small className="leading-none text-left">
              {product.description}
            </small>
          </div>
        </CardHeader>
        <CardBody className="overflow-visible p-0">
          <div className="flex flex-col items-center gap-4 h-full justify-between">
            <Image
              src={product.image}
              alt={product.name}
              className="object-cover rounded-xl aspect-square outline outline-1 outline-zinc-300 p-[2px]"
              width={500}
            />
            <div className="flex flex-col w-full gap-2">
              {product.variants && product.variants?.length > 0 && (
                <div className="flex w-full justify-between">
                  <p className="text-sm sm:text-md leading-none font-semibold text-default-300">
                    Price
                  </p>
                  <div className="text-sm sm:text-md flex items-center gap-1 text-default-400">
                    <p className="leading-none">{product.variants[0].price}</p>
                    <p className="leading-none">{product.currency}</p>
                  </div>
                </div>
              )}
              {!isOutOfStock && availableSizes && (
                <div className="flex w-full justify-between">
                  <p className="text-sm sm:text-md leading-none font-semibold text-default-300">
                    Available Sizes
                  </p>
                  <p className="text-sm sm:text-md leading-none text-default-400">
                    {availableSizes.join(", ")}
                  </p>
                </div>
              )}
              {isOutOfStock && (
                <p className="leading-none ml-auto text-danger">Out of stock</p>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </Badge>
  );
};
