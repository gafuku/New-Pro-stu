import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  serverTimestamp,
  collection,
  doc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { getAuth, signInAnonymously, signInWithEmailAndPassword } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {

  apiKey: "AIzaSyCV7vXomhgFuTt6aqE7otF85HDugmmWalY",
  authDomain: "new-pro-stu.firebaseapp.com",
  projectId: "new-pro-stu",
  storageBucket: "new-pro-stu.firebasestorage.app",
  messagingSenderId: "28084977343",
  appId: "1:28084977343:web:4010e1a6483e867d14100a",
  measurementId: "G-8HZS91VR1K"
  // apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  // authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  // projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  // messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  // appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
if (!firebaseConfig.apiKey) {
    console.error("Firebase Config Error: Missing API Key. Check your .env.local file.");
}
if (!firebaseConfig.projectId) {
  console.error("Firebase Config Error: Missing Project ID.");
}

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export {
  serverTimestamp,
  collection,
  doc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  signInAnonymously,
  signInWithEmailAndPassword,
  ref,
  uploadBytes,
  getDownloadURL,
};
