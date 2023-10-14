<template>
  <div class=" bg-white shadow-lg">
    <header>
      <div class="flex flex-col md:flex-row items-center md:items-end md:px-10 py-2">
        <img class="w-72" src="/logo.jpg" alt="">
        <div class="grow flex justify-end">
          <nav class="">
            <NuxtLink class="rounded-sm px-2 py-2 md:px-9 md:mx-3 md:text-2xl" :to="localePath('/')">{{ $t('home') }}</NuxtLink>
            <NuxtLink class="rounded-sm px-2 py-2 md:px-9 md:mx-3 md:text-2xl" :to="localePath('/booking')">{{ $t('booking') }}</NuxtLink>
            
            <NuxtLink v-if="!authenticated" class="rounded-sm px-2 py-2 md:px-9 md:mx-3 md:text-2xl" :to="localePath('/booking/mybookings')">{{ $t('manage bookings') }}</NuxtLink>
            <NuxtLink v-if="authenticated" class="rounded-sm px-2 py-2 md:px-9 md:mx-3 md:text-2xl" :to="localePath('/login')">{{ $t('sign-in') }}</NuxtLink>
            <NuxtLink v-else class="rounded-sm px-2 py-2 md:px-9 md:mx-3 md:text-2xl" :to="localePath('/account')">{{ $t('account') }}</NuxtLink>
          </nav>
        </div>
      </div>
    </header>
  </div>
  <div>
    <slot/>
  </div>

</template>

<script setup lang="ts">
  const localePath = useLocalePath()
  const authenticated = useAuthenticated()
</script>

<style scoped>
.router-link-exact-active {
  background-color: rgb(226 232 240)
}
</style>