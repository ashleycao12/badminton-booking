<template>
  <div class="lg:w-1/2 mx-auto pt-16">
    <h1 v-if="currentUserBookings.length === 0" class="text-xl mx-4">{{ $t('no booking message') }}</h1>
    <h1 v-if="currentUserBookings.length > 0" class="text-3xl font-bold mb-8 text-center text-cyan-900">{{ $t('my bookings') }}:</h1>
    <ul class="flex flex-col gap-2">
      <li v-for="(booking, bookingIndex) in currentUserBookings" class="border border-blue-200 py-3 px-6 bg-white flex justify-between">
        <div>
          <h2 class="text-lg font-semibold">{{ booking.startTime.toLocaleString(locale, {weekday: "long", month: "numeric", day: "numeric"}) }}</h2>
            <p class="flex px-2">
              {{ booking.startTime.getHours() }}
              <span v-if="booking.startTime.getMinutes()">:30</span>
              <span v-else>:00</span>
              &nbsp;-
              {{ booking.endTime.getHours() }}
              <span v-if="booking.endTime.getMinutes()">:30</span>
              <span v-else>:00</span>
            </p>
        </div>
          <button @click="handleDelete(booking)" class=" flex flex-col justify-center hover:bg-cyan-600 px-3 rounded-md hover:opacity-100 " :title="$t('cancel')">
            <img src="/bin.png" alt="bin" class="h-8 opacity-70 ">
          </button>
      </li>
    </ul>
  </div>
  <Popup v-if="showDeletePopup">
    <p>{{ $t('delete booking confirmation text') }}</p>
    <div class="border w-2/3 mx-auto py-1 rounded-md border-cyan-600 my-2">
          <h2 class="text-lg font-semibold text-center">{{ bookingToDelete?.startTime.toLocaleString(locale, {weekday: "long", month: "numeric", day: "numeric"}) }}</h2>
            <p class="flex px-2 justify-center">
              {{ bookingToDelete?.startTime.getHours() }}
              <span v-if="bookingToDelete?.startTime.getMinutes()">:30</span>
              <span v-else>:00</span>
              &nbsp;-
              {{ bookingToDelete?.endTime.getHours() }}
              <span v-if="bookingToDelete?.endTime.getMinutes()">:30</span>
              <span v-else>:00</span>
            </p>
        </div>
    <div class="flex justify-around mt-4">
      <button @click="handleDeleteConfirmation(true)" class="bg-cyan-200 hover:bg-cyan-500 px-4 py-1 rounded-sm">{{ $t('yes') }}</button>
      <button @click="handleDeleteConfirmation(false)" class="bg-cyan-200 hover:bg-cyan-500 px-4 py-1 rounded-sm">{{ $t('no') }}</button>
    </div>
  </Popup>

  <Popup v-if="showDeclinePopUp" @closePopup="showDeclinePopUp = false">
    <p>{{ $t('too late to cancel') }}</p>
  </Popup>
</template>

<script setup lang="ts">
  import { TBooking } from '~/composables/useTypes';
  
  const currentUserBookings = ref<TBooking[]>([])
  const {locale} = useI18n()
  const showDeletePopup = ref(false)
  const showDeclinePopUp = ref(false)
  const bookingToDelete = ref<TBooking|null>(null)
  
  function handleDelete(booking:TBooking){
    const thisMoment = new Date()
    if (getDateTime(booking.startTime, booking.startTime.getHours() - minHourBeforeCancel).getTime() < thisMoment.getTime()){
      showDeclinePopUp.value = true
      return
    }
    bookingToDelete.value = booking
    showDeletePopup.value = true
  }
  
  async function handleDeleteConfirmation(confirmed:boolean){
    if (confirmed) {
      await deleteBooking(bookingToDelete.value.id)
    }
    showDeletePopup.value = false
    bookingToDelete.value = null
  }
  
  watchEffect(()=>{
    currentUserBookings.value = getCurrentUserBookings()
    currentUserBookings.value.sort((a:TBooking, b:TBooking) => a.startTime.getTime() - b.startTime.getTime())
  })
  
  onMounted(()=>{
    initBookings()
  })

</script>

<style scoped>

</style>