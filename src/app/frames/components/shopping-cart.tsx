import { appURL } from "@/lib/frames";

interface ShoppingCartProps {
  numberOfProducts: number;
}

const ShoppingCart = ({ numberOfProducts }: ShoppingCartProps) => {
  return numberOfProducts !== undefined ? (
    <div tw="flex absolute top-[24px] right-[40px]">
      <img
        src={`${appURL()}//images/cart-white.png`}
        alt="shopping cart"
        tw="w-[68px] h-[68px]"
      />
      <p
        tw="h-[48px] text-[28px] text-white m-0 p-0 bg-green-600 rounded-full px-[18px] pt-[10px] pb-0 ml-[-15px] mt-[-10px] leading-none"
        style={{ fontFamily: "Outfit-Bold" }}
      >
        {`${numberOfProducts}`}
      </p>
    </div>
  ) : undefined;
};

export { ShoppingCart };
