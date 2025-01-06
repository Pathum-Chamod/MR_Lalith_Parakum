// src/components/UserReviewForm.jsx

"use client";

import { db, storage } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import Swal from "sweetalert2";

// Import Custom Components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Import utility functions

const UserReviewForm = () => {
  const MAX_QUOTE_LENGTH = 320;

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    quote: "",
    rating: 0, // Will be set by clicking stars (1-10)
    profileImage: null,
  });

  // We'll keep an array for up to 3 photos
  const [photoFiles, setPhotoFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // ----------------------
  // Handle text input
  // ----------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // If the field is 'quote', enforce the max length and remove line breaks
    if (name === "quote") {
      // Remove line breaks
      const sanitizedValue = value.replace(/(\r\n|\n|\r)/gm, " ");

      if (sanitizedValue.length <= MAX_QUOTE_LENGTH) {
        setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
      } else {
        // Optionally, you can show a warning or simply prevent further input
        Swal.fire({
          icon: "warning",
          title: "Character Limit Reached",
          text: `You can only enter up to ${MAX_QUOTE_LENGTH} characters.`,
        });
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ----------------------
  // Handle Profile Image
  // ----------------------
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profileImage: file,
      }));
    }
  };

  // Remove profile image
  const removeProfileImage = () => {
    setFormData((prev) => ({ ...prev, profileImage: null }));
  };

  // ----------------------
  // Handle up to 3 photos
  // ----------------------
  const handlePhotoChange = (e) => {
    // Convert newly selected files to array
    const newSelectedFiles = Array.from(e.target.files);

    // Combine with any previously selected photos
    let combined = [...photoFiles, ...newSelectedFiles];

    // If total is over 3, slice and warn
    if (combined.length > 3) {
      Swal.fire({
        icon: "warning",
        title: "Too Many Photos",
        text: "Please select up to 3 images only.",
      });
      combined = combined.slice(0, 3); // Keep only first 3
    }

    setPhotoFiles(combined);
  };

  // Remove a single photo from the array
  const removePhoto = (index) => {
    setPhotoFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ----------------------
  // Handle star rating
  // ----------------------
  const handleStarClick = (starValue) => {
    setFormData((prev) => ({ ...prev, rating: starValue }));
  };

  // ----------------------
  // Handle form submission
  // ----------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Additional validation to ensure quote length
    if (formData.quote.length > MAX_QUOTE_LENGTH) {
      Swal.fire({
        icon: "error",
        title: "Quote Too Long",
        text: `Your quote exceeds the maximum length of ${MAX_QUOTE_LENGTH} characters.`,
      });
      setLoading(false);
      return;
    }

    try {
      // 1) Upload photos (if any)
      const uploadedPhotos = await Promise.all(
        photoFiles.map(async (file) => {
          const storageRef = ref(storage, `ReviewPhotos/${file.name}`);
          await uploadBytes(storageRef, file);
          return getDownloadURL(storageRef);
        })
      );

      // 2) Upload profile image (if provided)
      let profileImageUrl = "";
      if (formData.profileImage) {
        const profileImageRef = ref(
          storage,
          `ProfileImages/${formData.profileImage.name}`
        );
        await uploadBytes(profileImageRef, formData.profileImage);
        profileImageUrl = await getDownloadURL(profileImageRef);
      }

      // 3) Add review to Firestore (PendingReviews)
      await addDoc(collection(db, "PendingReviews"), {
        name: formData.name,
        title: formData.title,
        quote: formData.quote,
        rating: formData.rating,
        profileImage: profileImageUrl || "https://via.placeholder.com/50",
        photos: uploadedPhotos, // Up to 3
        status: "pending",
        createdAt: new Date(),
      });

      // 4) Show success message
      Swal.fire({
        icon: "success",
        title: "Review Submitted Successfully!",
        text: "Thank you for your feedback. Your review is now pending approval.",
        timer: 3000,
        showConfirmButton: false,
      });

      // 5) Reset the form
      setFormData({
        name: "",
        title: "",
        quote: "",
        rating: 0,
        profileImage: null,
      });
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

  // ----------------------
  // Handle Key Down for Quote Field
  // ----------------------
  const handleQuoteKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent adding a new line
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md m-6 p-6 rounded-lg shadow-md text-gray-100
                 bg-white/10 border border-white/20 backdrop-blur-sm 
                 transition-all duration-300 hover:shadow-xl"
      style={{
        // fallback for older browsers
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(8px)",
      }}
    >
      <h2 className="text-2xl font-extrabold mb-6 tracking-wider text-center uppercase">
        Submit a Review
      </h2>

      {/* Name Field */}
      <div className="mb-4">
        <Label htmlFor="name" className="block text-sm font-semibold mb-1">
          Name:
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleInputChange}
          required
          className="w-full"
        />
      </div>

      {/* Title Field */}
      <div className="mb-4">
        <Label htmlFor="title" className="block text-sm font-semibold mb-1">
          Title:
        </Label>
        <Input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleInputChange}
          className="w-full"
        />
      </div>

      {/* Quote Field */}
      <div className="mb-4">
        <Label htmlFor="quote" className="block text-sm font-semibold mb-1">
          Quote:
        </Label>
        <textarea
          id="quote"
          name="quote"
          value={formData.quote}
          onChange={handleInputChange}
          onKeyDown={handleQuoteKeyDown}
          className="w-full p-2 bg-transparent border border-gray-500 rounded 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 transition
                     resize-none"
          required
          maxLength={MAX_QUOTE_LENGTH}
          rows={3}
          placeholder="Enter your review here..."
        ></textarea>
        <p className="text-sm text-gray-200 mt-1 text-right">
          {formData.quote.length}/{MAX_QUOTE_LENGTH} characters
        </p>
      </div>

      {/* Rating Field as Stars (1-10) */}
      <div className="mb-4">
        <Label className="block text-sm font-semibold mb-1">
          Rating (1-10):
        </Label>
        <div className="flex items-center space-x-1 mt-1">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((starValue) => (
            <svg
              key={starValue}
              onClick={() => handleStarClick(starValue)}
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
              className={`h-7 w-7 cursor-pointer transition transform hover:scale-110 ${
                starValue <= formData.rating ? "text-yellow-300" : "text-gray-400"
              }`}
            >
              <path d="M9.049 2.927c.3-.921 1.602-.921 1.902 0l1.2 3.684a1 1 0 00.95.69h3.886c.969 0 1.371 1.24.588 1.81l-3.143 2.253a1 1 0 00-.364 1.118l1.2 3.684c.3.921-.755 1.688-1.54 1.118l-3.143-2.253a1 1 0 00-1.176 0l-3.143 2.253c-.785.57-1.84-.197-1.54-1.118l1.2-3.684a1 1 0 00-.364-1.118L2.219 9.111c-.783-.57-.38-1.81.589-1.81h3.886a1 1 0 00.95-.69l1.2-3.684z" />
            </svg>
          ))}
        </div>
        {formData.rating > 0 && (
          <p className="text-sm text-gray-200 mt-1">
            Selected Rating: {formData.rating} / 10
          </p>
        )}
      </div>

      {/* Profile Image Field */}
      <div className="mb-4">
        <Label className="block text-sm font-semibold mb-1">
          Profile Image:
        </Label>
        {!formData.profileImage ? (
          <Input
            type="file"
            accept="image/*"
            onChange={handleProfileImageChange}
            className="text-sm text-gray-300 focus:outline-none"
          />
        ) : (
          <div className="relative inline-block mt-2">
            {/* Preview of the selected Profile Image */}
            <img
              src={URL.createObjectURL(formData.profileImage)}
              alt="Profile Preview"
              className="h-16 w-16 object-cover rounded-full border border-gray-500"
            />
            {/* Remove button */}
            <button
              type="button"
              onClick={removeProfileImage}
              className="absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs px-1 
                         hover:bg-red-700 transition"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Upload Photos Field (up to 3) */}
      <div className="mb-4">
        <Label className="block text-sm font-semibold mb-1">
          Upload Photos (up to 3):
        </Label>
        <Input
          type="file"
          multiple
          onChange={handlePhotoChange}
          accept="image/*"
          className="text-sm text-gray-300 focus:outline-none"
        />
        {/* Thumbnails with remove buttons */}
        <div className="flex flex-wrap gap-3 mt-3">
          {photoFiles.map((file, index) => (
            <div
              key={index}
              className="relative transition hover:scale-105 hover:shadow-lg"
            >
              <img
                src={URL.createObjectURL(file)}
                alt={`Preview ${index}`}
                className="h-16 w-16 object-cover rounded-md border border-gray-500"
              />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute top-0 right-0 bg-red-600 text-white 
                           rounded-full text-xs px-1 hover:bg-red-700 transition"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-6">
        <button
          type="submit"
          className={`w-full py-2 px-4 bg-blue-500 text-white rounded font-bold 
                     transition-all duration-200 hover:bg-blue-600 hover:scale-[1.02] ${
                       loading ? "opacity-50 cursor-not-allowed" : ""
                     }`}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </form>
  );
};

export default UserReviewForm;
//fine and styled forum!