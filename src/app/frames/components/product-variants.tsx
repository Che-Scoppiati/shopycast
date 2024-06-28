interface ProductVariantsProps {
  variants: string[];
}

const ProductVariants = ({ variants }: ProductVariantsProps) => {
  return (
    <div tw="w-full flex flex-col mt-[40px]">
      <p
        tw="text-[42px] my-0 font-extrabold text-[#351161]"
        style={{ fontFamily: "Inter-Bold" }}
      >
        Sizes
      </p>
      <div tw="w-full flex flex-row mt-[20px] mx-0 p-0 text-black">
        {variants.length > 0
          ? variants?.map((variant, index) => (
              <div
                key={index}
                tw="flex flex-col text-[#351161] justify-center items-center h-[60px] w-[60px] mr-[20px] bg-[#701099] text-[#fff] rounded-full text-[28px] p-0"
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
