import {
  Card,
  CardBody,
  CardHeader,
  Image,
  useDisclosure,
} from "@nextui-org/react";
import { CopyButton } from "../CopyButton";
import { Showcase } from "@/lib/mongodb";
import { ShowcaseModal } from "./ShowcaseModal";

interface ShowcaseCardProps {
  showcase: Showcase;
  index: number;
}

export const ShowcaseCard: React.FC<ShowcaseCardProps> = ({
  showcase,
  index,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Card
        key={showcase.id}
        className={"p-3 gap-4 bg-zinc-800"}
        isPressable
        onPress={onOpen}
      >
        <CardHeader className="flex w-full justify-between p-0 items-start">
          <div className="flex flex-col items-start gap-1">
            <h4 className="font-bold text-large leading-none text-default-200">
              Showcase {index + 1}
            </h4>
            <small className="text-default-500 leading-none">
              {showcase.products.length} product(s)
            </small>
          </div>
          <CopyButton
            textToCopy={`http://localhost:3000/frames/${showcase.shopId}/${showcase.id}`}
            className="h-auto p-1 rounded-small"
          >
            Copy URL
          </CopyButton>
        </CardHeader>
        <CardBody className="overflow-visible p-0">
          <div className="grid items-center gap-4 grid-cols-3">
            {showcase.products.map((product) => (
              <Image
                key={product.id}
                alt="Product image"
                className="object-cover rounded-xl aspect-square"
                src={product.image}
                width={100}
              />
            ))}
          </div>
        </CardBody>
      </Card>
      <ShowcaseModal
        showcase={showcase}
        showcaseIndex={index}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
    </>
  );
};
