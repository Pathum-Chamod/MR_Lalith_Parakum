"use client";

import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import AchievementCards from "./AchievementCards";
import CustomTitle from "./CustomTitle";
import { TracingBeam } from "./ui/TracingBeam"; // Adjust the import path as necessary

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
      scrollToCard(idx + 1);
    }
  };

  const handleExpandPrev = () => {
    if (!expandedCardId) return;
    const idx = achievements.findIndex((a) => a.id === expandedCardId);
    if (idx > 0) {
      setExpandedCardId(achievements[idx - 1].id);
      scrollToCard(idx - 1);
    }
  };

  // Function to scroll to a specific card
  const scrollToCard = (index) => {
    if (carouselRef.current && carouselRef.current.children[index]) {
      carouselRef.current.children[index].scrollIntoView({
        behavior: "smooth",
        inline: "start",
      });
    }
  };

  return (
    <div className="relative bg-black py-8 lg:h-[100vh] flex items-center justify-center overflow-y-hidden">
      {/* Blurred Backdrop (only active if a card is expanded) */}
      <div
        className={`fixed inset-0 transition-all duration-1000 ${
          expandedCardId
            ? "bg-black/70 backdrop-blur-md z-[900] opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Outer container filling the viewport */}
      <div className="max-w-[1280px] w-full flex flex-col items-center mx-auto py-5 relative z-[1000] h-full">
        <CustomTitle text="Highlights and Achievements" />

        {/* Carousel Wrapper with TracingBeam */}
        <TracingBeam className="relative w-full mt-8 h-full">
          {/* Carousel Container */}
          <div
            ref={carouselRef}
            className="scroll-smooth flex gap-5 w-full overflow-x-scroll py-4 h-full hide-scrollbar"
          >
            {achievements.map((achievement, index) => (
              <div key={achievement.id} className="flex-shrink-0 w-1/3">
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
        </TracingBeam>
      </div>
    </div>
  );
};

export default HighlightedAchievements;
