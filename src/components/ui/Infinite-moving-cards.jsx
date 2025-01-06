"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export function InfiniteMovingCards({
  items = [],
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}) {
  const containerRef = useRef(null);

  // Whether to start the scrolling animation
  const [start, setStart] = useState(false);

  // We store the "doubled" items to create the infinite effect
  const [doubledItems, setDoubledItems] = useState([]);

  // -- Lightbox modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPhotos, setModalPhotos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ------------------------
  // Double the items in React
  // ------------------------
  useEffect(() => {
    if (items.length > 0) {
      // create a new array containing two copies of `items`
      setDoubledItems([...items, ...items]);
      setStart(true);
    } else {
      setDoubledItems([]);
      setStart(false);
    }
  }, [items]);

  // ------------------------
  // Set the scrolling speed/direction via CSS variables
  // ------------------------
  useEffect(() => {
    if (!containerRef.current) return;

    // Set --animation-duration
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

    // Set --animation-direction
    containerRef.current.style.setProperty(
      "--animation-direction",
      direction === "left" ? "forwards" : "reverse"
    );
  }, [direction, speed]);

  // ------------------------
  // Lightbox / Modal controls
  // ------------------------
  const openModal = (photos, index) => {
    setModalPhotos(photos);
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalPhotos([]);
    setCurrentIndex(0);
  };

  const goNext = (e) => {
    e.stopPropagation(); // prevents closing the modal
    setCurrentIndex((prev) => (prev + 1) % modalPhotos.length);
  };

  const goPrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) =>
      prev === 0 ? modalPhotos.length - 1 : prev - 1
    );
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        // "scroller" triggers the CSS keyframes for infinite scrolling
        "scroller relative z-10 max-w-7xl overflow-x-scroll scrollbar-magical",
        // mask-image to fade the left and right edges
        "[mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      {/*
        ==========================
        MODAL / LIGHTBOX OVERLAY
        ==========================
      */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90"
          onClick={closeModal}
        >
          <div className="relative h-full w-full max-w-6xl flex items-center justify-center">
            {/* Image */}
            <img
              src={modalPhotos[currentIndex]}
              alt="Enlarged"
              className="max-h-full max-w-full object-contain"
            />

            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-white text-4xl font-bold bg-black/50 p-2 rounded-full hover:bg-black/80"
              onClick={(e) => {
                e.stopPropagation();
                closeModal();
              }}
            >
              ✕
            </button>

            {/* Prev / Next if more than one photo */}
            {modalPhotos.length > 1 && (
              <>
                <button
                  className="absolute left-6 text-white text-3xl bg-black/50 p-2 rounded-full hover:bg-black/80"
                  onClick={goPrev}
                >
                  ‹
                </button>
                <button
                  className="absolute right-6 text-white text-3xl bg-black/50 p-2 rounded-full hover:bg-black/80"
                  onClick={goNext}
                >
                  ›
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/*
        ==========================
        Magical Glowing Scrollbar
        ==========================
      */}
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

        /* 
          "scroller" sets up the infinite animation.
          We rely on --animation-duration & --animation-direction
          from the JavaScript above.
        */
       
        .scroller {
          animation: scroll var(--animation-duration) linear infinite;
          animation-play-state: running;
          animation-direction: var(--animation-direction);
        }

        /* The actual keyframes for the scrolling effect */
        @keyframes scroll {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            /* Adjust the translateX for how wide your scroller content is */
            transform: translate3d(-50%, 0, 0);
          }
        }

        .card-hover:hover {
          box-shadow: 0 0 15px #a855f7, 0 0 25px #ec4899;
          transform: scale(1.05);
          transition: all 0.3s ease-in-out;
        }
        .photo-hover:hover {
          transform: scale(1.2) rotate(5deg);
          filter: drop-shadow(0 0 10px #6ee7b7) drop-shadow(0 0 20px #34d399);
          transition: all 0.3s ease-in-out;
        }
        .star-hover:hover {
          fill: #facc15;
          filter: drop-shadow(0 0 10px #facc15) drop-shadow(0 0 20px #fbbf24);
          transition: fill 0.3s, filter 0.3s;
        }
      `}</style>

      {/*
        ==========================
        Scrollable Cards
        ==========================
      */}
      <ul
        className={cn(
          "flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {/* 
          Map over doubledItems 
          so we have a seamless repeating list
        */}
        {doubledItems.map((item, idx) => (
          <li
            key={item.id ? `${item.id}-${idx}` : idx}
            className="relative w-[200px] max-w-full rounded-2xl border border-b-0 flex-shrink-0 border-slate-700 px-6 py-8 md:w-[450px] flex flex-col items-center card-hover"
            style={{
              background:
                "linear-gradient(180deg, var(--slate-800), var(--slate-900))",
            }}
          >
            {/* Profile Image */}
            <div className="absolute top-4 left-4">
              <img
                src={item.profileImage || "https://via.placeholder.com/50"}
                alt={`${item.name}'s profile`}
                className="h-20 w-20 rounded-full border border-gray-500 object-cover"
              />
            </div>

            {/* Quote */}
            <blockquote className="mt-20 w-full text-center">
              <span className="relative z-20 text-sm leading-[1.6] text-gray-100 font-normal">
                {item.quote}
              </span>
            </blockquote>

            {/* Name & Title */}
            <div className="relative z-20 mt-4 text-center">
              <span className="block text-sm text-gray-400 font-medium">
                {item.name}
              </span>
              <span className="block text-xs text-gray-500 font-light">
                {item.title}
              </span>
            </div>

            {/* Photos */}
            {item.photos?.length > 0 && (
              <div className="flex gap-2 mt-4">
                {item.photos.map((photo, photoIdx) => (
                  <div
                    key={photoIdx}
                    className="h-12 w-12 border border-gray-600 rounded-md cursor-pointer photo-hover"
                    onClick={() => openModal(item.photos, photoIdx)}
                  >
                    <img
                      src={photo}
                      alt={`Photo ${photoIdx + 1}`}
                      className="h-full w-full object-cover rounded-md"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Rating Bar */}
            <div className="mt-4 flex items-center gap-2">
              <div className="flex items-center">
                {Array.from({ length: 10 }).map((_, starIdx) => (
                  <svg
                    key={starIdx}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 star-hover ${
                      starIdx < item.rating
                        ? "text-yellow-500"
                        : "text-gray-500"
                    }`}
                    fill={starIdx < item.rating ? "currentColor" : "none"}
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
}
