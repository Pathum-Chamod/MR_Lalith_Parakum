// src/components/InfiniteMovingCardsDemo.jsx

"use client";

import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import CustomTitle from "./CustomTitle"; // Ensure correct import path
import { InfiniteMovingCards } from "./ui/Infinite-moving-cards"; // Adjust import path as needed

export function InfiniteMovingCardsDemo() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Only fetch approved, not hidden reviews
        const q = query(
          collection(db, "ApprovedReviews"),
          where("isHidden", "==", false)
        );
        const querySnapshot = await getDocs(q);

        const reviewsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setReviews(reviewsData);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-gray-500">Loading reviews...</span>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-gray-500">No approved reviews to display.</span>
      </div>
    );
  }

  return (
    <div className="relative bg-black py-8 flex flex-col items-center justify-center">
      {/* Title */}
      <CustomTitle text="Students Reviews and Ratings" />

      {/* Container for the Infinite Moving Cards */}
      <div className="mt-6 w-full max-w-4xl">
        <InfiniteMovingCards items={reviews} direction="right" speed="slow" />
      </div>
    </div>
  );
}

// Finalized
