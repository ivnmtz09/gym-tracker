import { collection, doc, getDoc, setDoc, addDoc, getDocs, query, where, orderBy, Timestamp } from "firebase/firestore";
import { db } from "../firebase";

const CHECKINS_COLLECTION = "checkins";
const USERS_COLLECTION = "users";

// Funciones de Perfil de Usuario
export const getUserProfile = async (userId) => {
  try {
    const docRef = doc(db, USERS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Error al obtener perfil: ", error);
    return null;
  }
};

export const saveUserProfile = async (userId, profileData) => {
  try {
    await setDoc(doc(db, USERS_COLLECTION, userId), profileData, { merge: true });
    return { success: true };
  } catch (error) {
    console.error("Error al guardar perfil: ", error);
    return { success: false, error };
  }
};

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
