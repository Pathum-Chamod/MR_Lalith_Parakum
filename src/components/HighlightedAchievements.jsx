"use client";

import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import AchievementCards from "./AchievementCards";
import CustomTitle from "./CustomTitle";

const HighlightedAchievements = () => {
  const [achievements, setAchievements] = useState([]);

  const fetchAchievements = async () => {
    const querySnapshot = await getDocs(collection(db, "Achievements"));
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setAchievements(data);
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  return (
    <div className="bg-black py-8 lg:h-[100vh] flex items-center justify-center">
      <div className="max-w-[1280px] flex flex-col items-center mx-auto py-[20px]">
        <CustomTitle text="Highlights and Achievements" />
        <div className="flex gap-5 flex-wrap w-full mt-[30px] items-center justify-center">
          {achievements.map((achievement) => (
            <AchievementCards
              key={achievement.id}
              title={achievement.title}
              description={achievement.description}
              imageUrl={achievement.image.url}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HighlightedAchievements;
