import { collection, doc, getDoc, setDoc, addDoc, getDocs, query, where, orderBy, Timestamp, deleteDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";

const CHECKINS_COLLECTION = "checkins";
const USERS_COLLECTION = "users";
const GROUPS_COLLECTION = "groups";

export const createGroup = async (groupName, userId, userName) => {
  try {
    const docRef = await addDoc(collection(db, GROUPS_COLLECTION), {
      name: groupName,
      createdBy: userId,
      members: [userId],
      memberNames: { [userId]: userName },
      createdAt: Timestamp.now()
    });
    // Actualizar perfil del usuario
    await updateDoc(doc(db, USERS_COLLECTION, userId), { groupId: docRef.id });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error al crear grupo: ", error);
    return { success: false, error };
  }
};

export const joinGroup = async (groupId, userId, userName) => {
  try {
    const groupRef = doc(db, GROUPS_COLLECTION, groupId);
    const groupSnap = await getDoc(groupRef);
    if (!groupSnap.exists()) return { success: false, error: "El código del grupo no existe." };
    
    await updateDoc(groupRef, {
      members: arrayUnion(userId),
      [`memberNames.${userId}`]: userName
    });
    
    await updateDoc(doc(db, USERS_COLLECTION, userId), { groupId });
    return { success: true };
  } catch (error) {
    console.error("Error al unirse al grupo: ", error);
    return { success: false, error };
  }
};

export const getGroupData = async (groupId) => {
  try {
    const docRef = doc(db, GROUPS_COLLECTION, groupId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    console.error("Error al obtener grupo: ", error);
    return null;
  }
};

export const getGroupCheckIns = async (memberIds) => {
  if (!memberIds || memberIds.length === 0) return [];
  try {
    const chunk = memberIds.slice(0, 10);
    const q = query(
      collection(db, CHECKINS_COLLECTION),
      where("userId", "in", chunk),
      orderBy("date", "asc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate()
    }));
  } catch (error) {
    console.error("Error al obtener check-ins del grupo: ", error);
    return [];
  }
};

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

export const addCheckIn = async (userId, attended, notes, userEmail, time, intensity, currentWeight) => {
  try {
    const docRef = await addDoc(collection(db, CHECKINS_COLLECTION), {
      userId,
      userEmail,
      date: Timestamp.now(),
      attended,
      notes,
      time: time || "",
      intensity: intensity || "normal",
      currentWeight: currentWeight || null
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
