import { appURL } from "@/lib/utils";
import { OnchainShopBanner } from "./onchain-shop-banner";

interface ProductGalleryPropsProps {
  products: {
    name: string;
    image?: string;
    prices?: number[];
    currency?: string;
  }[];
}

const ProductGallery = ({ products }: ProductGalleryPropsProps) => {
  return (
    <div tw="relative w-full h-full flex bg-[#c4a1f0] text-white">
      <div tw="absolute top-0 left-0 w-full h-full flex flex-col justify-start p-[20px]">
        <div tw="flex flex-row justify-between w-full flex-wrap mt-[30px]">
          {products.map((product, index) => (
            <div
              tw="flex flex-col justify-center items-center h-[400px] mx-auto mt-[40px]"
              key={index}
            >
              <img
                src={product.image ?? `${appURL()}/images/t-shirt.png`}
                tw="w-[300px] h-[300px] mt-[10px]"
                alt={`${product.name} product`}
              />
              {/* <div tw="w-auto flex mt-[-40px] bg-white/50 text-black rounded-full px-[20px]">
                <p tw="text-[28px]" style={{ fontFamily: "Inter-Bold" }}>
                  {product.name}
                </p>
              </div> */}
              <div tw="w-full flex mt-[-40px] justify-end">
                <div tw="flex w-auto bg-white/50 text-[#292929] rounded-full py-0 px-[20px] mr-[20px]">
                  <p tw="text-[28px] p-0" style={{ fontFamily: "Inter-Bold" }}>
                    {product.prices ?? [0]}
                    {product.currency ?? ""}
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
