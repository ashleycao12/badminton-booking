import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, signOut, onAuthStateChanged, updateProfile } from "firebase/auth";

const error = ref(null)

// Phone number sign in
export const sendCode = async (phoneNumber:string) => {
  const auth = getAuth()
  auth.languageCode = 'vi'

  const appVerifier = new RecaptchaVerifier(auth, 'captcha-holder', {
    'size': 'invisible',
  });

  try {
    const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier)
    console.log(confirmation);
    window.confirmation = confirmation;
  } catch (err) {
    console.log(err.message)
  }
}

export const phoneSignIn = async (code) => {
  try {
    const result = await window.confirmation.confirm(code)
    console.log(result);
    return result.user
  } catch (err) {
    console.log(err)
    console.log(err.code === 'auth/invalid-verification-code')
    //TODO add stuff for when code is incorrect
  }
}

export const addUserName = (name:string) => {
  const auth = getAuth()
  try {
    updateProfile(auth.currentUser, {
      displayName:name
    })
  } catch (err) {
    console.log(err);
  }
}
