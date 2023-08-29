import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, signOut, onAuthStateChanged } from "firebase/auth";

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
  }
}

export const signUserOut = async () => {
  const auth = getAuth()
  try {
    await signOut(auth)
  } catch (err) {
    console.log(err);
  }
}

export const initUser = () =>{
  const auth = getAuth()
  const firebaseUser = useFirebaseUser()
  firebaseUser.value = auth.currentUser
  
  onAuthStateChanged(auth, (user) => {
    firebaseUser.value = user
  })
}
