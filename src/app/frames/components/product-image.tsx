import { appURL } from "@/lib/frames";

interface ProductImageProps {
  image?: string;
  name?: string;
}

const ProductImage = ({ image, name }: ProductImageProps) => {
  return (
    <div tw="flex w-[380px] h-[380px] m-0 overflow-hidden items-center rounded-3xl">
      <img
        src={image ?? `${appURL()}/images/t-shirt.png`}
        tw="h-[390px] mx-auto"
        alt={`${name} product`}
      />
    </div>
  );
};

export { ProductImage };
