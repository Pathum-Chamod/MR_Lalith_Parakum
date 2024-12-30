import { db, storage } from "@/lib/firebase";
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

// Fetch slides from Firestore
export const fetchSlides = async () => {
  try {
    const docRef = doc(db, "SlideshowMain", "MainSlides");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data().slides || []; // Return slides array
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching slides:", error);
    throw new Error("Failed to fetch slides.");
  }
};

// Upload an image to Firebase Storage and update Firestore
export const uploadImage = async (file) => {
  try {
    const imagePath = `SlideShowPic/${Date.now()}_${file.name}`; // Unique path
    const storageRef = ref(storage, imagePath);

    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Error uploading image:", error);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(storageRef);

          // Update Firestore
          const docRef = doc(db, "SlideshowMain", "MainSlides");
          await updateDoc(docRef, {
            slides: arrayUnion({ url: downloadURL, path: imagePath }),
          });

          resolve(downloadURL); // Return URL on success
        }
      );
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image.");
  }
};

// Delete an image from Firebase Storage and Firestore
export const deleteImage = async (slide) => {
  try {
    if (!slide.path) throw new Error("Image path not found!");

    // Delete image from Storage
    const storageRef = ref(storage, slide.path);
    await deleteObject(storageRef);

    // Remove slide object from Firestore
    const docRef = doc(db, "SlideshowMain", "MainSlides");
    await updateDoc(docRef, {
      slides: arrayRemove(slide),
    });

    return true;
  } catch (error) {
    console.error("Error deleting slide:", error);
    throw new Error("Failed to delete slide.");
  }
};
