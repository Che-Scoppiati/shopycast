import { appURL } from "@/lib/utils";
import { ShowcaseWithDetails } from "@/lib/mongodb";
import { UserDataReturnType } from "frames.js";
import {
  ShopycastBanner,
  ShopycastLogo,
  ShopNameBanner,
  ShoppingCart,
  UserBanner,
} from "@/app/frames/components";

interface ProductGalleryProps {
  showcase: ShowcaseWithDetails;
  cartCount?: number;
  user?: UserDataReturnType;
}

const ProductGallery = ({
  showcase,
  user,
  cartCount = 0,
}: ProductGalleryProps) => {
  const startingPrices = showcase.products.map((product) => {
    // get minimum price from product variants, if variant.length is 0, set price to 0
    if (!product.variants || product.variants?.length === 0) {
      return 0;
    }
    return Math.min(...product.variants.map((variant) => variant?.price ?? 0));
  });

  return (
    <div tw="relative w-full h-full flex text-white">
      <img
        src={`${appURL()}/images/background-gradient.png`}
        tw="w-full h-full"
        alt="bg"
      />
      <div tw="absolute top-0 left-0 w-full h-full flex flex-col justify-start px-[0] py-[90px]">
        <p
          tw="text-[60px] text-[#C996EC] mx-auto mt-[50px] mb-0 p-0"
          style={{ fontFamily: "Outfit-ExtraBold" }}
        >
          {showcase.name.length > 20
            ? `${showcase.name.slice(0, 20)}...`
            : showcase.name}
        </p>
        <div tw="flex flex-row justify-between w-full flex-wrap mt-[20px]">
          {showcase.products.map((product, index) => (
            <div
              tw="flex flex-col justify-center items-center h-[400px] mx-auto mt-[20px]"
              key={index}
            >
              <div tw="flex flex-col">
                <p
                  tw="w-[300px] text-[32px]  my-[10px] mx-0"
                  style={{ fontFamily: "Outfit-Bold" }}
                >
                  {product.name.length > 14
                    ? `${product.name.slice(0, 14)}...`
                    : product.name}
                </p>
                <div tw="flex w-[300px] h-[300px] mt-[10px] overflow-hidden items-center rounded-3xl">
                  <img
                    src={product.image ?? `${appURL()}/images/t-shirt.png`}
                    style={{ objectFit: "cover" }}
                    alt={`${product.name} product`}
                  />
                </div>
              </div>
              <div tw="w-full flex h-[60px] mt-[-30px] justify-end">
                <div
                  tw={`flex w-auto h-auto bg-${startingPrices[index] === 0 ? "red-700" : "[#701099]"}/75 text-[#fff] rounded-full p-0 px-[32px] mr-[16px]`}
                >
                  <p
                    tw="text-[32px] m-auto p-0 leading-none"
                    style={{ fontFamily: "Outfit-Bold" }}
                  >
                    {startingPrices[index] === 0
                      ? "Sold Out"
                      : `${startingPrices[index]} ${product.currency === "USD" ? "$" : ""}`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <UserBanner user={user} />
      <ShopycastBanner />
      <ShoppingCart numberOfProducts={cartCount} />
      <ShopNameBanner name={showcase.shop.name} />
      <ShopycastLogo />
    </div>
  );
};

export { ProductGallery };
