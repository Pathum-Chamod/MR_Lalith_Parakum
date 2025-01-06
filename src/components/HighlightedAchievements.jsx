"use client";

import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import AchievementCards from "./AchievementCards";
import CustomTitle from "./CustomTitle";

const HighlightedAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [expandedCardId, setExpandedCardId] = useState(null);
  const carouselRef = useRef(null);

  // Fetch achievements
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

  // Scroll the carousel programmatically
  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -350, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 350, behavior: "smooth" });
    }
  };

  // Expand or collapse a card
  const toggleExpand = (id) => {
    setExpandedCardId((prevId) => (prevId === id ? null : id));
  };

  // Next/Prev in expanded mode
  const handleExpandNext = () => {
    if (!expandedCardId) return;
    const idx = achievements.findIndex((a) => a.id === expandedCardId);
    if (idx < achievements.length - 1) {
      setExpandedCardId(achievements[idx + 1].id);
    }
  };

  const handleExpandPrev = () => {
    if (!expandedCardId) return;
    const idx = achievements.findIndex((a) => a.id === expandedCardId);
    if (idx > 0) {
      setExpandedCardId(achievements[idx - 1].id);
    }
  };

  return (
    <div className="relative bg-black py-8 lg:h-[100vh] flex items-center justify-center">
      {/* Blurred Backdrop (only active if a card is expanded) */}
      <div
        className={`fixed inset-0 transition-all duration-1000 ${
          expandedCardId
            ? "bg-black/70 backdrop-blur-md z-[900] opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Outer container filling the viewport (lg:h-[100vh]) */}
      <div className="max-w-[1280px] w-full flex flex-col items-center mx-auto py-5 relative z-[1000] h-full">
        <CustomTitle text="Highlights and Achievements" />

        {/* This wrapper takes remaining height */}
        <div className="relative w-full mt-8 h-full">
          {/* Carousel Navigation Buttons */}
          <button
            onClick={scrollLeft}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 text-white text-2xl font-bold p-3 bg-gradient-to-b from-gray-700 to-gray-900 hover:from-indigo-500 hover:to-purple-700 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
          >
            ←
          </button>
          <button
            onClick={scrollRight}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 text-white text-2xl font-bold p-3 bg-gradient-to-b from-gray-700 to-gray-900 hover:from-indigo-500 hover:to-purple-700 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
          >
            →
          </button>

          {/* Carousel Container */}
          <div
            ref={carouselRef}
            // Add scroll-smooth for CSS-based smooth scrolling
            className="scroll-smooth flex gap-5 w-full overflow-x-hidden py-4 h-full"
          >
            {achievements.map((achievement, index) => (
              <div key={achievement.id} className="flex-shrink-0">
                <AchievementCards
                  title={achievement.title}
                  description={achievement.description}
                  imageUrl={achievement.image?.url}
                  isExpanded={expandedCardId === achievement.id}
                  onToggleExpand={() => toggleExpand(achievement.id)}
                  onNext={handleExpandNext}
                  onPrev={handleExpandPrev}
                  isFirst={index === 0}
                  isLast={index === achievements.length - 1}
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
