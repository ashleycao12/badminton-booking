<template>
  <div>
    <header>
      <nav class="flex items-center justify-center">
        <img src="logo.jpg" alt="">
        <NuxtLink to="/">{{ navContent.home }}</NuxtLink>
        <NuxtLink to="/account">{{ navContent.account }}</NuxtLink>
      </nav>
    </header>
  </div>
  <div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import nav from '../content/nav.json'
const route = useRoute()
const lang: string = route.params.lang == '' ? 'eng' : route.params.lang
const navContent: string = nav[lang]
console.log(lang);
</script>

<style scoped></style>