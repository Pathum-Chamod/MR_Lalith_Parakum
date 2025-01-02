"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}) => {
  const containerRef = React.useRef(null);
  const scrollerRef = React.useRef(null);

  const [start, setStart] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null); // For enlarged photo

  useEffect(() => {
    addAnimation();
  }, []);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }

  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty("--animation-direction", "forwards");
      } else {
        containerRef.current.style.setProperty("--animation-direction", "reverse");
      }
    }
  };

  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
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
      {/* Modal for Enlarged Photo */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setSelectedPhoto(null)}
        >
          <img
            src={selectedPhoto}
            alt="Enlarged"
            className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg"
          />
        </div>
      )}

      {/* Magical Glowing Scrollbar */}
      <style jsx>{`
        .scrollbar-magical::-webkit-scrollbar {
          height: 6px;
        }
        .scrollbar-magical::-webkit-scrollbar-thumb {
          background: linear-gradient(to right, #6d28d9, #8b5cf6, #ec4899);
          border-radius: 9999px;
          box-shadow: 0 0 10px #8b5cf6, 0 0 20px #ec4899;
          animation: magical-sparkle 2s infinite alternate;
        }
        .scrollbar-magical::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to right, #a855f7, #f43f5e, #fb923c);
          box-shadow: 0 0 15px #a855f7, 0 0 30px #fb923c;
          animation: magical-glow 1s infinite alternate;
        }
        .scrollbar-magical::-webkit-scrollbar-track {
          background: linear-gradient(to right, #1e293b, #0f172a);
          border-radius: 9999px;
        }

        @keyframes magical-sparkle {
          0% {
            box-shadow: 0 0 10px #6d28d9, 0 0 20px #8b5cf6;
          }
          100% {
            box-shadow: 0 0 15px #ec4899, 0 0 25px #fb923c;
          }
        }

        @keyframes magical-glow {
          0% {
            box-shadow: 0 0 15px #a855f7, 0 0 25px #ec4899;
          }
          100% {
            box-shadow: 0 0 20px #f43f5e, 0 0 30px #fb923c;
          }
        }

        .card-hover:hover {
          box-shadow: 0 0 15px #a855f7, 0 0 25px #ec4899;
          transform: scale(1.05);
          transition: all 0.3s ease-in-out;
        }

        .star-hover:hover {
          fill: #facc15; /* Yellow glow */
          filter: drop-shadow(0 0 10px #facc15) drop-shadow(0 0 20px #fbbf24);
          transition: fill 0.3s, filter 0.3s;
        }

        .photo-hover:hover {
          transform: scale(1.2) rotate(5deg);
          filter: drop-shadow(0 0 10px #6ee7b7) drop-shadow(0 0 20px #34d399);
          transition: all 0.3s ease-in-out;
        }
      `}</style>

      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <li
            className="relative w-[200px] max-w-full rounded-2xl border border-b-0 flex-shrink-0 border-slate-700 px-6 py-8 md:w-[450px] flex flex-col items-center card-hover"
            style={{
              background:
                "linear-gradient(180deg, var(--slate-800), var(--slate-900))",
            }}
            key={item.name}
          >
            {/* Profile Image */}
            <div className="absolute top-4 left-4">
              <img
                src={item.profileImage}
                alt={`${item.name}'s profile`}
                className="h-20 w-20 rounded-full border border-gray-500 object-cover"
              />
            </div>

            {/* Description */}
            <blockquote className="mt-20 w-full text-center">
              <span className="relative z-20 text-sm leading-[1.6] text-gray-100 font-normal">
                {item.quote}
              </span>
            </blockquote>

            {/* Name and Title */}
            <div className="relative z-20 mt-4 text-center">
              <span className="block text-sm text-gray-400 font-medium">
                {item.name}
              </span>
              <span className="block text-xs text-gray-500 font-light">
                {item.title}
              </span>
            </div>

            {/* Photos Section */}
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

            {/* Rating Bar with Glowing Stars */}
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
