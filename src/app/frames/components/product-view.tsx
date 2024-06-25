import { appURL } from "@/lib/frames";
import { OnchainShopBanner, SoldOutLayer } from "@/app/frames/components";

interface ProductViewPropsProps {
  name: string;
  description?: string;
  quantity: number;
  image?: string;
  soldout?: boolean;
  currency?: string;
  variants?: string[];
  prices?: number[];
}

const ProductView = ({
  name,
  description,
  quantity,
  image,
  prices,
  variants,
  currency = "$",
  soldout = false,
}: ProductViewPropsProps) => {
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
          {variants && (
            <div tw="w-full flex flex-col mt-[40px]">
              <p
                tw="text-[42px] my-0 font-extrabold text-[#351161]"
                style={{ fontFamily: "Inter-Bold" }}
              >
                available sizes:
              </p>
              <div tw="w-full flex flex-row mt-[20px]">
                {variants?.map((variant, index) => (
                  <div
                    key={index}
                    tw="flex flex-col text-[#351161] justify-center items-center h-[60px] w-[60px] mx-[10px] bg-white text-[#292929] rounded-full text-[28px]"
                  >
                    {variant}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div tw="w-auto flex flex-row text-[#292929] justify-between items-center">
            <p tw="text-[48px]" style={{ fontFamily: "Inter-Bold" }}>
              {prices ?? [0]}
              {currency ?? ""}
            </p>
            {quantity && (
              <p tw="text-[38px] my-0" style={{ fontFamily: "Inter-Bold" }}>
                {quantity} left
              </p>
            )}
          </div>
        </div>
      </div>
      <SoldOutLayer soldout={soldout} />
      <OnchainShopBanner />
    </div>
  );
};

export { ProductView };
