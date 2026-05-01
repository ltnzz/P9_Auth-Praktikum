import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
    apiKey: "your-key",
    authDomain: "your-key",
    projectId: "your-key",
    storageBucket: "your-key",
    messagingSenderId: "your-key",
    appId: "your-key",
    measurementId: "your-key",
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});
