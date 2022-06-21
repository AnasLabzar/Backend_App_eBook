import multer from "multer";
import { initializeApp } from "firebase/app";

const storage = multer.memoryStorage();

export const handlFile = multer({ storage: storage });

const firebaseConfig = {
  apiKey: "AIzaSyDL84Goy2Jd2cNuQ7k5fz0XVsov9sVBF9o",
  authDomain: "ebookapp-81a39.firebaseapp.com",
  projectId: "ebookapp-81a39",
  storageBucket: "ebookapp-81a39.appspot.com",
  messagingSenderId: "978252595759",
  appId: "1:978252595759:web:e61a848b66acec39b63cda",
};
export const fireBaseApp = initializeApp(firebaseConfig);
