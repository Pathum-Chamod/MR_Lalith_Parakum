"use client";

import { db, storage } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import Swal from "sweetalert2";

const UserReviewForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    quote: "",
    rating: 0,
    profileImage: null,
  });

  const [photoFiles, setPhotoFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle photo uploads
  const handlePhotoChange = (e) => {
    setPhotoFiles([...e.target.files]);
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Upload photos to Firebase Storage (if any)
      const uploadedPhotos = await Promise.all(
        photoFiles.map(async (file) => {
          const storageRef = ref(storage, `ReviewPhotos/${file.name}`);
          await uploadBytes(storageRef, file);
          return getDownloadURL(storageRef);
        })
      );

      // ✅ Upload profile image to Firebase Storage (if provided)
      let profileImageUrl = "";
      if (formData.profileImage) {
        const profileImageRef = ref(storage, `ProfileImages/${formData.profileImage.name}`);
        await uploadBytes(profileImageRef, formData.profileImage);
        profileImageUrl = await getDownloadURL(profileImageRef);
      }

      // ✅ Add review to Firestore
      await addDoc(collection(db, "PendingReviews"), {
        name: formData.name,
        title: formData.title,
        quote: formData.quote,
        rating: formData.rating,
        profileImage: profileImageUrl || "https://via.placeholder.com/50", // Default profile image if none provided
        photos: uploadedPhotos,
        status: "pending",
        createdAt: new Date(),
      });

      // ✅ Show success message
      Swal.fire({
        icon: "success",
        title: "Review Submitted Successfully!",
        text: "Thank you for your feedback. Your review is now pending approval.",
        timer: 3000,
        showConfirmButton: false,
      });

      // ✅ Reset the form
      setFormData({ name: "", title: "", quote: "", rating: 0, profileImage: null });
      setPhotoFiles([]);
    } catch (error) {
      console.error("Error submitting review:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "There was an issue submitting your review. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="max-w-md mx-auto p-4 bg-black shadow-md rounded-lg"
      onSubmit={handleSubmit}
    >
      <h2 className="text-lg font-bold mb-4">Submit a Review</h2>

      {/* Name Field */}
      <label className="block mb-2">
        Name:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        />
      </label>

      {/* Title Field */}
      <label className="block mb-2">
        Title:
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
      </label>

      {/* Quote Field */}
      <label className="block mb-2">
        Quote:
        <textarea
          name="quote"
          value={formData.quote}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        ></textarea>
      </label>

      {/* Rating Field */}
      <label className="block mb-2">
        Rating (1-10):
        <input
          type="number"
          name="rating"
          value={formData.rating}
          onChange={handleInputChange}
          min="1"
          max="10"
          className="w-full p-2 border rounded"
          required
        />
      </label>

      {/* Profile Image Field */}
      <label className="block mb-2">
        Profile Image:
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFormData({ ...formData, profileImage: e.target.files[0] })}
          className="block"
        />
      </label>

      {/* Upload Photos Field */}
      <label className="block mb-4">
        Upload Photos:
        <input
          type="file"
          multiple
          onChange={handlePhotoChange}
          className="block"
          accept="image/*"
        />
      </label>

      {/* Submit Button */}
      <button
        type="submit"
        className={`w-full p-2 bg-blue-500 text-black rounded ${
          loading && "opacity-50"
        }`}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};

export default UserReviewForm;
