"use client";

import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { InfiniteMovingCards } from "./ui/Infinite-moving-cards"; // Adjust import path as needed

export function InfiniteMovingCardsDemo() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Only fetch approved, *not hidden* reviews
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
    return <div>Loading reviews...</div>;
  }
  if (reviews.length === 0) {
    return <div>No approved reviews to display.</div>;
  }

  return (
    <div className="h-[40rem] rounded-md flex flex-col bg-white dark:bg-black items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards items={reviews} direction="right" speed="slow" />
    </div>
  );
}
//finalized
