"use client";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { setCookie } from "nookies";
import { useState } from "react";
import Swal from "sweetalert2";

const allowedAdminEmails = ["lalith@gmail.com", "spcds123@gmail.com"]; // Allowed admin emails

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state for buttons
  const router = useRouter();

  // Handle Email/Password Login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if email is allowed
      if (!allowedAdminEmails.includes(user.email)) {
        await signOut(auth); // Logout unauthorized user
        throw new Error("You are not authorized to access the admin dashboard.");
      }

      const token = await user.getIdToken(); // Get Firebase ID token
      setCookie(null, "token", token, { path: "/", secure: true, httpOnly: false });

      router.push("/admin/dashboard"); // Redirect
    } catch (err) {
      console.error("Login error:", err);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: err.message || "Please check your email and password.",
        confirmButtonText: "Try Again",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Login
  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      // Add custom parameters to force account selection
      googleProvider.setCustomParameters({
        prompt: "select_account", // Forces account selection
      });

      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if email is allowed
      if (!allowedAdminEmails.includes(user.email)) {
        await signOut(auth); // Logout unauthorized user
        throw new Error("You are not authorized to access the admin dashboard.");
      }

      const token = await user.getIdToken();
      setCookie(null, "token", token, { path: "/", secure: true, httpOnly: false });

      router.push("/admin/dashboard"); // Redirect
    } catch (err) {
      console.error("Google login error:", err);
      Swal.fire({
        icon: "error",
        title: "Google Login Failed",
        text: err.message || "Please try again.",
        confirmButtonText: "Try Again",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-white p-6 rounded-lg shadow-md w-80">
        {/* Admin Login Heading */}
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Admin Login
        </h1>
        {error && <p className="text-red-500 text-center mb-2">{error}</p>}
        <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(""); // Clear error message on input
            }}
            className="w-full p-2 border rounded focus:outline-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(""); // Clear error message on input
            }}
            className="w-full p-2 border rounded focus:outline-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 rounded ${
              loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className={`w-full p-2 rounded ${
              loading ? "bg-red-400" : "bg-red-500 hover:bg-red-600"
            } text-white`}
          >
            {loading ? "Signing in..." : "Sign in with Google"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
