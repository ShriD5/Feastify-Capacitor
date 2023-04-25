import { initializeApp  } from 'firebase/app';
import { getAuth, connectAuthEmulator, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore' ;

const firebaseConfig = {
    apiKey: "AIzaSyDNrbhK1K9yYQDFA7IunCbAUJzM8rCFuQc",
    authDomain: "labez-f769c.firebaseapp.com",
    databaseURL: "https://labez-f769c-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "labez-f769c",
    storageBucket: "labez-f769c.appspot.com",
    messagingSenderId: "383521533065",
    appId: "1:383521533065:web:1c2ff4e18d9a1c795f6a58",
    measurementId: "G-Q5GN9HX5YY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database =  getFirestore(app);

export default app;
