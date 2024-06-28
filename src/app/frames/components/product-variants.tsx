interface ProductVariantsProps {
  variants: string[];
}

const ProductVariants = ({ variants }: ProductVariantsProps) => {
  return (
    <div tw="w-full flex flex-col">
      <p
        tw="text-[42px] text-[#C996EC] my-0"
        style={{ fontFamily: "Outfit-Bold" }}
      >
        Sizes
      </p>
      <div tw="w-full flex flex-row mt-[20px] mx-0 p-0 ">
        {variants.length > 0
          ? variants?.map((variant, index) => (
              <div
                key={index}
                tw="flex flex-col justify-center items-center h-[60px] w-[60px] mr-[20px] bg-[#C996EC] rounded-xl text-[28px] p-0 text-black"
                style={{ fontFamily: "Outfit-Bold" }}
              >
                {variant}
              </div>
            ))
          : "no size available"}
      </div>
    </div>
  );
};

export { ProductVariants };
