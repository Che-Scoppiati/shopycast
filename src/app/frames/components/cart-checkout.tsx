import { appURL } from "@/lib/frames";
import { OnchainShopBanner } from "./onchain-shop-banner";
import { ProductCart } from "@/lib/mongodb";
import { ShoppingCart } from "./shopping-cart";

interface CartCheckoutProps {
  products: ProductCart[];
  cartCount?: number;
}

const CartCheckout = ({ products, cartCount = 0 }: CartCheckoutProps) => {
  return (
    <div tw="relative w-full h-full flex bg-[#dfd0f2] text-white">
      <div tw="absolute top-0 left-0 w-full h-full flex flex-col justify-start px-[20px] py-[90px]">
        <div tw="flex flex-row justify-between w-full flex-wrap">
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
                  tw={`flex w-auto h-auto bg-green-600/75 text-[#fff] rounded-full p-0 px-[32px] mr-[16px]`}
                >
                  <p
                    tw="text-[32px] m-auto p-0 leading-none"
                    style={{ fontFamily: "Inter-Bold" }}
                  >
                    {/* {product.variant.value} */}1 x XL
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <OnchainShopBanner />
      <ShoppingCart numberOfProducts={cartCount} />
    </div>
  );
};

export { CartCheckout };
