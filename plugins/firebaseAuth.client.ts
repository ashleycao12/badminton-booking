import { initializeApp } from "firebase/app";

export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig()
  
  const firebaseConfig = {
    apiKey: config.public.FIREBASE_API_KEY,
    authDomain: "caulong-phuocthien.firebaseapp.com",
    projectId: "caulong-phuocthien",
    storageBucket: "caulong-phuocthien.appspot.com",
    messagingSenderId: "649096947692",
    appId: "1:649096947692:web:946a6be8e383b6e27442c9"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  initUser()
})