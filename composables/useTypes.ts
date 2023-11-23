export type TBooking = {
  id?: string,
  startTime: Date,
  endTime:Date,
  court:number,
  userId: string,
  userFullName: string,
  userPhoneNumber:string
  expiryDate: Date,
}