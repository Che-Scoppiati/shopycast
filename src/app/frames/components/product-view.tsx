import { appURL } from "@/lib/frames";
import { OnchainShopBanner, SoldOutLayer } from "@/app/frames/components";
import { ProductDetails } from "./product-details";
import { ProductVariants } from "./product-variants";
import { ProductImage } from "./product-image";

interface ProductViewPropsProps {
  name: string;
  description?: string;
  quantity?: number;
  image?: string;
  soldout?: boolean;
  currency?: string;
  variants?: string[];
  startingPrice?: number;
}

const ProductView = ({
  name,
  description,
  quantity,
  image,
  startingPrice,
  variants,
  currency = "$",
  soldout = false,
}: ProductViewPropsProps) => {
  return (
    <div tw="relative w-full h-full flex bg-[#dfd0f2] text-white">
      {/* <img src={`${appURL()}/images/background.jpg`} tw="w-full" alt="bg" /> */}
      <div tw="absolute top-0 left-0 w-full h-full flex flex-row justify-start py-[60px] px-[40px]">
        <ProductImage image={image} name={name} />
        <div tw="flex flex-col w-[650px] h-full mx-auto py-0 px-[20px]">
          <ProductDetails name={name} description={description} />
          {variants && <ProductVariants variants={variants} />}
          {startingPrice && startingPrice > 0 ? (
            <div tw="w-auto flex flex-row text-[#292929] items-center mt-[28px]">
              <p
                tw="text-[60px] m-0 mt-[4px]"
                style={{ fontFamily: "Inter-Bold" }}
              >
                <span tw="text-[38px] mr-[10px]">Price</span> {startingPrice}{" "}
                {currency === "USD" ? "$" : ""}
              </p>
              {quantity && (
                <p tw="text-[38px] my-0" style={{ fontFamily: "Inter-Bold" }}>
                  {quantity} left
                </p>
              )}
            </div>
          ) : null}
        </div>
      </div>
      <SoldOutLayer soldout={soldout} />
      <OnchainShopBanner />
    </div>
  );
};

export { ProductView };
