import { appURL } from "@/lib/frames";

interface ProductImageProps {
  image?: string;
  name?: string;
}

const ProductImage = ({ image, name }: ProductImageProps) => {
  return (
    <div tw="flex w-[360px] h-[360px] m-0 overflow-hidden items-center rounded-3xl">
      <img
        src={image ?? `${appURL()}/images/t-shirt.png`}
        tw="object-cover"
        alt={`${name} product`}
      />
    </div>
  );
};

export { ProductImage };
