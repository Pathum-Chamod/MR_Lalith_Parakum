"use client";

import AchievementManager from "@/components/crud/AchievementManager";
import ProfileManager from "@/components/crud/ProfileManager";
import SlideshowManager from "@/components/crud/SlideshowManager";

const AdminDashboard = () => {
  return (
    <div className="p-8 bg-gray-800 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Main Slideshow Section */}
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-700 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-center">Main Slideshow</h2>
        <SlideshowManager collectionName="SlideshowMain" documentName="MainSlides" />
      </div>

      {/* Profile Section */}
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-700 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-center">Profile Section</h2>
        <ProfileManager />
      </div>

      {/* Achievements Section */}
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-700">
        <h2 className="text-2xl font-semibold mb-4 text-center">Achievements Section</h2>
        <AchievementManager />
      </div>
    </div>
  );
};

export default AdminDashboard;
