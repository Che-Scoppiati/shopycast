import { OnchainShopBanner } from "@/app/frames/components";

interface AddToCartSuccessProps {
  username: string;
  productName: string;
  variant: string;
}

const AddToCartSuccess = ({
  username,
  productName,
  variant,
}: AddToCartSuccessProps) => {
  return (
    <div tw="relative w-full h-full flex bg-[#c4a1f0] text-white">
      {/* <img src={`${appURL()}/images/background.jpg`} tw="w-full" alt="bg" /> */}
      <div tw="absolute top-0 left-0 w-full h-full flex flex-row justify-start py-[20px] px-[40px]">
        <div tw="flex flex-col h-full mx-auto mt-[100px]">
          <div tw="w-full flex flex-col text-[#292929]">
            <p
              tw="text-[64px] text-[#351161] mx-auto"
              style={{ fontFamily: "Inter-Bold" }}
            >
              {`Thanks ${username}!`}
            </p>
            <p tw="text-[32px] my-0 mx" style={{ fontFamily: "Inter-Bold" }}>
              {productName} with size {variant} was added to cart.
            </p>
          </div>
        </div>
      </div>
      <OnchainShopBanner />
    </div>
  );
};

export { AddToCartSuccess };
