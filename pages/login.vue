<template>
  <div class="bg-slate-200">
    <form @submit.prevent="handleSubmit" class=" mt-24 flex flex-col items-center gap-5 p-5">
      <div >
        <label for="phone-number">{{$t("phone-number")}}: </label>
        <input type="text" id="phone-number" v-model="phoneNumber" required class=" border border-gray-300">
      </div>
      <button class="submit bg-sky-600 text-white py-2 px-4 rounded-md" >{{ $t('sign-in') }}</button>
    </form>
  </div>
</template>

<script setup lang="ts">
  // Disable default layout
  definePageMeta({
    layout: false,
  });

  const phoneNumber = ref('')

  // stop letter to be typed into phone number field
  watch(phoneNumber, () => {
    const isNumber = /^\d+$/.test(phoneNumber.value)
    if (!isNumber) {
      phoneNumber.value = phoneNumber.value.slice(0, -1)
    }
  })


  function handleSubmit(){
  console.log('submit');
  }
</script>

<style scoped>

</style>