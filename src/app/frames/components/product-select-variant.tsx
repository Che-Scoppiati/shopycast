import {
  OnchainShopBanner,
  ProductDetails,
  SoldOutLayer,
  UserBanner,
  ShoppingCart,
  ProductImage,
  ProductVariants,
  ShopNameBanner,
} from "@/app/frames/components";
import { UserDataReturnType } from "frames.js";

interface ProductSelectVariantPropsProps {
  name: string;
  description?: string;
  quantity?: number;
  image?: string;
  currency?: string;
  variants?: string[];
  soldout?: boolean;
  startingPrice?: number;
  user: UserDataReturnType;
  cartCount: number;
  shopName: string;
}

const ProductSelectVariant = ({
  name,
  description,
  image,
  soldout = false,
  user,
  cartCount,
  variants,
  startingPrice,
  quantity,
  shopName,
  currency = "$",
}: ProductSelectVariantPropsProps) => {
  return (
    <div tw="relative w-full h-full flex bg-[#dfd0f2] text-white">
      <div tw="absolute top-0 left-0 w-full h-full flex flex-row justify-start py-[120px] px-[40px]">
        <ProductImage image={image} name={name} />
        <div tw="flex flex-col w-[650px] h-full mx-auto py-0 px-[20px]">
          <ProductDetails name={name} description={description} />
          <div tw="flex flex-row w-[440px]">
            {variants && <ProductVariants variants={variants} />}
            {startingPrice && startingPrice > 0 ? (
              <div tw="w-auto flex flex-row text-[#292929] items-center mt-[88px]">
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
          <p
            tw="text-[42px] m-0 mt-[46px] text-[#292929]"
            style={{ fontFamily: "Inter-Bold" }}
          >
            Select a size to continue
          </p>
        </div>
      </div>
      <SoldOutLayer soldout={soldout} />
      <OnchainShopBanner />
      <UserBanner user={user} />
      <ShoppingCart numberOfProducts={cartCount} />
      <ShopNameBanner name={shopName} />
    </div>
  );
};

export { ProductSelectVariant };
