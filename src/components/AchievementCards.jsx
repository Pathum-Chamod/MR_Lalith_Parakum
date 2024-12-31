import Image from "next/image";
import { Button } from "./ui/button";

const AchievementCards = ({ title, description, imageUrl }) => {
  return (
    <div className="flex flex-col w-[300px] items-center my-[25px] gap-4 bg-white/10 backdrop-blur-2xl rounded-xl border border-white/40 shadow-2xl p-6 hover:scale-105 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-transform duration-300">
      <div className="w-full flex flex-col gap-3 items-center justify-center">
        <Image
          src={imageUrl || "/placeholder-image.png"}
          alt={title}
          width={300}
          height={200}
          className="w-[300px] h-[200px] object-cover rounded-lg shadow-md"
        />
      </div>
      <div className="w-full flex gap-4 flex-col justify-center items-center">
        <h3 className="text-white font-bold text-lg">{title}</h3>
        <p className="text-gray-300 text-justify text-sm">
          {description.length > 220 ? `${description.slice(0, 220)}...` : description}
        </p>
        <Button variant="gradient_bg">View More</Button>
      </div>
    </div>
  );
};

export default AchievementCards;
