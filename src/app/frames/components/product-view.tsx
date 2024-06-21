import { appURL } from "@/lib/utils";
import { OnchainShopBanner } from "./onchain-shop-banner";

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
    <div tw="relative w-full h-full flex bg-[#0042F5] text-white">
      {/* <img src={`${appURL()}/images/background.jpg`} tw="w-full" alt="bg" /> */}
      <div tw="absolute top-0 left-0 w-full h-full flex flex-row justify-start py-[20px] px-[40px]">
        <img
          src={image ?? `${appURL()}/images/t-shirt.png`}
          tw="w-[400px] h-[400px] mt-[20px]"
          alt={`${name} product`}
        />
        <div tw="flex flex-col h-full mx-auto">
          <div tw="w-full flex flex-col text-white">
            <p tw="text-[48px]" style={{ fontFamily: "Inter-Bold" }}>
              {name}
            </p>
            <p tw="text-[38px] my-0" style={{ fontFamily: "Inter-Bold" }}>
              {description}
            </p>
          </div>
          {variants && (
            <div tw="w-full flex flex-col mt-[20px]">
              <p
                tw="text-[42px] my-0 font-extrabold text-amber-600"
                style={{ fontFamily: "Inter-Bold" }}
              >
                available sizes:
              </p>
              <div tw="w-full flex flex-row mt-[20px]">
                {/* create here a row with all variants as a group of circle with inside the variant value */}
                {variants?.map((variant, index) => (
                  <div
                    key={index}
                    tw="flex flex-col justify-center items-center h-[60px] w-[60px] mx-[10px] bg-white text-black rounded-full text-[28px]"
                  >
                    {variant}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div tw="w-auto flex flex-col">
            <p tw="text-[48px]" style={{ fontFamily: "Inter-Bold" }}>
              {prices ?? [0]}
              {currency ?? ""}
            </p>
          </div>
        </div>
      </div>
      {soldout && (
        <div tw="absolute inline-block w-full mt-[200px] ml-[30px] flex">
          <img
            src={`${appURL()}/images/sold_out.png`}
            tw="w-[400px]"
            alt="sold-out"
          />
        </div>
      )}
      <OnchainShopBanner />
    </div>
  );
};

export { ProductView };
