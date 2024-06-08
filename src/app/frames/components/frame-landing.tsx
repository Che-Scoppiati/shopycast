import { appURL } from "@/lib/utils";

interface FrameLandingProps {
  title: string;
}

const FrameLanding = ({ title }: FrameLandingProps) => {
  return (
    <div tw="relative w-full h-full flex bg-[#0042F5] text-white">
      <img src={`${appURL()}/images/frame-bg.png`} tw="w-full" alt="bg" />
      <div tw="absolute top-0 left-0 w-full h-full flex flex-col justify-start p-[20px]">
        <div tw="flex flex-col justify-center items-center h-[820px] mx-auto">
          <div tw="w-auto flex px-[20px] bg-white text-[#0042F5] border-black border-t-4 border-l-4 border-b-[15px] border-r-[15px]">
            <p tw="text-[48px]" style={{ fontFamily: "Inter-Bold" }}>
              {title}
            </p>
          </div>
        </div>
        <div tw="flex items-center h-[70px]">
          <p
            tw="text-[48px] text-[#FBFCFE] ml-[10px]"
            style={{ fontFamily: "Inter-Bold" }}
          >
            ⚡ Onchain Shop
          </p>
        </div>
      </div>
    </div>
  );
};

export { FrameLanding };
