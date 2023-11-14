<template>
  <Popup @closePopup="$emit('closePopup')">
    <form v-if="!changePasswordDone" @submit.prevent="handleSubmit">   
      <div class="">
        <label class="text-sm font-bold w-full"> 
          {{$t('new password')}} 
          <input required type="password" v-model="newPassword" class="border rounded-md my-1 p-1 w-full text-base font-normal text-black ">
        </label>
        
        <label class="text-sm font-bold "> 
          {{$t('confirm password')}} 
          <input required type="password" v-model="confirmPassword" class="border rounded-md block my-1 p-1 w-full text-base font-normal text-black">
        </label>
      </div>

      <p class="text-red-500 italic text-center text-sm my-2" v-if="authError.code !== ''">{{$t(authError.code)}}</p> 

      <div class="flex justify-center">
        <button class="submit bg-cyan-600 text-white py-2 px-4 rounded-full mt-3 w-1/2">OK</button>
      </div>
    </form>
    <p v-if="changePasswordDone">{{ $t('Password has been successfully changed') }}</p>
  </Popup>

</template>

<script setup lang="ts">
  const newPassword = ref('')
  const confirmPassword = ref('')
  const authError = useAuthError()
  const changePasswordDone = ref(false)

  async function handleSubmit(){
    if (newPassword.value.length < 6) {
      authError.value.code =  'password too short'
      return
    }

    if (newPassword.value !== confirmPassword.value) {
      authError.value.code =  'password confirmation mismatch'
      return
    }

    await changePassword(newPassword.value)
    changePasswordDone.value = true
  }
</script>

<style scoped>

</style>