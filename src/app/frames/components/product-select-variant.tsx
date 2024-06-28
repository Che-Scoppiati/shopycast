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
import { appURL } from "@/lib/utils";
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
      <img
        src={`${appURL()}/images/background-gradient.png`}
        tw="w-full bg-cover h-full"
        alt="bg"
      />
      <div tw="absolute top-0 left-0 w-full h-full flex flex-row justify-start pt-[110px] pb-[60px] px-[40px]">
        <div tw="h-full w-full flex flex-row border border-4 border-[#C996EC] rounded-3xl py-[20px] px-0 mx-auto">
          <ProductImage image={image} name={name} />
          <div tw="flex flex-col w-[650px] h-full mx-auto py-0 px-[20px]">
            <ProductDetails name={name} description={description} />
            <div tw="flex flex-row w-[440px] justify-start pt-[30px]">
              {variants && <ProductVariants variants={variants} />}
              {startingPrice && startingPrice > 0 ? (
                <div tw="w-auto flex flex-col">
                  <p
                    tw="text-[42px] text-[#C996EC] m-0 ml-0 font-extrabold "
                    style={{ fontFamily: "Outfit-Bold" }}
                  >
                    Price
                  </p>
                  <p
                    tw="text-[60px] m-0 mt-[20px]"
                    style={{ fontFamily: "Outfit-Bold" }}
                  >
                    {startingPrice} {currency === "USD" ? "$" : ""}
                  </p>
                  {quantity && (
                    <p
                      tw="text-[38px] my-0"
                      style={{ fontFamily: "Outfit-Bold" }}
                    >
                      {quantity} left
                    </p>
                  )}
                </div>
              ) : null}
            </div>
            <p
              tw="text-[42px] m-0 mt-[46px] "
              style={{ fontFamily: "Outfit-Bold" }}
            >
              Select a size to continue
            </p>
          </div>
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
