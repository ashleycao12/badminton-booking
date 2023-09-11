import {collection, getDocs,  getFirestore } from "firebase/firestore"

export async function getBookings() {
  const db = getFirestore()
  const bookingRef = collection(db, "bookings")
  const querySnapshot  = await getDocs(bookingRef)
  const result:booking[] = []
  querySnapshot.forEach((doc) => {
    result.push({
      dateTime: new Date(doc.data().dateTime.seconds*1000),
      userId: doc.data().userId
    })
  });
  return result
}