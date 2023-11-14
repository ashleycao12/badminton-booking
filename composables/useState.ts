export const useFirebaseUser = () => useState("firebaseUser", () => null)
export const useIsAdmin = () => useState("IsAdmin", () => false)
export const useAuthError = () => useState('authError', () => {return {code: ''}})

export const useAllBookings = () => useState("allBookings", () => [] as TBooking[])
export const useUserPhoneNumberObj = () => useState('userPhoneNumber', () => {return {docId: '', phoneNumber:''}})

export const useSelectedDate = () => useState('selectedDate', ()=> new Date())