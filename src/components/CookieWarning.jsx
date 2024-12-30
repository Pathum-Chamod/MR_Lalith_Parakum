"use client";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const CookieWarning = () => {
  const [cookiesBlocked, setCookiesBlocked] = useState(false);
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    const checkThirdPartyCookies = () => {
      try {
        document.cookie = "test_cookie=1; SameSite=None; Secure"; // Set a test cookie
        if (!document.cookie.includes("test_cookie")) {
          return true; // Cookies are blocked
        }
        return false; // Cookies are allowed
      } catch {
        return true; // Cookies are blocked
      }
    };

    const blocked = checkThirdPartyCookies();
    setCookiesBlocked(blocked);

    if (blocked) {
      MySwal.fire({
        icon: "error",
        title: "Cookies are blocked!",
        text: "Please enable third-party cookies in your browser settings for login functionality to work properly.",
        confirmButtonText: "Okay",
        customClass: {
          popup: "custom-popup-class",
        },
      });
    }
  }, [MySwal]);

  return null; // No visible content since Swal handles the warning
};

export default CookieWarning;
