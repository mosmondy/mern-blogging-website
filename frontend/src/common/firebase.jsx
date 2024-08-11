// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBdNOUfB6wPAtIa-aqmAY84G91XkTHElYI',
  authDomain: 'azarea-9e60b.firebaseapp.com',
  projectId: 'azarea-9e60b',
  storageBucket: 'azarea-9e60b.appspot.com',
  messagingSenderId: '849541162896',
  appId: '1:849541162896:web:2c9d73f258bbc5e9a03515',
  measurementId: 'G-FP9QVHX8PK',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// google auth

const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () => {
  let user = null;
  let access_token = null;

  await signInWithPopup(auth, provider)
    .then((result) => {
      user = result.user;
      return user.getIdToken(); // Get the ID token
    })
    .then((token) => {
      access_token = token;
    })
    .catch((err) => {
      console.log(err);
    });

  //   return user;
  return { user, access_token };
};
