interface TopCardProps {
  title: JSX.Element | string;
  description: string;
  icon: JSX.Element;
}

const TopCard: React.FC<TopCardProps> = ({ title, description, icon }) => {
  return (
    <div className="bg-primary bg-opacity-5 flex flex-col items-center gap-8 p-6 py-10 rounded-3xl outline outline-3 outline-primary-light hover:outline-offset-8 hover:bg-primary-light hover:bg-opacity-5 hover:shadow-neon transition-all duration-300">
      <div className="flex flex-col items-center gap-3">
        <h2 className="text-xl sm:text-2xl font-bold leading-none">{title}</h2>
        <p className="text-md sm:text-lg text-default-500 text-center leading-none mx-3">
          {description}
        </p>
      </div>
      {icon}
    </div>
  );
};

export default TopCard;
