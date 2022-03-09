// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js";
// import { FirebaseApp } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-database.js";
// import { Firestore ,runTransaction, writeBatch, getFirestore, collection, getDocs, doc, addDoc, Query } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-firestore.js";

// console.log('getFi/restore', Firestore)

const firebaseConfig = {
  apiKey: "AIzaSyBVnhy7RGLeKxhzywHJ2e5RV5HjYaQYQhQ",
  authDomain: "home-db-ed6f0.firebaseapp.com",
  projectId: "home-db-ed6f0",
  storageBucket: "home-db-ed6f0.appspot.com",
  messagingSenderId: "3177858927",
  appId: "1:3177858927:web:aeb4b8b013b35165564a9a"
};

// console.log('FirebaseApp.initializeApp()', FirebaseApp.initializeApp())

const app = firebase.initializeApp(firebaseConfig);
// const app = fsInstance
console.log('app', app)
const db = firebase.firestore();

// console.log('firestore.collection',firestore)
// const {collection,doc,addDoc,getDocs,Query} =db
// const {
//   collection,//: (path) => collection(db, path),
//   doc,
//   addDoc,
//   Query,
//   getDocs,
//   runTransaction,
//   writeBatch,
  
// } = firestore

export default db
// const firebase = initializeApp(firebaseConfig);
// export constdb = getFirestore.getFirestore(firebase); 
// console.log('firestore', firestore)

// export const firebaseDb = getDatabase(firebase); 

// {
//   firebaseConfig,
//   firebase,
//   firebaseDb
// }
