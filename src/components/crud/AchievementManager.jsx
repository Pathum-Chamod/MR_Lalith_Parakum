"use client";

import { db, storage } from "@/lib/firebase";
import { addDoc, collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useState } from "react";

const AchievementManager = () => {
  const [achievements, setAchievements] = useState([]);
  const [newAchievement, setNewAchievement] = useState({ title: "", description: "", image: null });
  const [loading, setLoading] = useState(false);

  // Fetch Achievements
  const fetchAchievements = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Achievements"));
      const achievementsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAchievements(achievementsData);
    } catch (error) {
      console.error("Error fetching achievements:", error);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  // Add Achievement
  const addAchievement = async () => {
    if (!newAchievement.title || !newAchievement.description || !newAchievement.image) {
      alert("Please fill all fields!");
      return;
    }

    if (newAchievement.description.length > 220) {
      alert("Description cannot exceed 220 characters.");
      return;
    }

    setLoading(true);
    try {
      // Upload image to storage
      const storageRef = ref(storage, `AchievementPictures/${Date.now()}_${newAchievement.image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, newAchievement.image);

      await uploadTask;
      const imageUrl = await getDownloadURL(storageRef);

      // Add to Firestore
      await addDoc(collection(db, "Achievements"), {
        title: newAchievement.title,
        description: newAchievement.description.slice(0, 220),
        image: { url: imageUrl, path: storageRef.fullPath },
      });

      alert("Achievement added successfully!");
      fetchAchievements(); // Refresh achievements
      setNewAchievement({ title: "", description: "", image: null });
    } catch (error) {
      console.error("Error adding achievement:", error);
      alert("Failed to add achievement.");
    } finally {
      setLoading(false);
    }
  };

  // Delete Achievement
  const deleteAchievement = async (id, imagePath) => {
    setLoading(true);
    try {
      // Delete image from storage
      if (imagePath) {
        const imageRef = ref(storage, imagePath);
        await deleteObject(imageRef);
      }

      // Delete from Firestore
      await deleteDoc(doc(db, "Achievements", id));
      alert("Achievement deleted successfully!");
      fetchAchievements(); // Refresh achievements
    } catch (error) {
      console.error("Error deleting achievement:", error);
      alert("Failed to delete achievement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Manage Achievements</h2>

      {/* Add Achievement Form */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 rounded bg-gray-700 text-white mb-2"
          value={newAchievement.title}
          onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
        />
        <textarea
          placeholder="Description (max 220 characters)"
          className="w-full p-2 rounded bg-gray-700 text-white mb-2"
          value={newAchievement.description}
          maxLength={220}
          onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
        />
        <input
          type="file"
          accept="image/*"
          className="w-full p-2 rounded bg-gray-700 text-white mb-2"
          onChange={(e) => setNewAchievement({ ...newAchievement, image: e.target.files[0] })}
        />
        <button
          onClick={addAchievement}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Achievement"}
        </button>
      </div>

      {/* Display Achievements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {achievements.map((achievement) => (
          <div key={achievement.id} className="bg-gray-700 p-4 rounded shadow">
            <h3 className="text-white font-semibold">{achievement.title}</h3>
            <p className="text-gray-400">{achievement.description}</p>
            <img
              src={achievement.image.url}
              alt={achievement.title}
              className="w-full h-48 object-cover rounded mb-2"
            />
            <button
              onClick={() => deleteAchievement(achievement.id, achievement.image.path)}
              className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 mr-2"
              disabled={loading}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementManager;
