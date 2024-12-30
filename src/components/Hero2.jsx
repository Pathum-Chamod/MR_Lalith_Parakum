"use client";
import { glowEffect } from "@/helper/styles";
import { db } from "@/lib/firebase"; // Import Firestore instance
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const Hero2 = () => {
  const [activeIndex, setActiveIndex] = useState(0); // Track the current slide index
  const [slides, setSlides] = useState([]); // State for fetched slide URLs
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const intervalRef = useRef(null);

  // Fetch slides from Firestore
  useEffect(() => {
    const fetchSlides = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "SlideshowMain", "MainSlides"); // Document reference
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const firebaseSlides = (data.slides || []).filter((slide) => slide.url); // Validate slides
          setSlides(firebaseSlides);
        } else {
          console.error("No slides document found in Firestore!");
          setError("No slides available. Please add slides from the admin dashboard.");
        }
      } catch (err) {
        console.error("Error fetching slides from Firestore:", err);
        setError("Failed to load slides. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  // Auto-rotate slides every 3 seconds
  useEffect(() => {
    if (slides.length > 0) {
      intervalRef.current = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }, 3000);
    }
    return () => clearInterval(intervalRef.current); // Cleanup interval
  }, [slides.length]);

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const handlePrevious = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  // Loading State
  if (loading) {
    return (
      <div className="w-full h-[calc(100vh-80px)] flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        <span className="ml-4 text-lg">Loading slides...</span>
      </div>
    );
  }

  // Error State or No Slides Available
  if (error || slides.length === 0) {
    return (
      <div className="w-full h-[calc(100vh-80px)] flex items-center justify-center text-red-500 text-lg">
        {error || "No slides available. Please upload slides from the admin panel."}
      </div>
    );
  }

  return (
    <div
      className="w-full h-[calc(100vh-80px)] relative overflow-hidden"
      style={glowEffect}
      role="region"
      aria-label="Image Slideshow"
    >
      <div className="h-full w-full flex items-center justify-center relative">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ease-in-out ${
              activeIndex === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              src={slide.url || "/placeholder-image.png"} // Use slide.url or fallback
              onError={(e) => (e.target.src = "/placeholder-image.png")} // Handle load errors
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
              fill
              loading={index === activeIndex ? "eager" : "lazy"} // Lazy load
              priority={index === activeIndex} // Prioritize active slide
            />
          </div>
        ))}

        {/* Navigation Buttons */}
        {slides.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              aria-label="Previous Slide"
              className="absolute left-5 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full z-20 hover:bg-black/70"
            >
              &#9664;
            </button>
            <button
              onClick={handleNext}
              aria-label="Next Slide"
              className="absolute right-5 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full z-20 hover:bg-black/70"
            >
              &#9654;
            </button>
          </>
        )}
      </div>

      {/* Slide Dots */}
      <div className="absolute bottom-5 w-full flex justify-center gap-2 z-20">
        {slides.map((_, dotIndex) => (
          <button
            key={dotIndex}
            onClick={() => setActiveIndex(dotIndex)}
            className={`w-3 h-3 rounded-full ${
              activeIndex === dotIndex ? "bg-blue-500" : "bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero2;
