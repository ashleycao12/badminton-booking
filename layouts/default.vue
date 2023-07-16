<template>
  <div>
    <header>
      <nav class="flex items-center justify-center">
        <img src="logo.jpg" alt="">
        <NuxtLink to="/">{{ $t('home') }}</NuxtLink>
        <NuxtLink to="/account">{{ $t('account') }}</NuxtLink>
      </nav>
    </header>
  </div>
  <div>
    <slot />
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped></style>