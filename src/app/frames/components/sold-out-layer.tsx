import { appURL } from "@/lib/frames";

interface SoldOutLayerProps {
  soldout: boolean;
}

const SoldOutLayer = ({ soldout }: SoldOutLayerProps) => {
  return (
    soldout && (
      <div tw="absolute inline-block w-full mt-[200px] ml-[30px] flex">
        <img
          src={`${appURL()}/images/sold_out.png`}
          tw="w-[400px]"
          alt="sold-out"
        />
      </div>
    )
  );
};

export { SoldOutLayer };
