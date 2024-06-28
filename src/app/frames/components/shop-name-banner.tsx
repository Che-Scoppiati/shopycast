interface ShopNameBannerProps {
  name: string;
}

const ShopNameBanner = ({ name }: ShopNameBannerProps) => {
  return (
    <div tw="flex absolute bottom-0">
      <p
        tw="text-[28px] text-[#292929] m-0 p-0 ml-[10px] mb-[10px]"
        style={{ fontFamily: "Inter-Bold" }}
      >
        🛍️ {name}
      </p>
    </div>
  );
};

export { ShopNameBanner };
