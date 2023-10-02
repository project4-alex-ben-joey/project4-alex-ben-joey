// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD9LtDEQ-SvDs1G4wyAMXFXFrETRU4AfTk",
  authDomain: "ticketmaster-app-8d9b2.firebaseapp.com",
  databaseURL: "https://ticketmaster-app-8d9b2-default-rtdb.firebaseio.com",
  projectId: "ticketmaster-app-8d9b2",
  storageBucket: "ticketmaster-app-8d9b2.appspot.com",
  messagingSenderId: "979315215651",
  appId: "1:979315215651:web:7d7176ed31014b1ae55096"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;