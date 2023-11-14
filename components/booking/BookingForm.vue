<template>
  <Popup @closePopup="$emit('closePopup')">
    <form @submit.prevent="handleSubmit">
      <p v-if="showErrMsg" class="text-red-500 italic">{{ $t('please select a time') }}</p>
      
      <!-- Date Selection -->
      <DatePicker class="my-4" v-model="selectedDate" id="date" :format-locale="formatLocale" format="EEEE, dd/MM/yyyy" month-name-format="long" :min-date="new Date()" :max-date="dateOffset(new Date(), maxFutureDays)" :select-text="$t('select')" :cancel-text="$t('cancel')" :enable-time-picker="false"/>
      
      <!-- customer info fields for admin -->
      <div v-if="isAdmin">
        <label class="font-semibold w-full flex items-center gap-1">
          {{ $t('booker') }}: 
          <input required v-model="fullName" type="text" class="border rounded-md my-1 p-1 text-base font-normal text-black flex-grow">
        </label>
        <label class=" font-semibold w-full flex items-center gap-1">
          {{ $t('phone number') }}: 
          <input v-model="phoneNumber" type="text" class="border rounded-md my-1 p-1 text-base font-normal text-black flex-grow">
        </label>
      </div>

      <!-- Duriation selection -->
      <div class="my-4">
        <label for="playingTime" class="font-semibold">{{ $t('playing time') }}:</label>
        <select name="playingTime" v-model="selectedPlayingTime" class="border mx-2 cursor-pointer">
          <option v-for="time in allowedPlayingTime" :value="time">
            <span> {{ Math.floor(time) }} {{ $t('hour') }}</span>
            <span v-if="time % 1 > 0"> 30 {{ $t('minute') }} </span>
          </option>
        </select>
      </div>

        <!-- Start time selection -->
      <p class="font-semibold">{{ $t('start time') }}:</p>
      <div class="grid grid-cols-6 gap-2 my-2">
        <div v-for="hour in validStartHour" @click="handleHourSelection(hour)" class="p-1 bg-slate-200 rounded-sm hover:bg-teal-300 flex justify-center cursor-pointer" :class="getHourStyle(hour)">
          {{Math.floor(hour)}}
          <span v-if="hour % 1 > 0">:30</span>
          <span v-else>:00</span>
        </div>
      </div>
      <button class="px-4 py-1 bg-cyan-600 text-white font-semibold text-lg rounded-sm float-right">{{$t('book')}}</button>
    </form>
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
  const selectedDate = useSelectedDate()
  const selectedHour = ref(0)
  const defaultCourt = ref(new Map())
  const allStartHour = getAllStartHour()
  const validStartHour = ref<number[]>([])
  const bookings = ref([])
  const selectedPlayingTime = ref(1)
  const allowedPlayingTime = [1, 1.5, 2, 2.5, 3, 3.5, 4]
  const showErrMsg = ref(false)
  const isAdmin = useIsAdmin()
  const fullName = ref('')
  const phoneNumber = ref('')
  const phoneNumberObj = useUserPhoneNumberObj()
  const localePath = useLocalePath()
  const emit = defineEmits(['closePopup'])
  
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
      //If chosen date is today, filter out the passed hours. User has to book at least 1 hour ahead
      const thisMoment = new Date()
      if (isSameDate(selectedDate.value, thisMoment) && getDateTime(thisMoment, startHour- minHourBeforeBook).getTime() < thisMoment.getTime()){
        continue
      }

      const endHour = startHour+selectedPlayingTime.value
      const startTime = getDateTime(selectedDate.value, startHour)
      const endTime = getDateTime(selectedDate.value, endHour)
      const endOfDay = getDateTime(selectedDate.value, closingTime)
      
      //game has to end before court close
      if (endTime.getTime() > endOfDay.getTime()) {
        continue
      }

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

    if (isAdmin.value) {
      await addBooking({
      startTime: getDateTime(selectedDate.value, selectedHour.value),
      endTime: getDateTime(selectedDate.value, selectedHour.value + selectedPlayingTime.value),
      court: defaultCourt.value.get(selectedHour.value),
      userId: 'added by admin',
      userFullName:fullName.value,
      userPhoneNumber: phoneNumber.value,
      createdAt: new Date()
      })
      emit('closePopup')
      return
    }

    const userPhoneNumber = phoneNumberObj.value.phoneNumber
    //TODO ask for confirmation after adding booking
    await addBooking({
      startTime: getDateTime(selectedDate.value, selectedHour.value),
      endTime: getDateTime(selectedDate.value, selectedHour.value + selectedPlayingTime.value),
      court: defaultCourt.value.get(selectedHour.value),
      userId: firebaseUser.value.uid,
      userFullName:firebaseUser.value.displayName,
      userPhoneNumber: userPhoneNumber,
      createdAt: new Date()
    });
    navigateTo(localePath('/booking/mybookings'))
  }

  function handleHourSelection(hour:number) {
    selectedHour.value = hour
  }

  function getHourStyle(hour:number){
    if (hour === selectedHour.value){
      return "bg-teal-400"
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

  onMounted(async () => {
    await initUserPhoneNumber()
  })

  function getFormatLocale() {
    return locale.value === 'vi-VN' ? vi : enNZ
  }

</script>

<style scoped>

</style>