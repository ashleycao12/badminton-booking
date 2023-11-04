<template>
  <Popup>
    <form @submit.prevent="handleSubmit" >
      <p v-if="showErrMsg" class="text-red-500 italic">{{ $t('please select a time') }}</p>

        <!-- Date Selection -->
      <DatePicker class="my-4" v-model="selectedDate" id="date" :format-locale="formatLocale" format="dd/MM/yyyy" month-name-format="long" :min-date="new Date()" :max-date="dateOffset(new Date(), maxFutureDays)" :select-text="$t('select')" :cancel-text="$t('cancel')" :enable-time-picker="false"/>

      <!-- Duriation selection -->
      <div class="my-4">
        <label for="playingTime">{{ $t('playing time') }}:</label>
        <select name="playingTime" v-model="selectedPlayingTime" class="border mx-2 cursor-pointer">
          <option v-for="time in allowedPlayingTime" :value="time">
            <span>{{ Math.floor(time) }} {{ $t('hour') }}</span>
            <span v-if="time % 1 > 0"> 30 {{ $t('minute') }} </span>
          </option>
        </select>
      </div>

        <!-- Start time selection -->
      <p>{{ $t('start time') }}:</p>
      <div class="grid grid-cols-6 gap-2 my-2">
        <div v-for="hour in validStartHour" @click="handleHourSelection(hour)" class="p-1 bg-slate-200 text-center hover:bg-slate-400 flex cursor-pointer" :class="getHourStyle(hour)">
          {{Math.floor(hour)}}
          <span v-if="hour % 1 > 0">:30</span>
          <span v-else>:00</span>
        </div>
      </div>
      <button class="px-4 py-1 bg-blue-200 rounded-sm hover:bg-blue-400 float-right">{{$t('book')}}</button>
    </form>
    <button @click="$emit('closePopup')" class="absolute top-0 right-0 p-1">&#10006;</button>
  </Popup>
</template>

<script lang="ts" setup>
  import DatePicker from '@vuepic/vue-datepicker';
  import '@vuepic/vue-datepicker/dist/main.css';
  import {vi, enNZ} from 'date-fns/locale'
  import Moment from 'moment';
  import { extendMoment } from 'moment-range';
  const moment = extendMoment(Moment);
  
  const firebaseUser:any = useFirebaseUser()
  const {locale} = useI18n()
  const formatLocale = getFormatLocale()
  const selectedDate = ref(new Date())
  const selectedHour = ref(0)
  const defaultCourt = ref(new Map())
  const allStartHour = getAllStartHour()
  const validStartHour = ref<number[]>([])
  const bookings = ref([])
  const selectedPlayingTime = ref(1)
  const allowedPlayingTime = [1, 1.5, 2, 2.5, 3, 3.5, 4]
  const showErrMsg = ref(false)
  const localePath = useLocalePath()
  
  function getAllStartHour(){
    const result = []
    for (let hour = openingTime; hour < closingTime; hour++) {
      result.push(hour)
      result.push(hour + 0.5)      
    }
    return result
  }

  function getValidStartTime(){
    const result:number[] = []

    if (selectedDate.value === null) {
      return result
    }

    defaultCourt.value = new Map()

    // Check all 4 courts to there is any available time with the selected length of each given start time options
    for (const startHour of allStartHour){
      const endHour = startHour+selectedPlayingTime.value
      const startTime = getDateTime(selectedDate.value, startHour)
      const endTime = getDateTime(selectedDate.value, endHour)
      const endOfDay = getDateTime(selectedDate.value, closingTime)
      
      //game has to end before court close
      if (endTime.getTime() > endOfDay.getTime()) {
        continue
      }

      //TODO if chosen date is today then filter out the passed hours

      const timeRangeToCheck = moment.range(startTime,endTime)

      courtLoop: for (const court of courts) {
        const bookingsByCourt = bookings.value.filter(booking => booking.court === court)

        for (const booking of bookingsByCourt) {
          const bookingTimeRange = moment.range(booking.startTime, booking.endTime)
          if (timeRangeToCheck.overlaps(bookingTimeRange)){
            continue courtLoop
          }
        }
        result.push(startHour)
        defaultCourt.value.set(startHour, court)
        break
      }
    }
    return result
  }

  async function handleSubmit() {
    if (selectedDate.value === null || selectedHour.value === 0) {
      showErrMsg.value = true
      return
    }

    showErrMsg.value = false
    //TODO ask for confirmation before adding booking
    await addBooking({
      startTime: getDateTime(selectedDate.value, selectedHour.value),
      endTime: getDateTime(selectedDate.value, selectedHour.value + selectedPlayingTime.value),
      court: defaultCourt.value.get(selectedHour.value),
      userId: firebaseUser.value.uid,
      createdAt: new Date()
    });
    navigateTo(localePath('/booking/mybookings'))
  }

  function handleHourSelection(hour:number) {
    selectedHour.value = hour
  }

  function getHourStyle(hour:number){
    if (hour === selectedHour.value){
      return "bg-slate-400"
    }
    return ""
  }

  watch(selectedDate, newDate => {
    bookings.value = getBookingsByDate(newDate)
    validStartHour.value = getValidStartTime()
  }, {immediate: true})

  watch(selectedPlayingTime, () =>{
    validStartHour.value = getValidStartTime()
  })

  const emit = defineEmits(['closePopup'])

  function getFormatLocale() {
    return locale.value === 'vi-VN' ? vi : enNZ
  }

  function getDateTime(date:Date, hour:number){
    const result = new Date(date)
    result.setHours(0,hour*60,0,0)
    return result
  }

</script>

<style scoped>

</style>