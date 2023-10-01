import {collection, getDocs,  getFirestore } from "firebase/firestore"
import { useAllBookings } from "./useState"

export async function initBookings() {
  const allBookings = useAllBookings()
  const db = getFirestore()
  const bookingRef = collection(db, "bookings")
  const result:booking[] = []
  const querySnapshot  = await getDocs(bookingRef)

  querySnapshot.forEach((doc) => {
    result.push({
      startTime: new Date(doc.data().startTime.seconds*1000),
      endTime: new Date(doc.data().endTime.seconds*1000),
      userId: doc.data().userId,
      court: doc.data().court
    })
  });
  allBookings.value = result
}

export async function getBookings() {
  const db = getFirestore()
  const bookingRef = collection(db, "bookings")
  const querySnapshot  = await getDocs(bookingRef)
  const result:booking[] = []
  querySnapshot.forEach((doc) => {
    result.push({
      startTime: new Date(doc.data().startTime.seconds*1000),
      endTime: new Date(doc.data().endTime.seconds*1000),
      userId: doc.data().userId,
      court: doc.data().court
    })
  });
  return result
}

export function getBookingsByDate(date:Date) {
  const result:booking[] = []
  const allBookings = useAllBookings()

  allBookings.value.forEach(booking => {
    const bookingDate = new Date(booking.startTime)
    bookingDate.setHours(0,0,0,0)
    if (bookingDate.getTime() === date.getTime()) {
      result.push({...booking})
    }
  })
  return result
}