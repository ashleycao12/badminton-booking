import { TBooking } from "./useTypes"

export const useFirebaseUser = () => useState("firebaseUser", () => {return {}})
export const useAuthenticated = () => useState("authenticated", () => false)
export const useAllBookings = () => useState("allBookings", () => [] as TBooking[])