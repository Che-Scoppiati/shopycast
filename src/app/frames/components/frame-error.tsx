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

interface FrameErrorProps {
  error?: string;
  user?: UserDataReturnType;
  cartCount?: number;
}

const FrameError = ({ error, cartCount, user }: FrameErrorProps) => {
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
          Whooops an error occurred 😿
        </p>
        <div tw="flex flex-row justify-between w-full flex-wrap mt-[200px]">
          <p
            tw="text-[46px] mx-auto mt-[20px] mb-0 p-0"
            style={{ fontFamily: "Outfit-ExtraBold" }}
          >
            {error ?? "An error occurred while loading the frame."}
          </p>
          <p
            tw="text-[32px] mx-auto mt-[20px] mb-0 p-0"
            style={{ fontFamily: "Outfit-ExtraBold" }}
          >
            Try again or contact the shop owner for more information.
          </p>
        </div>
      </div>
      <UserBanner user={user} />
      <ShopycastBanner />
      <ShoppingCart numberOfProducts={cartCount ?? 0} />
      <ShopycastLogo />
    </div>
  );
};

export { FrameError };
