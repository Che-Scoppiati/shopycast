import { OnchainShopBanner, ShopNameBanner } from "@/app/frames/components";
import { ProductCart } from "@/lib/mongodb";
import { UserDataReturnType } from "frames.js";
import { ProductImage } from "./product-image";
import { UserBanner } from "./user-banner";
import { ShoppingCart } from "./shopping-cart";
import { appURL } from "@/lib/utils";

interface AddToCartSuccessProps {
  user: UserDataReturnType;
  product: ProductCart;
  numberOfProducts: number;
  shopName: string;
}

const AddToCartSuccess = ({
  user,
  product,
  numberOfProducts,
  shopName,
}: AddToCartSuccessProps) => {
  return (
    <div tw="relative w-full h-full flex bg-[#dfd0f2] text-white">
      <img
        src={`${appURL()}/images/background-gradient.png`}
        tw="w-full bg-cover h-full"
        alt="bg"
      />
      <div tw="absolute top-0 left-0 w-full h-full flex flex-row justify-start pt-[110px] pb-[60px] px-[40px]">
        <div tw="h-full w-full flex flex-row border border-4 border-[#C996EC] rounded-3xl py-[20px] px-0 mx-auto">
          <ProductImage image={product.image} name={product.name} />
          <div tw="w-[600px] flex flex-col  ml-[50px]">
            <p
              tw="text-[64px] text-[#C996EC] m-0"
              style={{ fontFamily: "Outfit-Bold" }}
            >
              {`Thanks ${user?.username}!`}
            </p>
            <p tw="text-[32px] my-[30px]" style={{ fontFamily: "Outfit-Bold" }}>
              {product.name} with size {product.variant.value} was added to
              cart.
            </p>
          </div>
        </div>
      </div>
      <UserBanner user={user} />
      <OnchainShopBanner />
      <ShoppingCart numberOfProducts={numberOfProducts} />
      <ShopNameBanner name={shopName} />
    </div>
  );
};

export { AddToCartSuccess };
