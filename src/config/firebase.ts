import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyADgoA4n44b5IpRyBzR93SCo6P-F5LOy_Y",
  authDomain: "fir-c2ad1.firebaseapp.com",
  projectId: "fir-c2ad1",
  storageBucket: "fir-c2ad1.appspot.com",
  messagingSenderId: "963075394689",
  appId: "1:963075394689:web:1efe3ebba9f4ade01b9180",
  measurementId: "G-ZFNRG8L8XQ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

export const db = getFirestore(app)
export const storage = getStorage(app)