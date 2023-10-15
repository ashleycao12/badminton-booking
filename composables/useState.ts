import exp from "constants"
import { TBooking } from "./useTypes"

export const useFirebaseUser = () => useState("firebaseUser", () => {return {}})
export const useAuthenticated = () => useState("authenticated", () => false)
export const useAllBookings = () => useState("allBookings", () => [] as TBooking[])

export function addBookingToState(booking:TBooking){
  const allBookings = useAllBookings()
  allBookings.value.push(booking)
}

export function removeBookingFromState(bookingID:string){
  const allBookings = useAllBookings()
  allBookings.value = allBookings.value.filter(booking => booking.id !== bookingID)
}