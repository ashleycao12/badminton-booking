<template>
  <LoginForm/>
</template>

<script setup lang="ts">
  const firebaseuser = useFirebaseUser()
  watchEffect(()=>{
    if (firebaseuser.value){
      const localePath = useLocalePath()
      navigateTo(localePath('/account'))
    }
  })
</script>

<style scoped>

</style>