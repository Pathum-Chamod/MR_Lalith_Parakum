"use client";

import { db, storage } from "@/lib/firebase";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useState } from "react";

const AchievementManager = () => {
  const [achievements, setAchievements] = useState([]);
  const [newAchievement, setNewAchievement] = useState({ title: "", description: "", image: null });
  const [editAchievement, setEditAchievement] = useState(null); // To track the achievement being edited
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

    if (newAchievement.description.length > 1000) {
      alert("Description cannot exceed 1000 characters.");
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
        description: newAchievement.description.slice(0, 1000),
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

  // Update Achievement
  const updateAchievement = async () => {
    if (!editAchievement.title || !editAchievement.description) {
      alert("Please fill all fields!");
      return;
    }

    setLoading(true);
    try {
      const achievementRef = doc(db, "Achievements", editAchievement.id);

      if (editAchievement.newImage) {
        // Upload new image to storage
        const storageRef = ref(storage, `AchievementPictures/${Date.now()}_${editAchievement.newImage.name}`);
        const uploadTask = uploadBytesResumable(storageRef, editAchievement.newImage);
        await uploadTask;
        const imageUrl = await getDownloadURL(storageRef);

        // Delete old image
        if (editAchievement.image.path) {
          const oldImageRef = ref(storage, editAchievement.image.path);
          await deleteObject(oldImageRef);
        }

        // Update Firestore with new image
        await updateDoc(achievementRef, {
          title: editAchievement.title,
          description: editAchievement.description.slice(0, 1000),
          image: { url: imageUrl, path: storageRef.fullPath },
        });
      } else {
        // Update Firestore without changing the image
        await updateDoc(achievementRef, {
          title: editAchievement.title,
          description: editAchievement.description.slice(0, 1000),
        });
      }

      alert("Achievement updated successfully!");
      fetchAchievements(); // Refresh achievements
      setEditAchievement(null);
    } catch (error) {
      console.error("Error updating achievement:", error);
      alert("Failed to update achievement.");
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
          placeholder="Description (max 1000 characters)"
          className="w-full p-2 rounded bg-gray-700 text-white mb-2"
          value={newAchievement.description}
          maxLength={1000}
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

      {/* List Achievements */}
      <div className="space-y-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className="bg-gray-700 p-4 rounded shadow flex items-center justify-between"
          >
            {editAchievement?.id === achievement.id ? (
              <div className="flex-1">
                <input
                  type="text"
                  className="w-full p-2 rounded bg-gray-600 text-white mb-2"
                  value={editAchievement.title}
                  onChange={(e) => setEditAchievement({ ...editAchievement, title: e.target.value })}
                />
                <textarea
                  className="w-full p-2 rounded bg-gray-600 text-white mb-2"
                  value={editAchievement.description}
                  onChange={(e) => setEditAchievement({ ...editAchievement, description: e.target.value })}
                />
                <input
                  type="file"
                  accept="image/*"
                  className="w-full p-2 rounded bg-gray-600 text-white mb-2"
                  onChange={(e) => setEditAchievement({ ...editAchievement, newImage: e.target.files[0] })}
                />
                <button
                  onClick={updateAchievement}
                  className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 mr-2"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update"}
                </button>
                <button
                  onClick={() => setEditAchievement(null)}
                  className="bg-gray-500 px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex-1">
                <h3 className="text-white font-semibold">{achievement.title}</h3>
                <p className="text-gray-400">{achievement.description}</p>
                <img
                  src={achievement.image.url}
                  alt={achievement.title}
                  className="w-24 h-24 object-cover rounded mt-2"
                />
              </div>
            )}
            {!editAchievement && (
              <div>
                <button
                  onClick={() => setEditAchievement(achievement)}
                  className="bg-yellow-600 px-4 py-2 rounded hover:bg-yellow-700 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteAchievement(achievement.id, achievement.image.path)}
                  className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementManager;
