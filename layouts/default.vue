<template>
  <div>
    <header>
      <nav>
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