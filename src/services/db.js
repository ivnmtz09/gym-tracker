import { collection, addDoc, getDocs, query, where, orderBy, Timestamp } from "firebase/firestore";
import { db } from "../firebase";

const CHECKINS_COLLECTION = "checkins";

// Guardar un nuevo check-in
export const addCheckIn = async (userId, attended, notes, userEmail) => {
  try {
    const docRef = await addDoc(collection(db, CHECKINS_COLLECTION), {
      userId,
      userEmail,
      date: Timestamp.now(),
      attended,
      notes
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error al guardar check-in: ", error);
    return { success: false, error };
  }
};

// Obtener check-ins de un usuario en específico
export const getUserCheckIns = async (userId) => {
  try {
    const q = query(
      collection(db, CHECKINS_COLLECTION),
      where("userId", "==", userId),
      orderBy("date", "asc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate()
    }));
  } catch (error) {
    console.error("Error al obtener check-ins: ", error);
    return [];
  }
};

// Obtener todos los check-ins para comparar (Ivan vs Saudith)
export const getAllCheckIns = async () => {
  try {
    const q = query(collection(db, CHECKINS_COLLECTION), orderBy("date", "asc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate()
    }));
  } catch (error) {
    console.error("Error al obtener todos los check-ins: ", error);
    return [];
  }
};
