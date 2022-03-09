import { FirebaseApp, initializeApp, } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, addDoc, Query } from 'firebase/firestore';
// import { environment } from "./environments/environment.init";

const app = initializeApp(environment);

export const firestore = getFirestore(app)

export const fs = {
  collection: (path) => collection(firestore, path)
}

export const fstore = {
  collection: (path) => collection(firestore, path),
  doc,
  addDoc,
  Query,
  getDocs
}


// import {firestore, fstore} from '../../firebase'


 const getPlayerData = async () => {

  const playersColl = fstore.collection('players')
  const playersSnapshot = await fstore.getDocs(playersColl)
  const playerList = playersSnapshot.docs.map((_) =>_.data)

  return playerList;
}
export const fstoreResult = await getPlayerData()











