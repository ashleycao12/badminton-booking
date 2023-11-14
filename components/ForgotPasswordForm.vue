<template>
  <Popup @closePopup="$emit('closePopup')">
    <form v-if="!submitted" @submit.prevent="handleSubmit">   
      <p class="text-red-500 italic text-center text-sm my-2" v-if="authError.code !== ''">{{$t(authError.code)}}</p> 
      <div class="">
        <label class="text-sm font-bold w-full"> 
          {{$t('email')}} 
          <input required type="text" v-model="email" class="border rounded-md my-1 p-1 w-full text-base font-normal text-black ">
        </label>
      </div>


      <div class="flex justify-center">
        <button class="submit bg-cyan-600 text-white py-2 px-4 rounded-full mt-3 w-1/2">OK</button>
      </div>
    </form>
    <p v-if="submitted">{{ $t('Reset password email has been sent') }}</p>
  </Popup>

</template>

<script setup lang="ts">
  const email = ref('')
  const authError = useAuthError()
  const submitted = ref(false)

  async function handleSubmit(){
    await sendFirebasePasswordResetEmail(email.value)
    if (authError.value.code !== ''){
      return
    }
    submitted.value = true
  }

  onUnmounted(()=>{
    authError.value = {code:''}
  })

</script>

<style scoped>

</style>