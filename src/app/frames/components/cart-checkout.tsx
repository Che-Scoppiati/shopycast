import { appURL } from "@/lib/frames";
import { OnchainShopBanner } from "./onchain-shop-banner";
import { Cart } from "@/lib/mongodb";
import { ShoppingCart } from "./shopping-cart";
import { User } from "@nextui-org/react";
import { UserBanner } from "./user-banner";
import { UserDataReturnType } from "frames.js";

interface CartCheckoutProps {
  cart: Cart | null;
  numberOfProducts: number;
  user?: UserDataReturnType;
}

const CartCheckout = ({ cart, numberOfProducts, user }: CartCheckoutProps) => {
  return (
    <div tw="relative w-full h-full flex bg-[#dfd0f2] text-white">
      <div tw="absolute top-0 left-0 w-full h-full flex flex-col justify-start px-[40px] py-[90px]">
        <div tw="flex flex-row justify-between w-full flex-wrap">
          {cart
            ? cart.products.map((product, index) => (
                <div
                  tw="flex flex-col justify-center items-center h-[400px] mt-[40px]"
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
                        {product.quantity} x {product.variant.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            : "No products in cart"}
        </div>
      </div>
      <UserBanner user={user} />
      <OnchainShopBanner />
      <ShoppingCart numberOfProducts={numberOfProducts} />
    </div>
  );
};

export { CartCheckout };
