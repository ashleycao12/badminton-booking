<template>
  <div class="flex justify-center">
    <div class="bg-cyan-600 mt-4 p-1 rounded-full">
      <button class="px-2 py-1 font-semibold rounded-full mr-1" :class="getButtonClass('calendar')" :disabled="calendarView" @click="calendarView = !calendarView">{{ $t('calendar') }}</button>
      <button class="px-2 py-1 font-semibold rounded-full " :class="getButtonClass('number')" :disabled="!calendarView" @click="calendarView = !calendarView">{{ $t('number') }}</button>
    </div>
  </div>

  <div v-if="calendarView" class="pt-5 flex justify-center flex-col">
    <h1 class="text-center text-lg">{{ $t('total') }}: {{ getBookingsByDate(selectedDate).length }} {{ $t('bookings') }}.</h1>
    <button @click="handleAddBooking" class=" rounded-md border-2 border-cyan-500 bg-white p-1 mx-auto my-4">{{ $t('add booking') }}</button>
    <BookingTimetable @showBookingInfo="showBookingInfo"/>
  </div>

  <div v-if="!calendarView" class="bg-white p-2 mt-6 rounded-lg">
      <h1 class="text-center py-2 text-xl font-bold text-slate-900">{{ $t('number of bookings in the next 2 weeks') }}</h1>
      <p class="italic text-center text-sm">{{ $t('click on the calendar icon to for details') }}</p>

      <div v-for="[date, numberOfBookings] in numberOfBookingsByDateMap" class="px-4 py-2 border border-cyan-600 flex my-1 items-center justify-around">
          <div class="basis-2/5">
            {{ date?.toLocaleDateString(locale, {weekday:'long', month:'numeric', day:'numeric'}) }}:
          </div>
          <div>
            <span class="font-semibold">{{ numberOfBookings }} </span>
            {{ $t('bookings') }}
          </div>
          <button @click="handleCalendarIconClick(date)" class="ml-auto">
            <img src="/calendar.png" alt="calendar" class="h-6 opacity-90">
          </button>
      </div>
  </div>
  
  <!-- Booking info popup -->
  <Popup v-if="showBookingInfoRef" @closePopup="showBookingInfoRef=false" :z=40 >
    <h1 class="text-center text-xl font-bold py-2">{{ $t('booking info') }}</h1>
    <p>
      <span class="font-semibold"> {{$t('booker')}}: </span>
      {{ bookingByDate?.userFullName }}
    </p>
    <p>
      <span class="font-semibold"> {{$t('phone number')}}: </span>
      {{ bookingByDate?.userPhoneNumber }}
    </p>
    <p>
      <span class="font-semibold"> {{$t('date')}}: </span>
      {{ bookingByDate?.startTime.toLocaleDateString(locale, {weekday:'long', month:'numeric', day:'numeric'}) }}
    </p>
    <p class="flex">
      <span class="font-semibold"> {{$t('from')}}: </span>
      {{ bookingByDate?.startTime.getHours() }}           
      <span v-if="bookingByDate?.startTime.getHours() % 1 > 0">:30</span>
      <span v-else>:00</span>
    </p>
    <p class="flex">
      <span class="font-semibold"> {{$t('to')}}: </span>
      {{ bookingByDate?.endTime.getHours() }}           
      <span v-if="bookingByDate?.endTime.getHours() % 1 > 0">:30</span>
      <span v-else>:00</span>
    </p>
    <div class="flex justify-center">
      <button @click="showConfirmationMsg=true" class="bg-cyan-600 text-white font-semibold py-2 px-4 rounded-md mt-3">{{ $t('cancel booking') }}</button>
    </div>
  </Popup>

  <!-- Booking delete confirmation message -->
  <Popup v-if="showConfirmationMsg" @closePopup="showConfirmationMsg = false">
    <p>{{ $t('delete booking confirmation text') }}</p>
    <div class="flex justify-around mt-4">
      <button @click="handleDeleteConfirmation(true)" class="bg-cyan-200 hover:bg-cyan-500 px-4 py-1 rounded-sm">{{ $t('yes') }}</button>
      <button @click="handleDeleteConfirmation(false)" class="bg-cyan-200 hover:bg-cyan-500 px-4 py-1 rounded-sm">{{ $t('no') }}</button>
    </div>
  </Popup>

  <!-- Booking form -->
  <BookingForm v-if="showBookingForm" @closePopup="showBookingForm = false"/>
</template>

<script setup lang="ts">
  import { TBooking } from '~/composables/useTypes';

  definePageMeta({
    layout: 'admin',
    middleware: ['admin']
  })

  const {locale} = useI18n()
  const showBookingInfoRef = ref(false)
  const showConfirmationMsg = ref(false)
  const showBookingForm = ref(false)
  const allBookings = useAllBookings()
  const numberOfBookingsByDateMap = ref(new Map()) 
  const bookingByDate = ref<any>(null)
  const selectedDate = useSelectedDate()
  // variable for calendar vs summary view
  const calendarView = ref(false)

  function showBookingInfo(bookingData:TBooking){
    showBookingInfoRef.value = true
    bookingByDate.value = bookingData
  }

  async function handleDeleteConfirmation(confirmed:boolean){
    if (confirmed) {
      await deleteBooking(bookingByDate.value.id)
      showBookingInfoRef.value = false
    }
    showConfirmationMsg.value = false
  }

  function handleCalendarIconClick(date:Date){
    selectedDate.value = date
    calendarView.value = true
  }

  function handleAddBooking(){
    showBookingForm.value = true
  }

  function getButtonClass(buttonName:string){
    if ((buttonName === 'calendar' && calendarView.value) || (buttonName === 'number' &&  !calendarView.value)){
      return "bg-white"
    }
    return "text-white"
  }

  watchEffect(() => {
    const today = new Date()
    numberOfBookingsByDateMap.value = new Map()
    for (let i = 0; i < 14; i++) {
      const date = dateOffset(today,i)
      const numberOfBookings = allBookings.value.filter(booking => isSameDate(booking.startTime, date)).length
      numberOfBookingsByDateMap.value.set(date, numberOfBookings)
    }
  })

</script>

<style scoped>

</style>