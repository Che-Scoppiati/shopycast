interface ProductDetailsProps {
  name: string;
  description?: string;
}

const ProductDetails = ({ name, description }: ProductDetailsProps) => {
  return (
    <div tw="w-full flex flex-col ">
      <p
        tw="text-[48px] text-[#C996EC] m-0"
        style={{ fontFamily: "Outfit-Bold" }}
      >
        {name}
      </p>
      <p tw="text-[32px] my-0" style={{ fontFamily: "Outfit-Bold" }}>
        {description}
      </p>
    </div>
  );
};

export { ProductDetails };
