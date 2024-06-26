import { appURL } from "@/lib/frames";
import { OnchainShopBanner, SoldOutLayer } from "@/app/frames/components";
import { ProductImage } from "./product-image";
import { ProductDetails } from "./product-details";

interface ProductSelectVariantPropsProps {
  name: string;
  description?: string;
  quantity?: number;
  image?: string;
  currency?: string;
  variants?: string[];
  soldout?: boolean;
  startingPrice?: number;
}

const ProductSelectVariant = ({
  name,
  description,
  quantity,
  image,
  startingPrice,
  variants,
  currency = "$",
  soldout = false,
}: ProductSelectVariantPropsProps) => {
  return (
    <div tw="relative w-full h-full flex bg-[#dfd0f2] text-white">
      {/* <img src={`${appURL()}/images/background.jpg`} tw="w-full" alt="bg" /> */}
      <div tw="absolute top-0 left-0 w-full h-full flex flex-row justify-start py-[60px] px-[40px]">
        <ProductImage image={image} name={name} />
        <div tw="flex flex-col w-[650px] h-full mx-auto py-0 px-[20px]">
          <ProductDetails name={name} description={description} />

          <div tw="w-[450px] flex flex-col mt-[102px] text-wrap">
            <p
              tw="text-[44px] my-0 font-extrabold text-[#351161] p-0"
              style={{ fontFamily: "Inter-Bold" }}
            >
              Please select a size to continue
            </p>
          </div>
        </div>
      </div>
      <SoldOutLayer soldout={soldout} />
      <OnchainShopBanner />
    </div>
  );
};

export { ProductSelectVariant };
