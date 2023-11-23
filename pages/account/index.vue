<template> 
  <div class="bg-white lg:w-1/3 mx-3 lg:mx-auto mt-12 rounded-md shadow-md shadow-gray-200 flex flex-col items-center py-10">
    <h1 class=" text-lg font-bold mb-4">{{ $t('account info') }}</h1>
    <form @submit.prevent="" class="w-2/3 border-b-2 pb-5">
      <div class="flex flex-col gap-5">
        <label class="text-sm font-bold ">
          Email
          <p class="my-1 w-full text-base font-normal text-black">{{ email }}</p>
        </label>
        <label class="text-sm font-bold "> 
          {{ $t('full name') }} 
          <input required type="text" v-model="fullName" id="fullName" class="border rounded-md block my-1 p-1 w-full text-base font-normal text-black" :disabled="!editting">
        </label>
        <label class="text-sm font-bold "> 
          {{ $t('phone number') }} 
          <input required type="text" v-model="phoneNumber" class="border rounded-md block my-1 p-1 w-full text-base font-normal text-black" :disabled="!editting">
        </label>
      </div>
    </form>
    <div class="w-2/3 grid gap-3 mt-5">
      <button v-if="!editting" @click="handleEditClick" class="hover:bg-cyan-600 border-2 border-cyan-600 hover:text-white py-1 font-semibold px-2 rounded-full text-sm">{{ $t('edit details') }}</button>
      <button v-if="!editting" @click="showChangePasswordForm = true" class="hover:bg-cyan-600 border-2 border-cyan-600 hover:text-white py-1 font-semibold px-2 rounded-full text-sm">{{ $t('change password') }}</button>
      <button v-if="!editting" class="hover:bg-cyan-600 border-2 border-cyan-600 hover:text-white py-1 font-semibold px-2 rounded-full text-sm" @click="signOut">{{ $t('sign out') }}</button>
    </div>
    <div class="flex gap-2">
      <button v-if="editting" class="hover:bg-cyan-600 border-2 border-cyan-600 hover:text-white py-1 font-semibold px-2 rounded-full text-sm" @click="handleSubmitChanges">OK</button>
      <button v-if="editting" @click="handleCancel" class="hover:bg-cyan-600 border-2 border-cyan-600 hover:text-white py-1 font-semibold px-2 rounded-full text-sm">{{ $t('cancel') }}</button>
    </div>
  </div>

  <ChangePasswordForm v-if="showChangePasswordForm" @closePopup="showChangePasswordForm = false"/>
</template>

<script setup lang="ts">
  const editting = ref(false)
  const firebaseUser = useFirebaseUser()
  const email = ref('')
  const fullName = ref('')
  const phoneNumber = ref('')
  const {$firebaseApp} = useNuxtApp()
  const isAdmin = useIsAdmin()
  const showChangePasswordForm = ref(false)
  const localePath = useLocalePath()

  // to compared if phone number changed before update or fetch from firebase
  // const userPhoneNumber = useUserPhoneNumber()

  //to store phoneNumber document id to update it
  const phoneNumberObj = useUserPhoneNumberObj()

  function signOut() {
    signUserOut()
    navigateTo(localePath('/'))
  }

  function handleEditClick(){
    editting.value = true
    // set time out to have a small delay after input is enabled
    setTimeout(() => {
      document.getElementById("fullName")?.focus()
    }, 0);
  }

  async function handleSubmitChanges(){
    if (phoneNumber.value !== phoneNumberObj.value.phoneNumber){
      updatePhoneNumber(phoneNumberObj.value.docId, phoneNumber.value)
    }

    if (fullName.value !== firebaseUser.value.displayName) {
      updateFullName(fullName.value)
    }
    editting.value = false
  }

  function handleCancel(){
    editting.value = false
    email.value = firebaseUser.value.email
    fullName.value = firebaseUser.value.displayName
    phoneNumber.value = phoneNumberObj.value.phoneNumber
  }

  watchEffect(async ()=>{
    // set layout for admin user
    if (isAdmin.value){
      setPageLayout('admin')
    }
    // have to track if firebaseApp is initialised before trying to get phone number
    if (firebaseUser.value && $firebaseApp){
      email.value = firebaseUser.value.email
      fullName.value = firebaseUser.value.displayName
      await initUserPhoneNumber()
      // phoneNumberObj.value = await getUserPhoneNumberObj(firebaseUser.value.uid)
      // userPhoneNumber.value = phoneNumberObj.value.phoneNumber
      phoneNumber.value = phoneNumberObj.value.phoneNumber
    }
  })


</script>

<style scoped>

</style>