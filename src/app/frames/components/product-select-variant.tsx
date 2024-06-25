import { appURL } from "@/lib/frames";
import { OnchainShopBanner, SoldOutLayer } from "@/app/frames/components";

interface ProductSelectVariantPropsProps {
  name: string;
  description?: string;
  quantity: number;
  image?: string;
  soldout?: boolean;
  currency?: string;
  variants?: string[];
  prices?: number[];
}

const ProductSelectVariant = ({
  name,
  description,
  quantity,
  image,
  prices,
  variants,
  currency = "$",
  soldout = false,
}: ProductSelectVariantPropsProps) => {
  return (
    <div tw="relative w-full h-full flex bg-[#c4a1f0] text-white">
      {/* <img src={`${appURL()}/images/background.jpg`} tw="w-full" alt="bg" /> */}
      <div tw="absolute top-0 left-0 w-full h-full flex flex-row justify-start py-[20px] px-[40px]">
        <img
          src={image ?? `${appURL()}/images/t-shirt.png`}
          tw="w-[400px] h-[400px] mt-[20px]"
          alt={`${name} product`}
        />
        <div tw="flex flex-col h-full mx-auto">
          <div tw="w-full flex flex-col text-[#292929]">
            <p
              tw="text-[48px] text-[#351161]"
              style={{ fontFamily: "Inter-Bold" }}
            >
              {name}
            </p>
            <p tw="text-[32px] my-0" style={{ fontFamily: "Inter-Bold" }}>
              {description}
            </p>
          </div>

          <div tw="w-[450px] flex flex-col mt-[80px] text-wrap">
            <p
              tw="text-[50px] my-0 font-extrabold text-[#351161] p-0"
              style={{ fontFamily: "Inter-Bold" }}
            >
              please select a size to continue
            </p>
            <p tw="text-[84px] mx-auto p-0 my-[20px]">👇🏼</p>
          </div>
        </div>
      </div>
      <SoldOutLayer soldout={soldout} />
      <OnchainShopBanner />
    </div>
  );
};

export { ProductSelectVariant };
