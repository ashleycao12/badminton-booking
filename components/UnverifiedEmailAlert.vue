<template>
  <Popup>
    <h1>{{ $t('unverified email message') }}</h1>
    <div class="flex justify-center">
      <button @click="handleResendEmail" class="submit bg-cyan-600 text-white py-2 px-4 rounded-full mt-3">{{ $t('resend email') }}</button>
    </div>
    <button @click="$emit('closePopup')" class="absolute top-0 right-0 p-1">&#10006;</button>
  </Popup>
</template>

<script setup lang="ts">
  const emit = defineEmits(['closePopup'])
  function handleResendEmail(){
    sendNewVerificationEmail()
    emit('closePopup')
  }

</script>

<style scoped>

</style>