"use client";

import { db, storage } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
    deleteObject,
    getDownloadURL,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { useEffect, useState } from "react";

// Maximum word count for the combined paragraphs
const MAX_WORD_COUNT = 256;

// Helper function to calculate total word count
const getTotalWordCount = (description) => {
  return description.reduce((total, paragraph) => {
    return total + paragraph.trim().split(/\s+/).length;
  }, 0);
};

const ProfileManager = () => {
  const [profile, setProfile] = useState({
    name: "",
    title: "",
    description: ["", ""], // Array for multiple paragraphs
    image: { url: "", path: "" },
  });
  const [newImage, setNewImage] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch Profile Data from Firestore
  const fetchProfile = async () => {
    setError(null);
    try {
      const docRef = doc(db, "ProfileSection", "MainProfile");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfile({
          ...data,
          description: Array.isArray(data.description)
            ? data.description
            : ["", ""], // Ensure it's an array
        });
      } else {
        console.error("No profile document found!");
        setError("Profile data not found.");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to fetch profile data.");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle Image Preview
  useEffect(() => {
    if (newImage) {
      const reader = new FileReader();
      reader.onload = () => setNewImagePreview(reader.result);
      reader.readAsDataURL(newImage);
    } else {
      setNewImagePreview(null);
    }
  }, [newImage]);

  // Handle Profile Update
  const handleUpdateProfile = async () => {
    const totalWordCount = getTotalWordCount(profile.description);

    // Validation: Ensure name and title are filled and description does not exceed the word count limit
    if (
      !profile.name ||
      !profile.title ||
      (profile.description[0].trim() === "" && profile.description[1].trim() === "")
    ) {
      alert(
        "Please fill in the required fields, and at least one description paragraph!"
      );
      return;
    }

    if (totalWordCount > MAX_WORD_COUNT) {
      const exceededWords = totalWordCount - MAX_WORD_COUNT;
      alert(
        `The total word count of both paragraphs exceeds the limit by ${exceededWords} words!`
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let imageUrl = profile.image.url;
      let imagePath = profile.image.path;

      if (newImage) {
        // Delete the old image if it exists
        if (imagePath) {
          const oldImageRef = ref(storage, imagePath);
          await deleteObject(oldImageRef);
        }

        // Upload the new image
        const newPath = `ProfileImages/${Date.now()}_${newImage.name}`;
        const storageRef = ref(storage, newPath);
        const uploadTask = uploadBytesResumable(storageRef, newImage);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            (err) => reject(err),
            async () => {
              imageUrl = await getDownloadURL(storageRef);
              imagePath = newPath;
              resolve();
            }
          );
        });
      }

      // Update Firestore document
      const docRef = doc(db, "ProfileSection", "MainProfile");
      await updateDoc(docRef, {
        name: profile.name,
        title: profile.title,
        description: profile.description,
        image: { url: imageUrl, path: imagePath },
      });

      alert("Profile updated successfully!");
      fetchProfile(); // Refresh profile data
      setNewImage(null); // Clear new image input
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Manage Profile Section</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Name Field */}
      <div className="mb-4">
        <label className="block mb-2 text-gray-400">Name</label>
        <input
          type="text"
          className="w-full p-2 rounded bg-gray-700 text-white"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
        />
      </div>

      {/* Title Field */}
      <div className="mb-4">
        <label className="block mb-2 text-gray-400">Title</label>
        <input
          type="text"
          className="w-full p-2 rounded bg-gray-700 text-white"
          value={profile.title}
          onChange={(e) => setProfile({ ...profile, title: e.target.value })}
        />
      </div>

      {/* Description Paragraph 1 */}
      <div className="mb-4">
        <label className="block mb-2 text-gray-400">Description Paragraph 1</label>
        <textarea
          className="w-full p-2 rounded bg-gray-700 text-white"
          rows={3}
          value={profile.description[0] || ""}
          onChange={(e) => {
            const updatedDescription = [...profile.description];
            updatedDescription[0] = e.target.value;
            setProfile({ ...profile, description: updatedDescription });
          }}
        />
      </div>

      {/* Description Paragraph 2 */}
      <div className="mb-4">
        <label className="block mb-2 text-gray-400">Description Paragraph 2</label>
        <textarea
          className="w-full p-2 rounded bg-gray-700 text-white"
          rows={3}
          value={profile.description[1] || ""}
          onChange={(e) => {
            const updatedDescription = [...profile.description];
            updatedDescription[1] = e.target.value;
            setProfile({ ...profile, description: updatedDescription });
          }}
        />
      </div>

      {/* Image Upload */}
      <div className="mb-4">
        <label className="block mb-2 text-gray-400">Profile Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewImage(e.target.files[0])}
        />
        {newImagePreview && (
          <img
            src={newImagePreview}
            alt="New Profile"
            className="mt-4 w-32 h-32 object-cover rounded"
          />
        )}
        {!newImagePreview && profile.image.url && (
          <img
            src={profile.image.url}
            alt="Current Profile"
            className="mt-4 w-32 h-32 object-cover rounded"
          />
        )}
      </div>

      {/* Update Button */}
      <button
        onClick={handleUpdateProfile}
        className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Profile"}
      </button>
    </div>
  );
};

export default ProfileManager;
