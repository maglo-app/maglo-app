// official firebase documentation on how to import etc:
// https://firebase.google.com/docs/web/setup
// https://firebase.google.com/docs/auth/web/start

import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// .env for security but also because you can simply switch between a firebase dev instance and production instance
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID, // # for some reason I can't replace this
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
};

//initialize the connection
const app = initializeApp(firebaseConfig);

// Database: Initialize Firebase database connection
export const db = getFirestore();

// Authentication:
export const auth = getAuth(app);

// export the firebase connection and credentials
export default app;
