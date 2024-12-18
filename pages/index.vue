<template>
  <div class="pb-10">
    <div class="w-full">
      <img class="w-full" src="/pickleball.jpg" alt="badminton court">
    </div>
    <div class=" w-full text-center py-5 text-xl md:text-4xl font-bold text-cyan-900">
      <h2>{{ $t('Welcome to') }}</h2>
      <h2>{{ $t('Phuoc Thien pickeball club') }}</h2>
    </div>
    <div class="bg-white w-5/6 lg:w-1/3 md:px-10 mx-auto rounded-md py-4 px-8 shadow-md text-sm">
      <p class="py-2">
        🏡 
        <span class="font-semibold">{{ $t('address') }}:</span>
        Kp Hòa Phú, phường An Hòa, Tx Trảng Bàng, Tây Ninh
      </p>
      <p class="py-2">
        🏷️ 
        <span class="font-semibold">{{ $t('price') }}:</span>
        Chỉ còn 100.000Đ/{{ $t('hour') }}
      </p>
      <p class="py-2">
        ☎️ 
        <span class="font-semibold">{{ $t('phone number') }}:</span>ogo
        0947 431 666
      </p>
    </div>
    <div class="w-full text-center mt-10">
      <NuxtLink class="bg-cyan-600 text-white font-semibold py-2 px-8 rounded-full text-xl md:text-3xl" :to="localePath('/booking')">{{ $t('booking') }}</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
  const localePath = useLocalePath()
  const isAdmin = useIsAdmin()
  watchEffect(()=>{
    if (isAdmin.value){
      setPageLayout('admin')
    }
  })
</script>

<style scoped></style>