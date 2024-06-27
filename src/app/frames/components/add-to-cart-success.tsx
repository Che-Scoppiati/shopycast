import { OnchainShopBanner } from "@/app/frames/components";
import { ProductCart } from "@/lib/mongodb";
import { UserDataReturnType } from "frames.js";
import { ProductImage } from "./product-image";
import { UserBanner } from "./user-banner";
import { ShoppingCart } from "./shopping-cart";

interface AddToCartSuccessProps {
  user: UserDataReturnType;
  product: ProductCart;
  numberOfProducts: number;
}

const AddToCartSuccess = ({
  user,
  product,
  numberOfProducts,
}: AddToCartSuccessProps) => {
  return (
    <div tw="relative w-full h-full flex bg-[#dfd0f2] text-white">
      <div tw="absolute top-0 left-0 w-full h-full flex flex-row justify-start py-[50px] px-[40px]">
        <div tw="flex flex-row justify-between mt-[80px]">
          <ProductImage image={product.image} name={product.name} />
          <div tw="w-[600px] flex flex-col text-[#292929] ml-[50px]">
            <p
              tw="text-[64px] text-[#351161] m-0"
              style={{ fontFamily: "Inter-Bold" }}
            >
              {`Thanks ${user?.username}!`}
            </p>
            <p tw="text-[32px] my-[30px]" style={{ fontFamily: "Inter-Bold" }}>
              {product.name} with size {product.variant.value} was added to
              cart.
            </p>
          </div>
        </div>
      </div>
      <UserBanner user={user} />
      <OnchainShopBanner />
      <ShoppingCart numberOfProducts={numberOfProducts} />
    </div>
  );
};

export { AddToCartSuccess };
