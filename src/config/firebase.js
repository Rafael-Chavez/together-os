import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

  const firebaseConfig = {
    apiKey: "AIzaSyBcmwHcLM-qDyCSUG7maxkzL_5h9krVTMQ",
    authDomain: "together-os.firebaseapp.com",
    projectId: "together-os",
    storageBucket: "together-os.firebasestorage.app",
    messagingSenderId: "735147881260",
    appId: "1:735147881260:web:685284d5afd635bebf3289"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
