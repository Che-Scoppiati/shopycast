import { Card, CardBody, CardHeader, Image } from "@nextui-org/react";
import { CopyButton } from "../CopyButton";
import { Showcase } from "@/lib/mongodb";

interface ShowcaseCardProps {
  showcase: Showcase;
  index: number;
}

export const ShowcaseCard: React.FC<ShowcaseCardProps> = ({
  showcase,
  index,
}) => {
  return (
    <Card key={showcase.id} className={"p-3 gap-4 bg-white"}>
      <CardHeader className="flex w-full justify-between p-0">
        <div className="flex flex-col items-start gap-1">
          <h4 className="font-bold text-large leading-none">
            Showcase {index + 1}
          </h4>
          <small className="text-default-500 leading-none">
            {showcase.products.length} product(s)
          </small>
        </div>
        <CopyButton textToCopy="">Copy URL</CopyButton>
      </CardHeader>
      <CardBody className="overflow-visible p-0">
        <div className="grid items-center gap-4 grid-cols-3">
          {showcase.products.map((product) => (
            <Image
              key={product.id}
              alt="Product image"
              className="object-cover rounded-xl"
              src={product.image}
              width={80}
            />
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
