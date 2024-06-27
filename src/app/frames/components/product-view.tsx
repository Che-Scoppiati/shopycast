import { appURL } from "@/lib/utils";
import { OnchainShopBanner, SoldOutLayer } from "@/app/frames/components";
import { ProductDetails } from "./product-details";
import { ProductVariants } from "./product-variants";
import { ProductImage } from "./product-image";
import { UserDataReturnType } from "frames.js";
import { UserBanner } from "./user-banner";
import { ShoppingCart } from "./shopping-cart";

interface ProductViewPropsProps {
  name: string;
  description?: string;
  quantity?: number;
  image?: string;
  soldout?: boolean;
  currency?: string;
  variants?: string[];
  startingPrice?: number;
  user?: UserDataReturnType;
  cartCount: number;
}

const ProductView = ({
  name,
  description,
  quantity,
  image,
  startingPrice,
  variants,
  user,
  cartCount,
  currency = "$",
  soldout = false,
}: ProductViewPropsProps) => {
  return (
    <div tw="relative w-full h-full flex bg-[#dfd0f2] text-white">
      {/* <img src={`${appURL()}/images/background.jpg`} tw="w-full" alt="bg" /> */}
      <div tw="absolute top-0 left-0 w-full h-full flex flex-row justify-start py-[120px] px-[40px]">
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
                {startingPrice} {currency === "USD" ? "$" : ""}
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
      <UserBanner user={user} />
      <ShoppingCart numberOfProducts={cartCount} />
    </div>
  );
};

export { ProductView };
