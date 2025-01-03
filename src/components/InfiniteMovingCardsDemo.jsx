"use client";

import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { InfiniteMovingCards } from "./ui/Infinite-moving-cards";

export function InfiniteMovingCardsDemo() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch approved reviews from Firestore
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "ApprovedReviews"));
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

  // ✅ Loading state while fetching reviews
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[40rem] bg-gray-100 dark:bg-black text-gray-500">
        Loading reviews...
      </div>
    );
  }

  // ✅ Check if there are no reviews to display
  if (reviews.length === 0) {
    return (
      <div className="flex items-center justify-center h-[40rem] bg-gray-100 dark:bg-black text-gray-500">
        No approved reviews to display.
      </div>
    );
  }

  // ✅ Render the InfiniteMovingCards component
  return (
    <div className="h-[40rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards items={reviews} direction="right" speed="slow" />
    </div>
  );
}
