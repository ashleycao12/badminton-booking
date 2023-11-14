export function isSameDate(date1:Date, date2:Date){
  //Date is reference so need to create new variables
  const newDate1 = new Date(date1)
  const newDate2 = new Date(date2)
  newDate1.setHours(0,0,0,0)
  newDate2.setHours(0,0,0,0)
  return newDate1.getTime() === newDate2.getTime()
}

export function dateOffset(date:Date, dateOffsetNumber:number){
  const newDate = new Date(date)
  const d = newDate.getDate() + dateOffsetNumber
  const m = newDate.getMonth()
  const y = newDate.getFullYear()

  return new Date(y,m,d)
}

export function getDateTime(date:Date, hour:number){
  const result = new Date(date)
  result.setHours(0,hour*60,0,0)
  return result
}