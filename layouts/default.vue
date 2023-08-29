<template>
  <div>
    <header>
      <div class="flex flex-col md:flex-row items-center md:items-end md:px-10 py-2">
        <img class="w-72" src="/logo.jpg" alt="">
        <div class="grow flex justify-end">
          <nav class="">
            <NuxtLink class="rounded-sm px-2 py-2 md:px-9 md:mx-3 md:text-2xl" :to="localPath('/')">{{ $t('home') }}</NuxtLink>
            <NuxtLink class="rounded-sm px-2 py-2 md:px-9 md:mx-3 md:text-2xl" :to="localPath('/booking')">{{ $t('booking') }}</NuxtLink>
            <NuxtLink class="rounded-sm px-2 py-2 md:px-9 md:mx-3 md:text-2xl" :to="localPath('/contact')">{{ $t('contact') }}</NuxtLink>
            <NuxtLink class="rounded-sm px-2 py-2 md:px-9 md:mx-3 md:text-2xl" :to="localPath('/account')">{{ $t('account') }}</NuxtLink>
          </nav>
        </div>
      </div>
    </header>
  </div>
  <div>
    <slot />
  </div>




</template>

<script setup lang="ts">
  const localPath = useLocalePath()
</script>

<style scoped>
.router-link-exact-active {
  background-color: rgb(226 232 240)
}
</style>