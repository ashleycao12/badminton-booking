<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" :class="getZ()">
    <div class="bg-white p-10 relative md:max-w-2xl mx-2">
      <slot></slot>
      <button @click="$emit('closePopup')" class="absolute top-0 right-0 p-1">&#10006;</button>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{z?: number}>()

  function getZ(){
    if (props.z){
      return `z-${props.z}`
    } else {
      return "z-50"
    }
  }

</script>

<style lang="scss" scoped>

</style>