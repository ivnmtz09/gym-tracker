import { collection, doc, getDoc, setDoc, addDoc, getDocs, query, where, orderBy, Timestamp, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

const CHECKINS_COLLECTION = "checkins";
const USERS_COLLECTION = "users";

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

export const addCheckIn = async (userId, attended, notes, userEmail, time) => {
  try {
    const docRef = await addDoc(collection(db, CHECKINS_COLLECTION), {
      userId,
      userEmail,
      date: Timestamp.now(),
      attended,
      notes,
      time: time || ""
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error al guardar check-in: ", error);
    return { success: false, error };
  }
};

export const updateCheckIn = async (checkInId, data) => {
  try {
    const docRef = doc(db, CHECKINS_COLLECTION, checkInId);
    await setDoc(docRef, data, { merge: true });
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar check-in: ", error);
    return { success: false, error };
  }
};

export const deleteCheckIn = async (checkInId) => {
  try {
    await deleteDoc(doc(db, CHECKINS_COLLECTION, checkInId));
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar check-in: ", error);
    return { success: false, error };
  }
};

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
