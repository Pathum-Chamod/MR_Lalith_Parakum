"use client";
import { Button } from "@/components/ui/button";
import { header_data } from "@/helper/data";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const lang = [
  { id: 1, lang: "🇬🇧 En", langText: "en" },
  { id: 2, lang: "🇮🇹 It", langText: "it" },
];

const Navbar = () => {
  const [openLanguage, setOpenLanguage] = useState(false);
  const [selectedLang, setSelectedLang] = useState(lang[0]);
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Monitor Authentication State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLanguageSelect = (language) => {
    setSelectedLang(language);
    setOpenLanguage(false);
  };

  const handleLoginClick = () => {
    router.push("/admin/login");
  };

  const handleLogoutClick = async () => {
    try {
      await signOut(auth);
      setUser(null); // Clear user state
      router.push("/"); // Redirect to Home
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="bg-black w-[100vw]">
      <div className="h-[10vh] max-w-[1280px] flex items-center mx-auto">
        <div className="flex w-full justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src="/logo.png"
              alt="Logo"
              width={50}
              height={50}
              className="cursor-pointer"
              onClick={() => router.push("/")}
            />
          </div>

          {/* Navigation Links */}
          <div>
            <ul className="flex items-center gap-6">
              {header_data.map((item) =>
                item.title === "Home" ? (
                  <li key={item.id}>
                    <Link
                      href="/"
                      className="text-white cursor-pointer hover:text-gray-500 font-semibold transition-all duration-200"
                    >
                      {item.title}
                    </Link>
                  </li>
                ) : (
                  <li
                    key={item.id}
                    className="text-white cursor-pointer hover:text-gray-500 font-semibold transition-all duration-200"
                  >
                    {item.title}
                  </li>
                )
              )}
              {/* Dashboard Tab: Visible only for logged-in users */}
              {user && (
                <li>
                  <Link
                    href="/admin/dashboard"
                    className="text-white cursor-pointer hover:text-gray-500 font-semibold transition-all duration-200"
                  >
                    Dashboard
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Language and Login/Logout Buttons */}
          <div>
            <ul className="flex items-center gap-4 relative">
              {/* Language Selector */}
              <li
                className="text-white text-sm flex items-center cursor-pointer"
                onClick={() => setOpenLanguage(!openLanguage)}
              >
                {selectedLang.lang}
              </li>

              {/* Login/Logout Button */}
              <li>
                {user ? (
                  <Button variant="gradient_bg" onClick={handleLogoutClick}>
                    Logout
                  </Button>
                ) : (
                  <Button variant="gradient_bg" onClick={handleLoginClick}>
                    Login
                  </Button>
                )}
              </li>

              {/* Language Dropdown */}
              {openLanguage && (
                <div className="flex flex-col items-center justify-center w-24 z-50 absolute top-10 right-[115px] bg-black rounded-lg shadow-md">
                  <ul>
                    {lang.map((item) => (
                      <li
                        key={item.id}
                        onClick={() => handleLanguageSelect(item)}
                        className="flex items-center gap-2 hover:bg-gray-500 px-2 my-1 rounded-sm cursor-pointer"
                      >
                        {item.lang}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
