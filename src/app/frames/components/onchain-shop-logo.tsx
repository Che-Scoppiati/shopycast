import { appURL } from "@/lib/frames";

const OnchainShopLogo = () => {
  return (
    <div tw="flex absolute top-[15px] left-[40px]">
      <img
        src={`${appURL()}/images/logo.png`}
        alt={`onchain shop logo with a flame and farcaster logo inside`}
        tw="w-[78px] h-[78px] rounded-full"
      />
    </div>
  );
};

export { OnchainShopLogo };
