"use client";

import { glowEffect } from "@/helper/styles";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";
import CustomTitle from "./CustomTitle";
import { Button } from "./ui/button";

const ProfileSection = () => {
  const MAX_WORDS_DISPLAY = 128; // Max words to display before "Show More"
  const [profile, setProfile] = useState({
    name: "",
    title: "",
    description: [], // Handle description as an array
    image: { url: "" },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Fetch profile data from Firestore
  const fetchProfile = async () => {
    setError(null);
    setLoading(true);
    try {
      const docRef = doc(db, "ProfileSection", "MainProfile");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfile({
          ...data,
          description: Array.isArray(data.description)
            ? data.description.filter((desc) => desc.trim() !== "") // Filter out empty descriptions
            : [data.description], // Ensure description is an array
        });
      } else {
        setError("Profile data not found.");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to fetch profile data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Helper function to truncate words
  const getTruncatedDescription = () => {
    const allWords = profile.description
      .join(" ") // Combine all paragraphs into a single string
      .split(/\s+/) // Split into words
      .filter((word) => word.trim() !== ""); // Remove empty words

    if (allWords.length > MAX_WORDS_DISPLAY && !showFullDescription) {
      return allWords.slice(0, MAX_WORDS_DISPLAY).join(" ");
    }

    return profile.description.join("\n"); // Return full description when expanded
  };

  const handleToggleDescription = () => {
    setShowFullDescription((prevState) => !prevState); // Toggle the state
  };

  return (
    <div className="bg-black py-8 md:h-[100vh] flex items-center justify-center">
      <div className="max-w-[1280px] flex flex-col justify-center items-center mx-auto py-[20px]">
        <CustomTitle text="Profile Summary" />

        {loading ? (
          <p className="text-white text-xl">Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-xl">{error}</p>
        ) : (
          <div className="flex flex-col gap-5 md:flex md:flex-row md:px-10 lg:flex w-full items-center my-5">
            {/* Image Section */}
            <div className="w-full md:w-1/2 h-auto flex flex-col gap-3 items-center justify-center">
              <Image
                src={profile.image.url || "/placeholder-image.png"} // Fallback for missing image
                width={100}
                height={100}
                alt={profile.name}
                className="w-full h-[60vh] rounded-lg"
                style={glowEffect}
              />
            </div>

            {/* Text Section */}
            <div className="w-full md:w-1/2 h-auto flex flex-col justify-between">
              <div className="flex flex-col gap-3">
                <h1 className="text-white text-4xl">I'm {profile.name}</h1>
                <h3 className="text-white text-xl">{profile.title}</h3>
              </div>
              {/* Render description */}
              <div className="text-gray-400 mb-4">
                {getTruncatedDescription()
                  .split("\n")
                  .map((paragraph, index) => (
                    <p key={index} className="mb-2">
                      {paragraph}
                    </p>
                  ))}
              </div>
              {profile.description
                .join(" ") // Combine all words
                .split(/\s+/).length > MAX_WORDS_DISPLAY && (
                <Button
                  variant="gradient_bg"
                  className="w-[200px]"
                  onClick={handleToggleDescription} // Toggle button state
                >
                  {showFullDescription ? "Show Less" : "Show More"}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSection;
