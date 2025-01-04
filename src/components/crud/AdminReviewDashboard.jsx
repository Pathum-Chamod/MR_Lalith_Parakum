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
  const [pendingReviews, setPendingReviews] = useState([]);
  const [approvedReviews, setApprovedReviews] = useState([]);
  const [loadingPending, setLoadingPending] = useState(true);
  const [loadingApproved, setLoadingApproved] = useState(true);

  // -----------------------------------
  // 1) Fetch PENDING reviews
  // -----------------------------------
  useEffect(() => {
    const fetchPendingReviews = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "PendingReviews"));
        const fetchedReviews = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPendingReviews(fetchedReviews);
      } catch (error) {
        Swal.fire(
          "Error!",
          "Failed to fetch pending reviews. Please try again later.",
          "error"
        );
        console.error("Error fetching pending reviews:", error);
      } finally {
        setLoadingPending(false);
      }
    };

    fetchPendingReviews();
  }, []);

  // -----------------------------------
  // 2) Fetch APPROVED reviews
  // -----------------------------------
  useEffect(() => {
    const fetchApprovedReviews = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "ApprovedReviews"));
        const fetchedApproved = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setApprovedReviews(fetchedApproved);
      } catch (error) {
        Swal.fire(
          "Error!",
          "Failed to fetch approved reviews. Please try again later.",
          "error"
        );
        console.error("Error fetching approved reviews:", error);
      } finally {
        setLoadingApproved(false);
      }
    };

    fetchApprovedReviews();
  }, []);

  // -----------------------------------
  // 3) Approve a Pending review
  // -----------------------------------
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
        // Move the review from PENDING to APPROVED with isHidden = false by default
        const approvedReviewRef = doc(collection(db, "ApprovedReviews"), review.id);
        await setDoc(approvedReviewRef, {
          ...review,
          status: "approved",
          isHidden: false, // Ensure new approved reviews are visible
        });

        // Remove from "PendingReviews"
        const pendingReviewRef = doc(db, "PendingReviews", review.id);
        await deleteDoc(pendingReviewRef);

        // Update local states
        setPendingReviews((prev) => prev.filter((r) => r.id !== review.id));
        setApprovedReviews((prev) => [
          ...prev,
          { ...review, status: "approved", isHidden: false },
        ]);

        Swal.fire(
          "Approved!",
          "The review has been moved to the ApprovedReviews collection.",
          "success"
        );
      } catch (error) {
        Swal.fire(
          "Error!",
          "There was an error approving the review. Please try again.",
          "error"
        );
        console.error("Error approving review:", error);
      }
    }
  };

  // -----------------------------------
  // 4) Decline a Pending review
  // -----------------------------------
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
        // Remove from "PendingReviews"
        await deleteDoc(doc(db, "PendingReviews", id));

        setPendingReviews((prev) => prev.filter((r) => r.id !== id));
        Swal.fire("Declined!", "The review has been declined.", "success");
      } catch (error) {
        Swal.fire(
          "Error!",
          "There was an error declining the review. Please try again.",
          "error"
        );
        console.error("Error declining review:", error);
      }
    }
  };

  // -----------------------------------
  // 5) DELETE an Approved review
  // -----------------------------------
  const handleDeleteApproved = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the review from ApprovedReviews (and hide it on the homepage).",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        // Remove from "ApprovedReviews"
        await deleteDoc(doc(db, "ApprovedReviews", id));

        // Update local state so UI refreshes
        setApprovedReviews((prev) => prev.filter((r) => r.id !== id));

        Swal.fire(
          "Deleted!",
          "The review has been deleted from ApprovedReviews.",
          "success"
        );
      } catch (error) {
        Swal.fire(
          "Error!",
          "There was an error deleting the review. Please try again.",
          "error"
        );
        console.error("Error deleting approved review:", error);
      }
    }
  };

  // -----------------------------------
  // 6) TOGGLE Hide/Show an Approved review
  // -----------------------------------
  const handleToggleHidden = async (review) => {
    try {
      const newIsHidden = !review.isHidden;

      // Update Firestore doc to flip isHidden
      await setDoc(
        doc(db, "ApprovedReviews", review.id),
        { isHidden: newIsHidden },
        { merge: true }
      );

      // Update local state
      setApprovedReviews((prev) =>
        prev.map((r) => (r.id === review.id ? { ...r, isHidden: newIsHidden } : r))
      );

      Swal.fire(
        newIsHidden ? "Hidden!" : "Visible!",
        `This review is now ${newIsHidden ? "hidden" : "visible"} on the homepage.`,
        "success"
      );
    } catch (error) {
      Swal.fire(
        "Error!",
        "Failed to toggle hide/show status. Please try again.",
        "error"
      );
      console.error("Error toggling hide/show:", error);
    }
  };

  // -----------------------------------
  // UI
  // -----------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 p-6 text-gray-100">
      <h2 className="text-4xl font-extrabold mb-10 text-center text-gray-100 tracking-wide">
        Admin Reviews Dashboard
      </h2>

      {/* =========================
          Pending Reviews Section
          ========================= */}
      <section className="mb-16">
        <h3 className="text-3xl font-semibold mb-6 text-center text-indigo-300">
          Pending Reviews
        </h3>

        {loadingPending ? (
          <p className="text-center text-gray-400">Loading pending reviews...</p>
        ) : pendingReviews.length === 0 ? (
          <p className="text-center text-gray-400">No pending reviews at the moment.</p>
        ) : (
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {pendingReviews.map((review) => (
              <div
                key={review.id}
                className="p-5 rounded-lg border border-gray-700 bg-[#1f1f1f] shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="mb-4">
                  <h4 className="text-2xl font-bold text-gray-100 tracking-wide">
                    {review.name}
                  </h4>
                  <p className="italic text-gray-400 mt-2">
                    &quot;{review.quote}&quot;
                  </p>
                  <p className="text-yellow-300 mt-2 font-medium">
                    Rating: {review.rating}/10
                  </p>
                </div>

                {/* Review Photos */}
                {review.photos && review.photos.length > 0 && (
                  <div className="flex gap-2 mt-4 flex-wrap">
                    {review.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Review Photo ${index + 1}`}
                        className="w-16 h-16 object-cover rounded-md border border-gray-700 hover:opacity-90 transition"
                      />
                    ))}
                  </div>
                )}

                <div className="flex gap-4 mt-4">
                  <button
                    className="flex-1 py-2 bg-green-600 hover:bg-green-500 transition text-white rounded font-semibold"
                    onClick={() => handleApprove(review)}
                  >
                    Approve
                  </button>
                  <button
                    className="flex-1 py-2 bg-red-600 hover:bg-red-500 transition text-white rounded font-semibold"
                    onClick={() => handleDecline(review.id)}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* =========================
          Approved Reviews Section
          ========================= */}
      <section>
        <h3 className="text-3xl font-semibold mb-6 text-center text-green-400">
          Approved Reviews
        </h3>

        {loadingApproved ? (
          <p className="text-center text-gray-400">Loading approved reviews...</p>
        ) : approvedReviews.length === 0 ? (
          <p className="text-center text-gray-400">No approved reviews found.</p>
        ) : (
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {approvedReviews.map((review) => (
              <div
                key={review.id}
                className="p-5 rounded-lg border border-gray-700 bg-[#1f1f1f] shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="mb-4">
                  <h4 className="text-2xl font-bold text-gray-100 tracking-wide">
                    {review.name}
                  </h4>
                  <p className="italic text-gray-400 mt-2">
                    &quot;{review.quote}&quot;
                  </p>
                  <p className="text-yellow-300 mt-2 font-medium">
                    Rating: {review.rating}/10
                  </p>
                </div>

                {/* Review Photos */}
                {review.photos && review.photos.length > 0 && (
                  <div className="flex gap-2 mt-4 flex-wrap">
                    {review.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Review Photo ${index + 1}`}
                        className="w-16 h-16 object-cover rounded-md border border-gray-700 hover:opacity-90 transition"
                      />
                    ))}
                  </div>
                )}

                {/* Hide/Show button */}
                {review.isHidden ? (
                  <button
                    className="w-full py-2 mt-4 bg-blue-600 hover:bg-blue-500 transition text-white rounded font-semibold"
                    onClick={() => handleToggleHidden(review)}
                  >
                    Show
                  </button>
                ) : (
                  <button
                    className="w-full py-2 mt-4 bg-gray-600 hover:bg-gray-500 transition text-white rounded font-semibold"
                    onClick={() => handleToggleHidden(review)}
                  >
                    Hide
                  </button>
                )}

                {/* Delete button */}
                <button
                  className="w-full py-2 mt-2 bg-red-600 hover:bg-red-500 transition text-white rounded font-semibold"
                  onClick={() => handleDeleteApproved(review.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminReviewDashboard;
//fine code!
