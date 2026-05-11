import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider
} from "firebase/auth";

const firebaseConfig = {

  apiKey: "AIzaSyCIBFUa46JWTsRwZFuXC9JOwrbLs0Mg5yo",

  authDomain:
    "skillsync-48ebc.firebaseapp.com",

  projectId: "skillsync-48ebc",

  storageBucket:
    "skillsync-48ebc.firebasestorage.app",

  messagingSenderId: "631202189869",

  appId:
    "1:631202189869:web:480e35753415ed50e39ea4",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const provider =
  new GoogleAuthProvider();