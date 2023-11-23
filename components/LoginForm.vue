<template>
  <!-------------------------- SIGN UP FORM ----------------------------->
  <div v-if="!authenticated && !existingAccount" class="bg-white lg:w-1/3 mx-auto mt-12 rounded-md shadow-md shadow-gray-200 flex flex-col items-center py-10">
    <form @submit.prevent="handleSignUp" class="w-2/3 border-b-2 pb-5">
      <div class="flex flex-col gap-5">
        <label class="text-sm font-bold "> 
          Email 
          <input required type="text" v-model="email" class="border rounded-md block my-1 p-1 w-full text-base font-normal text-black">
        </label>
  
        <label class="text-sm font-bold "> 
          {{$t('password')}} 
          <input required type="password" v-model="password" class="border rounded-md block my-1 p-1 w-full text-base font-normal text-black">
        </label>
  
        <label class="text-sm font-bold "> 
          {{$t('confirm password')}}
          <input required type="password" v-model="confirmPassword" class="border rounded-md block my-1 p-1 w-full text-base font-normal text-black">
        </label>
        
        <label class="text-sm font-bold ">
          {{ $t('full name') }}
          <input required type="text" v-model="fullName" class="border rounded-md block my-1 p-1 w-full text-base font-normal text-black">
        </label>
  
        <label class="text-sm font-bold ">
          {{$t("phone number")}} 
          <input required type="text" v-model="phoneNumber" class="border rounded-md block my-1 p-1 w-full text-base font-normal text-black">
        </label>
      </div>

      <p class="text-red-500 italic text-center text-sm my-2" v-if="authError.code !== ''">{{$t(authError.code)}}</p> 
      
      <div class="flex justify-center">
        <button class="submit bg-cyan-600 text-white py-2 px-4 rounded-full mt-3 w-1/2">{{ $t('sign up') }}</button>
      </div>
    </form>
    
    <!-- check if user want to sign in instead  -->
    <label class="mt-4">
      {{ $t('already had an account') }}?
      <button @click="toggleSignInSignUp" class="border rounded-md px-2 py-1">{{ $t('sign in') }}</button>
    </label>
  </div>

  <!------------------------------- SIGN IN FORM ---------------------------------->
  <div v-if="!authenticated && existingAccount" class="bg-white lg:w-1/3 mx-auto mt-12 rounded-md shadow-md shadow-gray-200 flex flex-col items-center py-8">
    <form @submit.prevent="handleSignIn" class="w-3/4 border-b-2 pb-5">   
      <div class="flex flex-col gap-5">
        <label class="text-sm font-bold "> 
          Email 
          <input required type="text" v-model="email" class="border rounded-md block my-1 p-1 w-full text-base font-normal text-black">
        </label>

        <label class="text-sm font-bold "> 
          {{$t('password')}} 
          <input required type="password" v-model="password" class="border rounded-md block my-1 p-1 w-full text-base font-normal text-black">
        </label>
      </div>

      <p class="text-red-500 italic text-center text-sm my-2" v-if="authError.code !== ''">{{$t(authError.code)}}</p> 

      <div class="flex justify-center">
        <button class="submit bg-cyan-600 text-white py-2 px-4 rounded-full mt-3 w-1/2">{{ $t('sign in') }}</button>
      </div>
    </form>
    
    <!-- check if user want to sign up instead  -->
    <button @click="handleForgotPassword" class="my-5 text-sm underline">{{ $t('forgot password') }}</button>
    <label>
      {{ $t('not yet have an account') }}?
      <button @click="toggleSignInSignUp" class="border rounded-md px-2 py-1">{{ $t('sign up') }}</button>
    </label>
  </div>

  <ForgotPasswordForm v-if="showForgotPasswordForm" @closePopup="showForgotPasswordForm = false"/>

  <!-- Message for newly signed up users -->
  <div v-if="authenticated && !emailVerified" class="bg-white lg:w-1/3 mx-auto mt-12 rounded-md shadow-md shadow-gray-200 flex flex-col items-center p-8">
    <p>
      {{ $t('message for new user') }}
      <span class="font-semibold">{{ email }}.</span>
      {{ $t('message for new user continue') }}
    </p>
  </div>
  
</template>

<script setup lang="ts">
  const firebaseUser = useFirebaseUser()
  const email = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  const fullName = ref('')
  const phoneNumber = ref('')
  const authError = useAuthError()
  const existingAccount = ref(true)
  const emailVerified = ref(false)
  const authenticated = ref(false)
  const showForgotPasswordForm = ref(false)
  const localePath = useLocalePath()

  function handleSignUp(){
    if (password.value.length < 6) {
      authError.value.code =  'password too short'
      return
    }

    if (password.value !== confirmPassword.value) {
      authError.value.code =  'password confirmation mismatch'
      return
    }

    if(fullName.value === '' || fullName.value[0] === ' '||fullName.value[fullName.value.length-1] === ' ' || fullName.value.indexOf(' ') === -1){
      authError.value.code = 'invalid full name'
      return
    }

    if(phoneNumber.value.length < 10) {
      authError.value.code = 'invalid phone number'
      return
    }
    createAccount(email.value, password.value, fullName.value, phoneNumber.value)
    navigateTo(localePath('/booking'))
  }

  async function handleSignIn(){
    const user = await signInWithPassword(email.value, password.value)
    const isAdmin = await getIsAdmin(user)
    if (isAdmin){
      navigateTo(localePath('/admin/booking'))
      return
    }
    if (user?.emailVerified === true) {
      navigateTo(localePath('/booking/mybookings'))
      return
    } 
    if (user?.emailVerified === false) {
      sendNewVerificationEmail()
    }
  }

  function toggleSignInSignUp(){
    existingAccount.value = !existingAccount.value
    authError.value.code =  ''
  }

  function handleForgotPassword(){
    showForgotPasswordForm.value = true
  }

  watch(firebaseUser, () => {
    if (firebaseUser.value === null) {
      authenticated.value = false
      emailVerified.value = false
    } else {
      authenticated.value = true
      emailVerified.value = firebaseUser.value.emailVerified
      email.value = firebaseUser.value.email
    }
  })

</script>

<style scoped>

</style>