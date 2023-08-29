import {collection, getDocs,  getFirestore } from "firebase/firestore"

const db = getFirestore()
const bookingRef = collection(db, "bookings")

export async function getBookings() {
  const result = await getDocs(bookingRef)
  return result
}