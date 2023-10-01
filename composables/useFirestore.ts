import {collection, getDocs, addDoc,  getFirestore } from "firebase/firestore"
import { useAllBookings } from "./useState"

export async function initBookings() {
  const allBookings = useAllBookings()
  const db = getFirestore()
  const bookingRef = collection(db, "bookings")
  const result:booking[] = []
  
  try {
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
  } catch (error) {
    console.error("Can't init bookings. Error: ", error)
  }
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
  if (date === null){
    return []
  }
  const date2 = new Date(date)
  date2.setHours(0,0,0,0)
  const result:booking[] = []
  const allBookings = useAllBookings()

  allBookings.value.forEach(booking => {
    const bookingDate = new Date(booking.startTime)
    bookingDate.setHours(0,0,0,0)
    if (bookingDate.getTime() === date2.getTime()) {
      result.push({...booking})
    }
  })
  return result
}

export async function addBooking(booking:booking){
  const db = getFirestore()
  try {
    await addDoc(collection(db, "bookings"), booking)
  } catch (error) {
    console.error("Can't add booking. Error: ", error)
  }
}