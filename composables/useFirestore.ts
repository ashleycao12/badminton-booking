import {collection, getDocs, addDoc,  getFirestore, doc, deleteDoc, query, where } from "firebase/firestore"
import { useAllBookings } from "./useState"
import { TBooking } from "./useTypes"

export async function initBookings() {
  const allBookings = useAllBookings()
  if (allBookings.value.length !== 0) {
    return
  }
  
  const db = getFirestore()
  const bookingRef = collection(db, "bookings")
  const result:TBooking[] = []
  const today = new Date()
  
  today.setHours(0,0,0,0)
  const q= query(bookingRef, where("startTime", ">=", today))

  try {
    const querySnapshot  = await getDocs(q)
    querySnapshot.forEach((doc) => {
      result.push({
        id: doc.id,
        startTime: new Date(doc.data().startTime.seconds*1000),
        endTime: new Date(doc.data().endTime.seconds*1000),
        userId: doc.data().userId,
        court: doc.data().court,
        createdAt: doc.data().createdAt
      })
    });
    allBookings.value = result
    console.log(allBookings.value);
  } catch (error) {
    console.error("Can't init bookings. Error: ", error)
  }
}

export async function getBookings() {
  const db = getFirestore()
  const bookingRef = collection(db, "bookings")
  const querySnapshot  = await getDocs(bookingRef)
  const result:TBooking[] = []
  querySnapshot.forEach((doc) => {
    result.push({
      id: doc.id,
      startTime: new Date(doc.data().startTime.seconds*1000),
      endTime: new Date(doc.data().endTime.seconds*1000),
      userId: doc.data().userId,
      court: doc.data().court,
      createdAt: doc.data().createdAt
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
  const result:TBooking[] = []
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

export function getCurrentUserBookings(){
  const firebaseUser = useFirebaseUser()
  if (firebaseUser.value === null) {
    return []
  }
  const allBookings = useAllBookings()
  const result = allBookings.value.filter(booking => booking.userId === firebaseUser.value.uid)
  return result
}

export async function addBooking(booking:any){
  const db = getFirestore()
  try {
    const docRef = await addDoc(collection(db, "bookings"), booking)
    booking.id = docRef.id
    addBookingToState(booking)
  } catch (error) {
    console.error("Can't add booking. Error: ", error)
  }
}

export async function deleteBooking(bookingID:string) {
  const db = getFirestore()
  try {
    const bookingRef = doc(db, "bookings", bookingID)
    await deleteDoc(bookingRef)
    removeBookingFromState(bookingID)
  } catch (error) {
    console.error("Can't delete booking. Error: ", error)
  }
}