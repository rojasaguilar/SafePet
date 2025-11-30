// Import the functions you need from the SDKs you need
import admin from 'firebase-admin';
// import { getAuth } from "firebase/auth";


//FIRESTORE
// import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


let firebaseApp;
if (!admin.apps.length) {
  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.SERVICE_ACCOUNT)),
  });
}

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// const firebaseConfig = {
//   apiKey: dotenv_conf.API_KEY_FIREBASE,
//   authDomain: dotenv_conf.AUTH_DOMAIN_FIREBASE,
//   projectId: dotenv_conf.PROJECT_ID_FIREBASE,
//   storageBucket: dotenv_conf.STORAGE_BUCKET_FIREBASE,
//   messagingSenderId: dotenv_conf.MESSAGING_SENDER_ID_FIREBASE,
//   appId: dotenv_conf.APP_ID_FIREBASE,
//   measurementId: dotenv_conf.MEASUREMENT_ID_FIREBASE,
// };

// Initialize Firebase
// const firebaseApp = admin.initializeApp(firebaseConfig);

//FIRESTORE
// const  db = getFirestore(firebaseApp);
const db = admin.firestore();
// const auth  = getAuth(firebaseApp);

// export async function getCities() {
//   const citiesCol = collection(db, 'cities');
//   const citySnapshot = await getDocs(citiesCol);
//   const cityList = citySnapshot.docs.map(doc => doc.data());
//   return cityList;
// }

// export { firebaseApp, db, auth };
export {db};
