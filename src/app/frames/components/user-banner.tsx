import { appURL } from "@/lib/frames";
import { UserDataReturnType } from "frames.js";

interface UserBannerProps {
  user?: UserDataReturnType;
}

const UserBanner = ({ user }: UserBannerProps) => {
  return user ? (
    <div tw="flex flow-row absolute top-[15px] left-[40px] items-center">
      <img
        src={`${user.profileImage}`}
        alt={`${user.displayName} profile image`}
        tw="w-[78px] h-[78px] rounded-full"
      />
      <p
        tw="h-[48px] text-[38px] text-black m-0 p-0 ml-[20px]"
        style={{ fontFamily: "Inter-Bold" }}
      >
        {user.username}
      </p>
    </div>
  ) : undefined;
};

export { UserBanner };
