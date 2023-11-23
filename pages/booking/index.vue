<template>
  <p class="text-center italic my-5 md:my-10">{{ $t('check calendar and press book to add booking') }}</p>
  
  <div class=" flex justify-center flex-col md:flex-row gap-8">
    <div class="px-8 flex flex-col gap-2 mt-2 md:mt-8">
      <button class=" py-2 mb-2 text-xl bg-cyan-700 rounded-md text-white hover:bg-cyan-600" @click="handleBook">{{$t('book')}}</button>

      <!-- timetable legends -->
      <div>
        <div class="w-5 h-5 bg-white inline-block mr-2 border border-gray-400">
          &nbsp;
        </div>
        <span>{{ $t('available time') }}</span>
      </div>
      <div>
        <div class="w-5 h-5 bg-red-300 inline-block mr-2">
          &nbsp;
        </div>
        <span>{{ $t('others bookings') }}</span>
      </div>
      <div>
        <div class="w-5 h-5 bg-cyan-500 inline-block mr-2">
          &nbsp;
        </div>
        <span>{{ $t('my bookings') }}</span>
      </div>
    </div>

    <BookingTimetable class=""/>
    
  </div>

  <BookingForm v-if="showBookingForm" @closePopup="showBookingForm = false"/>

  <UnverifiedEmailAlert v-if="showUnverifiedEmailAlert" @closePopup ="showUnverifiedEmailAlert = false"/>
  <Popup v-if="showNotLoggedInAlert" @closePopup="showNotLoggedInAlert = false">
    {{$t('please sign in to use booking feature')}}
  </Popup>
</template>

<script setup lang="ts">
  const firebaseUser = useFirebaseUser()
  const showBookingForm = ref(false)
  const showUnverifiedEmailAlert = ref(false)
  const showNotLoggedInAlert = ref(false)

  function handleBook() {
    if (firebaseUser.value === null) {
      showNotLoggedInAlert.value = true
      return
    }
    
    if (firebaseUser.value.emailVerified === false){
      showUnverifiedEmailAlert.value = true
      return
    }

    showBookingForm.value = true
  }

</script>

<style scoped>

</style>