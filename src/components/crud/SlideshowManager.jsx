"use client";

import { db, storage } from "@/lib/firebase";
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useEffect, useState } from "react";

const SlideshowManager = ({ collectionName, documentName }) => {
  const [slides, setSlides] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [globalLoading, setGlobalLoading] = useState(false);

  // Fetch slides from Firestore
  const fetchSlides = async () => {
    setGlobalLoading(true);
    setError(null);
    try {
      const docRef = doc(db, collectionName, documentName);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setSlides(data.slides || []);
      } else {
        setSlides([]);
      }
    } catch (err) {
      setError("Error fetching slides. Please try again later.");
      console.error("Error fetching slides:", err);
    } finally {
      setGlobalLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  // Upload new slide
  const handleUpload = async () => {
    if (!newImage) return alert("Please select an image!");
    if (newImage.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB. Please choose a smaller file.");
      return;
    }

    setLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const imagePath = `SlideShowPic/${Date.now()}_${newImage.name}`;
      const storageRef = ref(storage, imagePath);
      const uploadTask = uploadBytesResumable(storageRef, newImage);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setUploadProgress(progress);
        },
        (err) => {
          console.error("Error uploading image:", err);
          setError("Error uploading image. Please try again.");
          setLoading(false);
        },
        async () => {
          const imageURL = await getDownloadURL(storageRef);

          const docRef = doc(db, collectionName, documentName);
          await updateDoc(docRef, {
            slides: arrayUnion({ url: imageURL, path: imagePath }),
          });

          setNewImage(null);
          setUploadProgress(0);
          fetchSlides();
        }
      );
    } catch (err) {
      console.error("Upload error:", err);
      setError("Error uploading image. Please check the console.");
    } finally {
      setLoading(false);
    }
  };

  // Delete a slide
  const handleDelete = async (slide) => {
    if (!slide.path) {
      alert("Error: Image path not found!");
      return;
    }

    if (!confirm("Are you sure you want to delete this slide?")) return;

    setGlobalLoading(true);
    setError(null);

    try {
      const storageRef = ref(storage, slide.path);
      await deleteObject(storageRef);

      const docRef = doc(db, collectionName, documentName);
      await updateDoc(docRef, {
        slides: arrayRemove(slide),
      });

      fetchSlides();
    } catch (err) {
      console.error("Error deleting slide:", err);
      setError("Failed to delete the slide. Please try again.");
    } finally {
      setGlobalLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-800 text-white">
      {globalLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        </div>
      )}

      {/* Upload Section */}
      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewImage(e.target.files[0])}
          className="mb-2"
        />
        <button
          onClick={handleUpload}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading
            ? `Uploading... ${uploadProgress > 0 ? `${uploadProgress}%` : ""}`
            : "Upload New Slide"}
        </button>
        {uploadProgress > 0 && (
          <div className="mt-2 w-full bg-gray-600 rounded">
            <div
              className="h-2 bg-blue-500 rounded"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
      </div>

      {error && <p className="mb-4 text-red-500 text-center">{error}</p>}

      {/* Existing Slides */}
      <h2 className="text-xl mb-4">Existing Slides</h2>
      {slides.length === 0 ? (
        <p className="text-center text-gray-400">No slides available.</p>
      ) : (
        <ul className="space-y-4">
          {slides.map((slide, index) => (
            <li
              key={index}
              className="flex items-center justify-between gap-4 bg-gray-700 p-4 rounded"
            >
              <img
                src={slide.url}
                alt={`Slide ${index + 1}`}
                className="w-32 h-20 object-cover rounded"
              />
              <button
                onClick={() => handleDelete(slide)}
                className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SlideshowManager;
//fine code.
