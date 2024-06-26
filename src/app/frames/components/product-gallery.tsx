import { appURL } from "@/lib/frames";
import { OnchainShopBanner } from "./onchain-shop-banner";
import { Product, Variant } from "@/lib/mongodb";

interface ProductGalleryPropsProps {
  products: Product[];
}

const ProductGallery = ({ products }: ProductGalleryPropsProps) => {
  console.log("products", products[2]);
  const startingPrices = products.map((product) => {
    // get minimum price from product variants, if variant.length is 0, set price to 0
    if (product.variants.length === 0) {
      return 0;
    }
    return Math.min(...product.variants.map((variant) => variant.price ?? 0));
  });

  return (
    <div tw="relative w-full h-full flex bg-[#c4a1f0] text-white">
      <div tw="absolute top-0 left-0 w-full h-full flex flex-col justify-start p-[20px]">
        <div tw="flex flex-row justify-between w-full flex-wrap mt-[30px]">
          {products.map((product, index) => (
            <div
              tw="flex flex-col justify-center items-center h-[400px] mx-auto mt-[40px]"
              key={index}
            >
              <div tw="flex w-[300px] h-[300px] mt-[10px] overflow-hidden items-center rounded-3xl">
                <img
                  src={product.image ?? `${appURL()}/images/t-shirt.png`}
                  tw="object-cover"
                  alt={`${product.name} product`}
                />
              </div>
              {/* <div tw="w-auto flex mt-[-40px] bg-white/50 text-black rounded-full px-[20px]">
                <p tw="text-[28px]" style={{ fontFamily: "Inter-Bold" }}>
                  {product.name}
                </p>
              </div> */}
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
      <OnchainShopBanner />
    </div>
  );
};

export { ProductGallery };
