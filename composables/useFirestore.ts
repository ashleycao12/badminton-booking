import {collection, getDocs, addDoc, updateDoc ,  getFirestore, doc, deleteDoc, query, where } from "firebase/firestore"
import { TBooking } from "./useTypes"

export const useAllBookings = () => useState("allBookings", () => [] as TBooking[])

export async function initBookings() {
  //Get all future bookings and add to booking global state
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
  } catch (error) {
    console.error("Can't add booking. Error: ", error)
  }
  //Add booking from state so we don't have to re-fetch the data
  const allBookings = useAllBookings()
  allBookings.value.push(booking)
}

export async function deleteBooking(bookingID:string) {
  const db = getFirestore()
  const bookingRef = doc(db, "bookings", bookingID)
  try {
    await deleteDoc(bookingRef)
  } catch (error) {
    console.error("Can't delete booking. Error: ", error)
  }
  //Remove booking from state so we don't have to re-fetch the data
  const allBookings = useAllBookings()
  allBookings.value = allBookings.value.filter(booking => booking.id !== bookingID)
}

// ****** PHONE NUMBER COLLECTION FUNCTIONS ****** //
export async function addUserPhoneNumber(userId:string, phoneNumber:string){
  const db = getFirestore()
  const doc = {userId: userId, phoneNumber: phoneNumber}
  try {
    await addDoc(collection(db, "userPhoneNumbers"), doc)
  } catch (error) {
    console.error("Can't add phoneNumber. Error: ", error)
  }
}

export async function getUserPhoneNumberObj(userId:string){
  const db = getFirestore()
  const phoneRef = collection(db, "userPhoneNumbers")
  const q = query(phoneRef, where("userId", "==", userId))
  try {
    const querySnapshot = await getDocs(q)
    //We need doc id to update phone number
    return {
      docId: querySnapshot.docs[0].id,
      phoneNumber:querySnapshot.docs[0].data().phoneNumber
    }
  } catch (error) {
    console.error("Can't get phoneNumber. Error: ", error)
  }
}

export async function updatePhoneNumber(docId:string, phoneNumber:string) {
  const db = getFirestore()
  const phoneNumberDocRef = doc(db, "userPhoneNumbers", docId)
  await updateDoc(phoneNumberDocRef, {
    phoneNumber:phoneNumber
  })
}