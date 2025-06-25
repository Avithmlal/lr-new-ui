import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getFirebaseToken } from "../api/authServices";

// Initialize Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);
const firestore = getFirestore(app);

// Custom token sign-in handler
export async function signInWithCustomTokenHandler() {
  try {
    const tokenResponse = await getFirebaseToken();
    
    if (!tokenResponse?.data?.firebaseToken) {
      throw new Error('No Firebase token received from server');
    }

    const userCredential = await signInWithCustomToken(
      auth,
      tokenResponse.data.firebaseToken
    );

    const user = userCredential.user;
    console.log("User signed in with Firebase:", user.uid);
    return user;
  } catch (error) {
    console.error(
      "Error signing in with custom token:",
      error.code || 'UNKNOWN_ERROR',
      error.message
    );
    throw error;
  }
}

// Sign out function (read-only mode, limited functionality)
export async function signOutFirebase() {
  try {
    await auth.signOut();
    console.log("User signed out from Firebase");
  } catch (error) {
    console.error("Error signing out from Firebase:", error);
    throw error;
  }
}

// Check if user is authenticated
export function isFirebaseAuthenticated() {
  return !!auth.currentUser;
}

// Get current user
export function getCurrentFirebaseUser() {
  return auth.currentUser;
}

// Auth state observer
export function onFirebaseAuthStateChanged(callback) {
  return auth.onAuthStateChanged(callback);
}

// Export Firebase services
export { 
  app as firebaseApp,
  auth as firebaseAuth, 
  database as firebaseDatabase, 
  storage as firebaseStorage,
  firestore as firebaseFirestore
};

// Export database for backward compatibility (same as leaproad-web)
export { database as dataBase };