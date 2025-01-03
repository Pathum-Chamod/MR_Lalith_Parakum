"use client";

import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";

export const InfiniteMovingCards = ({
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}) => {
  const [reviews, setReviews] = useState([]);
  const containerRef = React.useRef(null);
  const scrollerRef = React.useRef(null);
  const [start, setStart] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null); // ✅ For enlarged photo modal

  // ✅ Fetch approved reviews from Firestore
  useEffect(() => {
    const fetchApprovedReviews = () => {
      const unsubscribe = onSnapshot(collection(db, "ApprovedReviews"), (snapshot) => {
        setReviews(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      });

      return () => unsubscribe();
    };

    fetchApprovedReviews();
  }, []);

  // ✅ Add animation once reviews are fetched
  useEffect(() => {
    if (reviews.length > 0) {
      addAnimation();
    }
  }, [reviews]);

  // ✅ Function to add animation
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      if (scrollerContent.length > 0) {
        scrollerContent.forEach((item) => {
          const duplicatedItem = item.cloneNode(true);
          scrollerRef.current.appendChild(duplicatedItem);
        });

        getDirection();
        getSpeed();
        setStart(true);
      }
    }
  }

  // ✅ Set scrolling direction
  const getDirection = () => {
    if (containerRef.current) {
      containerRef.current.style.setProperty(
        "--animation-direction",
        direction === "left" ? "forwards" : "reverse"
      );
    }
  };

  // ✅ Set scrolling speed
  const getSpeed = () => {
    if (containerRef.current) {
      let duration;
      switch (speed) {
        case "fast":
          duration = "20s";
          break;
        case "normal":
          duration = "40s";
          break;
        case "slow":
          duration = "80s";
          break;
        default:
          duration = "40s";
      }
      containerRef.current.style.setProperty("--animation-duration", duration);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-x-scroll scrollbar-magical [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      {/* ✅ Modal for Enlarged Photo */}
      {selectedPhoto && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
    onClick={() => setSelectedPhoto(null)}
  >
    <div className="relative">
      {/* Image in full resolution */}
      <img
        src={selectedPhoto}
        alt="Enlarged"
        className="max-w-full max-h-screen rounded-lg object-contain"
      />

      {/* Close button */}
      <button
        className="absolute top-4 right-4 text-white text-4xl font-bold bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-80"
        onClick={() => setSelectedPhoto(null)}
      >
        ✕
      </button>
    </div>
  </div>
)}


      {/* ✅ Scrollable Cards */}
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {reviews.map((item, idx) => (
          <li
            key={item.id || idx}
            className="relative w-[200px] max-w-full rounded-2xl border border-b-0 flex-shrink-0 border-slate-700 px-6 py-8 md:w-[450px] flex flex-col items-center card-hover"
            style={{
              background:
                "linear-gradient(180deg, var(--slate-800), var(--slate-900))",
            }}
          >
            {/* ✅ Profile Image */}
            <div className="absolute top-4 left-4">
              <img
                src={item.profileImage || "https://via.placeholder.com/50"}
                alt={`${item.name}'s profile`}
                className="h-20 w-20 rounded-full border border-gray-500 object-cover"
              />
            </div>

            {/* ✅ Description */}
            <blockquote className="mt-20 w-full text-center">
              <span className="relative z-20 text-sm leading-[1.6] text-gray-100 font-normal">
                {item.quote}
              </span>
            </blockquote>

            {/* ✅ Name and Title */}
            <div className="relative z-20 mt-4 text-center">
              <span className="block text-sm text-gray-400 font-medium">
                {item.name}
              </span>
              <span className="block text-xs text-gray-500 font-light">
                {item.title}
              </span>
            </div>

            {/* ✅ Photos Section */}
            {item.photos && (
              <div className="flex gap-2 mt-4">
                {item.photos.map((photo, i) => (
                  <div
                    key={i}
                    className="h-12 w-12 border border-gray-600 rounded-md cursor-pointer photo-hover"
                    onClick={() => setSelectedPhoto(photo)}
                  >
                    <img
                      src={photo}
                      alt={`Photo ${i + 1}`}
                      className="h-full w-full object-cover rounded-md"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* ✅ Rating Bar */}
            <div className="mt-4 flex items-center gap-2">
              <div className="flex items-center">
                {Array.from({ length: 10 }).map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 star-hover ${
                      i < item.rating ? "text-yellow-500" : "text-gray-500"
                    }`}
                    fill={i < item.rating ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                    />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-400">{item.rating}/10</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
