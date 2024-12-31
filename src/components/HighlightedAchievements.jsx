"use client";

import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import AchievementCards from "./AchievementCards";
import CustomTitle from "./CustomTitle";

const HighlightedAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Achievements"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAchievements(data);
      } catch (error) {
        console.error("Error fetching achievements:", error);
      }
    };

    fetchAchievements();
  }, []);

  const scrollLeft = () => {
    carouselRef.current.scrollBy({ left: -350, behavior: "smooth" });
  };

  const scrollRight = () => {
    carouselRef.current.scrollBy({ left: 350, behavior: "smooth" });
  };

  return (
    <div className="bg-black py-8 lg:h-[100vh] flex items-center justify-center">
      <div className="max-w-[1280px] flex flex-col items-center mx-auto py-[20px]">
        <CustomTitle text="Highlights and Achievements" />
        <div className="relative w-full mt-[30px]">
          {/* Navigation Buttons */}
          <button
            onClick={scrollLeft}
            className="absolute left-2 top-[50%] transform -translate-y-[50%] z-10 bg-gray-800 text-white p-2 rounded-full shadow-md"
          >
            ←
          </button>
          <button
            onClick={scrollRight}
            className="absolute right-2 top-[50%] transform -translate-y-[50%] z-10 bg-gray-800 text-white p-2 rounded-full shadow-md"
          >
            →
          </button>

          {/* Carousel Container */}
          <div
            ref={carouselRef}
            className="flex gap-5 w-full overflow-x-hidden py-4"
          >
            {achievements.map((achievement) => (
              <div
                className="flex-shrink-0"
                style={{ width: "300px" }}
                key={achievement.id}
              >
                <AchievementCards
                  title={achievement.title}
                  description={achievement.description}
                  imageUrl={achievement.image.url}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HighlightedAchievements;
