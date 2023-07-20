<template>
  <div class="flex text-lg">
    <div class="flex items-center justify-center">
      <img :src="flagPath" alt="country flag" class="h-6">
    </div>
    <select v-model="language">
      <option v-for="item in locales" 
        :value="typeof item === 'object' ? item.code : item" 
        :key="typeof item === 'object' ? item.code : item">
        {{item.name}}
      </option>
    </select>

  </div>
</template>

<script setup lang="ts">
  const {locales, locale, setLocale} = useI18n();
  const language = computed({
    get: () => locale.value,
    set: (value) => {setLocale(value)}
  });
  const flagPath:string = computed(() => {
    return locale.value === 'vi-VN' ? "vietnam.png" : "united-kingdom.png"
  })
</script>

<style scoped>

</style>