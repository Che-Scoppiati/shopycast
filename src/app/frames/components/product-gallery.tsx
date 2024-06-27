import { appURL } from "@/lib/utils";
import { OnchainShopBanner } from "./onchain-shop-banner";
import { Product } from "@/lib/mongodb";
import { ShoppingCart } from "./shopping-cart";
import { UserDataReturnType } from "frames.js";
import { UserBanner } from "./user-banner";

interface ProductGalleryPropsProps {
  products: Product[];
  cartCount?: number;
  user?: UserDataReturnType;
}

const ProductGallery = ({
  products,
  user,
  cartCount = 0,
}: ProductGalleryPropsProps) => {
  const startingPrices = products.map((product) => {
    // get minimum price from product variants, if variant.length is 0, set price to 0
    if (product.variants.length === 0) {
      return 0;
    }
    return Math.min(...product.variants.map((variant) => variant?.price ?? 0));
  });

  return (
    <div tw="relative w-full h-full flex bg-[#dfd0f2] text-white">
      <div tw="absolute top-0 left-0 w-full h-full flex flex-col justify-start px-[0] py-[90px]">
        <div tw="flex flex-row justify-between w-full flex-wrap mt-[60px]">
          {products.map((product, index) => (
            <div
              tw="flex flex-col justify-center items-center h-[400px] mx-auto mt-[40px]"
              key={index}
            >
              <div tw="flex flex-col">
                <p
                  tw="w-[300px] text-[32px] text-[#351161] my-[10px] mx-0"
                  style={{ fontFamily: "Inter-Bold" }}
                >
                  {product.name.length > 14
                    ? `${product.name.slice(0, 14)}...`
                    : product.name}
                </p>
                <div tw="flex w-[300px] h-[300px] mt-[10px] overflow-hidden items-center rounded-3xl">
                  <img
                    src={product.image ?? `${appURL()}/images/t-shirt.png`}
                    tw="object-cover"
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
                    style={{ fontFamily: "Inter-Bold" }}
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
      <OnchainShopBanner />
      <ShoppingCart numberOfProducts={cartCount} />
    </div>
  );
};

export { ProductGallery };
