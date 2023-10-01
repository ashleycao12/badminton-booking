<template>
  <div class="pt-10 flex justify-center">
    <div>
      <div class="flex flex-row justify-center gap-2">
        <button @click="changeDay(-1)"> ◀ </button>
        <div class="text-center bg-white border px-2 py-1">{{ day.toLocaleDateString(locale, {weekday:'long', month:'numeric', day:'numeric'}) }}</div>
        <button @click="changeDay(1)"> ▶ </button>
      </div>
      <table class="border bg-white">
        <tbody>
          <tr>
            <th class=" border"></th>
            <th v-for="court in courts" class=" w-24">
              <p class="text-gray-600 font-semibold text-sm">{{$t('court')}} {{court}}</p>
            </th>
          </tr>
          <tr v-for="hour in hours" class="h-10" ref="hourRefs">
            <td class="px-3 block leading-none text-sm border-none" > {{ hour }}:00 </td>
            <td v-for="court in courts" class="border relative">
              <div v-if="timetable.has(key(hour, court))" class=" w-full bg-red-300 absolute left-0" :style="getBookingDivStyle(timetable.get(key(hour, court)))">
                &nbsp;
              </div>
            </td>
          </tr>
        </tbody>
      </table>
  </div>
    <div class="p-5 ml-10 hidden lg:inline">
      <button class="px-4 py-2 text-xl bg-blue-200 rounded-sm hover:bg-blue-400" @click="handleBook">{{$t('book')}}</button>
    </div>
  </div>
<BookingForm v-if="showBookingForm" @closeForm="closeBookingForm"/>
</template>

<script setup lang="ts">
  const firebaseUser = useFirebaseUser()
  const {locale} = useI18n()
  const hours: number[] = getHours()  
  const day = ref(new Date())
  const timetable = ref(new Map())
  const bookings = ref([{startTime: new Date(0,0,0,0), endTime:new Date(0,0,0,0), userId: ''}])
  const hourRefs = ref([])
  const showBookingForm = ref(false)
  
  function getHours() {
    const hours = []
    for (let i = openingTime; i < closingTime; i++) {
      hours.push(i)
    }
    return hours
  }

  function changeDay(changeValue:number) {
    const d = day.value.getDate() + changeValue
    const m = day.value.getMonth()
    const y = day.value.getFullYear()
    day.value = new Date(y,m,d)
  }

  function populateTimetable () {
    timetable.value = new Map ()
    
    for (const booking of bookings.value) {
    // use the start time and court number as key for the timetable map. Convert the array to string for value type key
    const hour = booking.startTime.getHours()
    timetable.value.set(key(hour, booking.court), booking)
    }
  }

  function handleBook() {
    if (firebaseUser.value === null) {
      console.log('not login yet');
      return
    } 

    console.log('login');
    showBookingForm.value = true
  }

  function closeBookingForm() {
    showBookingForm.value = false
  }

  watch(day, async newDay => {
    console.log(newDay);
    bookings.value = await getBookingsByDate(newDay);
    console.log(bookings);
    populateTimetable()
  }, {immediate:true})

  function getBookingDivStyle(booking) {
    const bookingLengthInHours = (booking.endTime-booking.startTime)/3600000
    let height = 0
    if (hourRefs.value[0]) {
      height = hourRefs.value[0].offsetHeight * bookingLengthInHours
    }

    const top = height * booking.startTime.getMinutes()/60
    console.log(height, top);
    return {
      height: `${height}px`,
      top: `${top}px`,
    }
  }
  
  //function to stringify hour and court number as key for timetable map because array is reference type
  function key(hour:number, court:number){
    return JSON.stringify([hour, court])
  }

</script>

<style scoped>

</style>