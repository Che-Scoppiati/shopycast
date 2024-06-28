import { appURL } from "@/lib/frames";

const ShopycastLogo = () => {
  return (
    <div tw="flex absolute top-[15px] left-[40px]">
      <img
        src={`${appURL()}/images/logo.png`}
        alt={`shopycast logo with a flame and farcaster logo inside`}
        tw="w-[78px] h-[78px] rounded-full"
      />
    </div>
  );
};

export { ShopycastLogo };
