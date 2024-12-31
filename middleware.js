import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { NextResponse } from "next/server";

// Initialize Firebase Admin SDK only once
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

// Allowed admin emails - secure on the server
const allowedAdminEmails = ["lalith@gmail.com", "spcds123@gmail.com", "pushpithasandakelum@gmail.com", "vitharanaps@gmail.com"];

export async function middleware(request) {
  const authToken = request.cookies.get("token"); // Retrieve token from cookies

  if (!authToken) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    // Verify the ID token using Firebase Admin SDK
    const decodedToken = await getAuth().verifyIdToken(authToken.value);
    const email = decodedToken.email;

    // Check if the email is in the allowed list
    if (!allowedAdminEmails.includes(email)) {
      console.error("Unauthorized access attempt by:", email);
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  } catch (err) {
    console.error("Authentication error:", err.message);
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next(); // Allow access to the route
}

// Protect all routes under `/admin/*`
export const config = {
  matcher: ["/admin/:path*"],
};
