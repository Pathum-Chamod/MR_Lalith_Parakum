"use client";

import { db } from "@/lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const AdminReviewDashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch pending reviews from Firestore
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "PendingReviews"));
        const fetchedReviews = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReviews(fetchedReviews);
      } catch (error) {
        Swal.fire("Error!", "Failed to fetch reviews. Please try again later.", "error");
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Handle approving a review
  const handleApprove = async (review) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to approve this review.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, approve it!",
    });

    if (result.isConfirmed) {
      try {
        // Move the review to ApprovedReviews
        const approvedReviewRef = doc(collection(db, "ApprovedReviews"), review.id);
        await setDoc(approvedReviewRef, { ...review, status: "approved" });

        // Delete the review from PendingReviews
        const pendingReviewRef = doc(db, "PendingReviews", review.id);
        await deleteDoc(pendingReviewRef);

        // Update the local state
        setReviews((prev) => prev.filter((r) => r.id !== review.id));

        Swal.fire(
          "Approved!",
          "The review has been approved and moved to the ApprovedReviews collection.",
          "success"
        );
      } catch (error) {
        Swal.fire("Error!", "There was an error approving the review. Please try again.", "error");
        console.error("Error approving review:", error);
      }
    }
  };

  // Handle declining a review
  const handleDecline = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to decline this review.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, decline it!",
    });

    if (result.isConfirmed) {
      try {
        // Delete the review from PendingReviews
        await deleteDoc(doc(db, "PendingReviews", id));

        // Update the local state
        setReviews((prev) => prev.filter((r) => r.id !== id));

        Swal.fire("Declined!", "The review has been declined.", "success");
      } catch (error) {
        Swal.fire("Error!", "There was an error declining the review. Please try again.", "error");
        console.error("Error declining review:", error);
      }
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">Pending Reviews Dashboard</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-center text-gray-500">No pending reviews at the moment.</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="p-4 bg-white shadow-lg rounded-lg border border-gray-200"
            >
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{review.name}</h3>
                <p className="italic text-gray-600 mt-2">"{review.quote}"</p>
                <p className="text-yellow-500 mt-2">Rating: {review.rating}/10</p>
              </div>

              {/* Review Photos */}
              {review.photos && review.photos.length > 0 && (
                <div className="flex gap-2 mt-4">
                  {review.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Review Photo ${index + 1}`}
                      className="w-16 h-16 object-cover rounded-md border"
                    />
                  ))}
                </div>
              )}

              <div className="flex gap-4 mt-4">
                <button
                  className="flex-1 p-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                  onClick={() => handleApprove(review)}
                >
                  Approve
                </button>
                <button
                  className="flex-1 p-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  onClick={() => handleDecline(review.id)}
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviewDashboard;
