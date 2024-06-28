import {
  Card,
  CardBody,
  CardHeader,
  Image,
  useDisclosure,
} from "@nextui-org/react";
import { Product, Showcase } from "@/lib/mongodb";
import { ShowcaseModal } from "./ShowcaseModal";
import { Dispatch, SetStateAction } from "react";
import { CopyButton } from "../CopyButton";
import { appURL } from "@/lib/utils";

interface ShowcaseCardProps {
  showcase: Omit<Showcase, "createdAt">;
  products: Product[];
  clickable?: boolean;
  customTitleClassNames?: string;
  setRefetchShowcases: Dispatch<SetStateAction<boolean>>;
}

export const ShowcaseCard: React.FC<ShowcaseCardProps> = ({
  showcase,
  products,
  clickable = true,
  customTitleClassNames = "",
  setRefetchShowcases,
}) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const showcaseProducts = showcase.products
    .map((productId) => products.find((product) => product.id === productId))
    .filter((product) => product !== undefined) as Product[];

  return (
    <>
      <Card
        key={showcase.id}
        className={`p-4 gap-4 bg-zinc-950 outline-1 outline-zinc-700 ${clickable ? "hover:outline-2 hover:outline-primary-light" : ""} shadow-secondary-300`}
        style={{
          transition: "all 0.1s ease-in-out",
        }}
        isPressable={clickable}
        onPress={onOpen}
      >
        <CardHeader className="flex w-full justify-between p-0 items-start">
          <div className="flex flex-col items-start gap-1">
            <h4
              className={`font-bold text-large leading-none ${customTitleClassNames}`}
            >
              {showcase.name}
            </h4>
            <small className="text-default-500 leading-none">
              {showcase.products.length} product(s)
            </small>
          </div>
          <CopyButton
            textToCopy={`${appURL()}/frames/${showcase.shopId}/${showcase.id}`}
            className="h-auto p-1 rounded-small"
          >
            Copy URL
          </CopyButton>
        </CardHeader>
        <CardBody className="overflow-visible p-0">
          <div className="grid items-center gap-4 grid-cols-3">
            {showcaseProducts.map((product) => (
              <Image
                key={product.id}
                alt="Product image"
                className="object-cover rounded-xl aspect-square outline outline-1 outline-zinc-300 p-[2px]"
                src={product.image}
                width={100}
              />
            ))}
          </div>
        </CardBody>
      </Card>
      <ShowcaseModal
        showcase={showcase}
        products={showcaseProducts}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
        setRefetchShowcases={setRefetchShowcases}
      />
    </>
  );
};
