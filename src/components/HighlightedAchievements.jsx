import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import { glowEffect } from "@/helper/styles";
import AchievementCards from "./AchievementCards";
import CustomTitle from "./CustomTitle";

const HighlightedAchievements = () => {
  return (
    <div className="bg-black py-8 lg:h-[100vh] flex items-center justify-center">
      <div className=" max-w-[1280px] flex flex-col items-center mx-auto py-[20px]">
      <CustomTitle text="Highlights and Achievements" />
        <div className=" flex gap-5 flex-wrap w-full mt-[30px] items-center justify-center">
         
          <AchievementCards />
          <AchievementCards />
          <AchievementCards />
          <AchievementCards />

        </div>
      </div>
    </div>
  );
};

export default HighlightedAchievements;
