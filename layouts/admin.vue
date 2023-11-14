<template>
  <div class="bg-white border-b">
    <header>
      <div class="flex flex-col md:flex-row items-center md:items-end md:px-10 py-2">
        <img class="w-72" src="/logo.jpg" alt="">
        <div class="grow flex justify-end">
          <nav class="">
            <NuxtLink class="rounded-sm px-2 py-2 md:px-9 md:text-2xl" :to="localePath('/')">{{ $t('home') }}</NuxtLink>
            <NuxtLink class="rounded-sm px-2 py-2 md:px-9 md:text-2xl" :to="localePath('/admin/booking')">{{ $t('manage bookings') }}</NuxtLink>
            <NuxtLink v-if="!authenticated" class="rounded-sm px-2 py-2 md:px-9 md:text-2xl" :to="localePath('/login')">{{ $t('sign in') }}</NuxtLink>
            <NuxtLink v-if="authenticated" class="rounded-sm px-2 py-2 md:px-9 md:text-2xl font-semibold underline" :to="localePath('/account')"> {{ getShortName(firebaseUser?.displayName) }}</NuxtLink>
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
  const firebaseUser = useFirebaseUser()
  const authenticated = ref(false)
  
  watchEffect( () => {
    if (firebaseUser.value === null) {
      authenticated.value = false
    } else {
      authenticated.value = true
    }
    console.log({authenticated: authenticated.value});
  })

  //TODO add loading screen
</script>

<style scoped>
.router-link-exact-active {
  background-color: rgb(94 234 212)
}
</style>