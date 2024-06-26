interface ProductDetailsProps {
  name: string;
  description?: string;
}

const ProductDetails = ({ name, description }: ProductDetailsProps) => {
  return (
    <div tw="w-full flex flex-col text-[#292929]">
      <p
        tw="text-[48px] text-[#351161] m-0"
        style={{ fontFamily: "Inter-Bold" }}
      >
        {name}
      </p>
      <p tw="text-[32px] my-0" style={{ fontFamily: "Inter-Bold" }}>
        {description}
      </p>
    </div>
  );
};

export { ProductDetails };
