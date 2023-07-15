<template>
  <div>
    <header>
      <nav class="flex items-center justify-center">
        <img src="logo.jpg" alt="">
        <NuxtLink to="/">Home</NuxtLink>
        <NuxtLink to="/account">My account</NuxtLink>
      </nav>
    </header>
  </div>
  <div>
    <slot />
  </div>
</template>

<script setup>

</script>

<style scoped></style>