<template>
  <div>
    <table class="border">
      <tbody>
        <tr>
          <th></th>
          <th v-for="date in dateList" class="border w-24">
            <p>{{ date.getDate() }}</p>
            <p>{{ getDayName(date, locale) }}</p>
          </th>
        </tr>
        <tr v-for="(hour, hourIndex) in hours" class="border h-10" ref="hourRefs">
          <td class="border" >{{ hour }}:00</td>
          <td v-for="(date, dateIndex) in dateList" class="border relative">
            <div v-if="calendar[dateIndex][hourIndex]" class=" top-0 bg-red-300 absolute" :style="{height: getBookingDivHeight() + 'px'}">
              <p>
                {{calendar[dateIndex][hourIndex].dateTime}}
              </p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
  const {locale} = useI18n()
  const openTime = 7
  const closeTime = 18
  let today = new Date()
  const hours: number[] = getHours()
  
  const calendar = ref(createCalendar(today))
  const dateList = ref(get7dates(today))
  const bookings = ref([{dateTime: new Date(0,0,0,0), userId: ''}])
  const hourRefs = ref([])
  
  function getHours() {
    const hours = []
    for (let i = openTime; i < closeTime; i++) {
      hours.push(i)
    }
    return hours
  }

  function createCalendar () {
    const calendar:any[][] = []

    for (let i = 0; i < 7; i++) {
      calendar.push([])
      for (let h = openTime; h < closeTime; h++) {
        calendar[i].push(null)
      }  
    }
    return calendar
  }

  function populateCalendar () {
    for (const booking of bookings.value) {
      const bookingDate = new Date(booking.dateTime)
      bookingDate.setHours(0,0,0,0)
      
      for (let dateIndex = 0; dateIndex < dateList.value.length; dateIndex++) {
        if (dateList.value[dateIndex].getTime() === bookingDate.getTime()){
          for (let hourIndex = 0; hourIndex < hours.length; hourIndex++){
            if (hours[hourIndex] === booking.dateTime.getHours()){
              calendar.value[dateIndex][hourIndex] = booking
              break;
            }
          }
          break
        }
      }
      
    }
  }

  function getDayName (date, locale) {
    return date.toLocaleDateString(locale, { weekday: 'long' });    
  }
  
  onMounted(async ()=>{
    bookings.value = await getBookings();
    populateCalendar()
    getBookingDivHeight()
  })

  function get7dates (startDate:Date) {
    const date = startDate.getDate()
    const month = startDate.getMonth()
    const year = startDate.getFullYear()
    const dateList = []
    
    for (let i = 0; i < 7; i++) {
      const newDate = new Date (year, month, date + i)
      dateList.push(newDate)    
    }
    return dateList
  }

  function getBookingDivHeight() {
    console.log(hourRefs.value[0].offsetHeight);
    if (hourRefs.value[0]) {
      return hourRefs.value[0].offsetHeight
    } else {return '0'}
  }

</script>

<style scoped>

</style>