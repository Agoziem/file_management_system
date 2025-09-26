import { AxiosInstanceWithToken } from "@/data/instance";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

// Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCIV8P7RsTnM97XD1EzgMjbXnY9qD2Jf1M",
  authDomain: "file-management-system-23781.firebaseapp.com",
  projectId: "file-management-system-23781",
  storageBucket: "file-management-system-23781.firebasestorage.app",
  messagingSenderId: "139359924061",
  appId: "1:139359924061:web:85f975e5bf79e424ec82b4",
  measurementId: "G-0Y17VB6MMZ"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const messaging = async () => {
  const supported = await isSupported();
  return supported ? getMessaging(app) : null;
};

export const fetchToken = async () => {
  try {
    const fcmMessaging = await messaging();
    if (fcmMessaging) {
      const token = await getToken(fcmMessaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY,
      });
      if (token) {
        const response = await AxiosInstanceWithToken.put("/api/v1/user/update-user", {fcmtoken: token});
        return response.data;
      } else {
        console.warn(
          "No registration token available. Request permission to generate one."
        );
      }
      return token;
    }
    return null;
  } catch (err) {
    console.error("An error occurred while fetching the token:", err);
    return null;
  }
};

export { app, messaging };
