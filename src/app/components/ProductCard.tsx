import { Button, Card, CardBody, CardHeader, Image } from "@nextui-org/react";
import { Product } from "../utils";

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onPress: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isSelected,
  onPress,
}) => {
  if (!product) return null;
  return (
    <Card
      className="p-3 gap-4"
      key={product.id}
      isPressable={true}
      onPress={onPress}
      style={{
        backgroundColor: isSelected ? "#f3c0ff" : "white",
      }}
    >
      <CardHeader className="p-0 flex-col items-start gap-2">
        <h4 className="font-bold text-large leading-none">{product.title}</h4>
        <small className="text-default-500 leading-none">
          {product.description}
        </small>
      </CardHeader>
      <CardBody className="overflow-visible p-0">
        {product.variants.edges.map((edge: any) => (
          <div className="flex flex-col items-center gap-4" key={edge.node.id}>
            <Image
              src={edge.node.image.url}
              alt={product.title}
              className="object-cover rounded-xl aspect-square"
              width={300}
            />
            <div className="flex w-full justify-between">
              <div className="flex flex-col gap-1">
                <p className="leading-none">
                  {edge.node.price.amount} {edge.node.price.currencyCode}
                </p>
                <p className="leading-none">
                  {edge.node.availableForSale ? "Available" : "Sold out"}
                </p>
              </div>
              <Button color="primary">Buy</Button>
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  );
};
