<template>
  <div class="bg-slate-200">
    <form @submit.prevent="handleSubmit" class=" mt-24 flex flex-col items-center gap-5 p-5">
      <div>
        <label for="phone-number" id="captcha-holder">{{$t("phone-number")}}: </label>
        <input type="text" id="phone-number" v-model="phoneNumber" required class=" border border-gray-300">
      </div>
      <button id="sign-in-btn" class="submit bg-sky-600 text-white py-2 px-4 rounded-md">{{ $t('sign-in') }}</button>
    </form>

    <form @submit.prevent="handleVerify" class=" mt-24 flex flex-col items-center gap-5 p-5" >
      <p class=" text-sm italic">{{ $t('verification-code-instruction') }}</p>
      <div >
        <label for="code">{{$t("code")}}: </label>
        <input type="number" id="code" v-model="code" required class=" border border-gray-300">
      </div>
      <button id="verify-btn" class="submit bg-sky-600 text-white py-2 px-4 rounded-md" >{{ $t('verify') }}</button>
    </form>
  </div>
  <div>
    <button id="fb-sign-in-btn" class="submit bg-sky-600 text-white py-2 px-4 rounded-md" @click="signUserOut">{{ $t('sign-out') }}</button>
  </div>
</template>

<script setup lang="ts">
  // Disable default layout
  definePageMeta({
    layout: false,
  });

  const phoneNumber = ref('')
  const code = ref(null)
  const phoneNumberSubmitted = ref(false)
  
  function handleSubmit(){
    phoneNumberSubmitted.value = true
    sendCode(phoneNumber.value)
  }
  
  function handleVerify() {
    const user = phoneSignIn(code.value)
    console.log(user);
  }

</script>

<style scoped>

</style>