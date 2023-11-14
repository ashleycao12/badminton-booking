<template>
  <LoginForm/>
</template>

<script setup lang="ts">
  const firebaseuser = useFirebaseUser()
  watchEffect(()=>{
    if (firebaseuser.value){
      navigateTo('/account')
    }
  })
</script>

<style scoped>

</style>