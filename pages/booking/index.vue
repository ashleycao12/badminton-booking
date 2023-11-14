<template>
  <div class="py-10 flex justify-center flex-col md:flex-row">
    <BookingTimetable/>
    
    <div class="px-8 flex flex-col gap-2 mt-10">
      <button class=" py-2 text-xl bg-cyan-700 rounded-md text-white hover:bg-cyan-600 mb-5" @click="handleBook">{{$t('book')}}</button>

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
  </div>

  <BookingForm v-if="showBookingForm" @closePopup="showBookingForm = false"/>

  <UnverifiedEmailAlert v-if="showUnverifiedEmailAlert" @closePopup ="showUnverifiedEmailAlert = false"/>
</template>

<script setup lang="ts">
  const firebaseUser = useFirebaseUser()
  const showBookingForm = ref(false)
  const showUnverifiedEmailAlert = ref(false)

  function handleBook() {
    if (firebaseUser.value === null) {
      console.log('not login yet');
      return
    }
    
    if (firebaseUser.value.emailVerified === false){
      showUnverifiedEmailAlert.value = true
      return
    }

    console.log('have logged in, id: ', firebaseUser.value.uid);
    showBookingForm.value = true
  }

</script>

<style scoped>

</style>