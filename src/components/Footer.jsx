"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LampContainer } from "./ui/lamp.jsx"; // Adjust this path if needed

const Footer = () => {
  const router = useRouter();

  return (
    // Add some vertical spacing as needed
    <LampContainer className="!h-auto !min-h-0 pt-16 pb-8">
      {/* Main Footer Container */}
      <div className="max-w-[1280px] w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-white">
        
        {/* 1) Company */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold">Company</h3>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>About Us</li>
            <li>Careers</li>
            <li>Contact</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* 2) Support */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold">Support</h3>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>Help Center</li>
            <li>FAQs</li>
            <li>Terms of Service</li>
            <li>Refund Policy</li>
          </ul>
        </div>

        {/* 3) Community */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold">Community</h3>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>Forum</li>
            <li>Blog</li>
            <li>Events</li>
            <li>Partnerships</li>
          </ul>
        </div>

        {/* 4) Logo (Right side) */}
        <div className="flex flex-col items-end justify-end">
          <Image
            src="/logo.png"
            alt="Logo"
            width={80}
            height={80}
            className="cursor-pointer"
            onClick={() => router.push("/")}
          />
        </div>
      </div>

      {/* Footer Bottom Text */}
      <h3 className="text-sm text-gray-400 text-center mt-8">
        All Rights Reserved @ 2024
      </h3>
    </LampContainer>
  );
};

export default Footer;
