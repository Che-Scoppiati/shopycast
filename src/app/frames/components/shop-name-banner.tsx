interface ShopNameBannerProps {
  name: string;
}

const ShopNameBanner = ({ name }: ShopNameBannerProps) => {
  return (
    <div tw="flex absolute bottom-0">
      <p
        tw="text-[28px] m-0 p-0 ml-[40px] mb-[20px]"
        style={{ fontFamily: "Outfit-Bold" }}
      >
        🛍️ {name}
      </p>
    </div>
  );
};

export { ShopNameBanner };
