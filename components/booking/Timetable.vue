<template>
  <div>
    <div class="flex flex-row justify-center gap-2">
        <button @click="changeDate(-1)" :disabled="isSameDate(date, new Date())"> ◀ </button>
        <div class="text-center bg-white border px-2 py-1">{{ date.toLocaleDateString(locale, {weekday:'long', month:'numeric', day:'numeric'}) }}</div>
        <button @click="changeDate(1)"> ▶ </button>
    </div>

    <table class="border border-gray-400 bg-white mx-auto">
        <tbody>
          <tr>
            <th class=" border border-gray-400"></th>
            <th v-for="court in courts" class=" w-24">
              <p class="text-gray-600 font-semibold text-sm">{{$t('court')}} {{court}}</p>
            </th>
          </tr>
          <tr v-for="hour in hours" class="h-10" ref="hourRefs">
            <td class="px-3 block leading-none text-sm font-semibold text-gray-700 border-none" > {{ hour }}:00 </td>
            <td v-for="court in courts" class="border relative border-gray-400" :class="getCellColour(hour)">
              <!-- booking render for non-admin -->
              <div v-if="bookingMap.has(key(hour, court)) && !isAdmin" class=" w-full absolute left-0 border-y" :class="getBookingColourClass(bookingMap.get(key(hour,court)))" :style="getBookingDivStyle(bookingMap.get(key(hour, court)))">
                &nbsp;
              </div>
              
              <!-- booking render for admin -->
              <div v-if="bookingMap.has(key(hour, court)) && isAdmin" @click="$emit('showBookingInfo', bookingMap.get(key(hour, court)))" class=" w-full absolute left-0 border-y bg-cyan-500 text-black flex items-center justify-center text-sm cursor-pointer" :style="getBookingDivStyle(bookingMap.get(key(hour, court)))">
              {{ getShortName(bookingMap.get(key(hour, court)).userFullName) }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
  </div>
</template>

<script setup lang="ts">
  const {locale} = useI18n()
  const hours: number[] = getHours()  
  const date = useSelectedDate()
  const bookingMap = ref(new Map())
  const bookings = ref([{startTime: new Date(0,0,0,0), endTime:new Date(0,0,0,0), userId: ''}])
  const hourRefs = ref([])
  const firebaseUser = useFirebaseUser()
  const isAdmin = useIsAdmin()

  const props = defineProps<{initalDate?:Date}>()

  watchEffect(async ()=>{
    bookings.value = getBookingsByDate(date.value);
    populateBookingMap()
  })

  onMounted(()=>{
    initBookings()
    console.log(bookings.value);
    if (props.initalDate){
      date.value = props.initalDate
    }
  })

  function changeDate(changeValue:number) {
    const d = date.value.getDate() + changeValue
    const m = date.value.getMonth()
    const y = date.value.getFullYear()
    date.value = new Date(y,m,d)
  }

  function getHours() {
    const hours = []
    for (let i = openingTime; i < closingTime; i++) {
      hours.push(i)
    }
    return hours
  }

  function getBookingDivStyle(booking) {
    const bookingLengthInHours = (booking.endTime.getTime() - booking.startTime.getTime())/3600000
    let height = 0
    if (hourRefs.value[0]) {
      height = hourRefs.value[0].offsetHeight * bookingLengthInHours
    }

    const top = height * booking.startTime.getMinutes()/60
    return {
      height: `${height}px`,
      top: `${top}px`,
    }
  }

  function populateBookingMap () {
    bookingMap.value = new Map ()
    
    for (const booking of bookings.value) {
    // use the start time and court number as key for the bookingMap. Convert the array to string for value type key
    const hour = booking.startTime.getHours()
    bookingMap.value.set(key(hour, booking.court), booking)
    }
  }

  function getCellColour(hour:number){
    const thisMoment = new Date()
    if (!isSameDate(date.value, thisMoment)){
      return ""
    }
    
    const momentFromHour = new Date()
    momentFromHour.setHours(hour,0,0,0)
    if (momentFromHour.getTime() < thisMoment.getTime()){
      return "bg-gray-300 border-gray-400"
    }

    return ""
  }

  function getBookingColourClass (booking) {
    if (firebaseUser.value === null)
    return ""

    if (booking.userId === firebaseUser.value.uid){
      return "bg-cyan-500"
    }
    return "bg-red-300"
  }
  
  //function to stringify hour and court number as key for bookingMap because array is reference type
  function key(hour:number, court:number){
    return JSON.stringify([hour, court])
  }


</script>

<style scoped>

</style>