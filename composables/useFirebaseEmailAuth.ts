import { getAuth, sendSignInLinkToEmail, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile, sendEmailVerification } from "firebase/auth";

export const useFirebaseUser = () => useState("firebaseUser", () => {return {}})
export const useAuthError = () => useState('authError', () => {return {code: ''} as any})

export async function createAccount(email:string, password:string, fullName:string, phoneNumber:string){
  const auth = getAuth()
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    updateProfile(auth.currentUser, {
      displayName:fullName
    })
    await sendEmailVerification(auth.currentUser)
    await addUserPhoneNumber(userCredential.user.uid, phoneNumber)
    return userCredential.user
  } 
  catch (error) {
    handleAuthError(error)
  }
}

export async function sendNewVerificationEmail(){
  const auth = getAuth()
  try {
    await sendEmailVerification(auth.currentUser)
  } catch (error) {
    console.log(error);
  }
}

export async function signInWithPassword(email:string, password:string) {
  const auth = getAuth()
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error) {
    handleAuthError(error)
  }
}

export async function updateFullName(fullName:string) {
  const auth = getAuth()
  try {
    await updateProfile(auth.currentUser, {
      displayName:fullName
    })
  } catch(error){
    console.log('Cannot update displayName.', error);
  }
}

export function initUser(){
  const auth = getAuth()
  const firebaseUser = useFirebaseUser()
  firebaseUser.value = auth.currentUser as any
  console.log(firebaseUser.value);
  
  onAuthStateChanged(auth, (user) => {
    firebaseUser.value = user as any
    console.log(firebaseUser.value);
  })
}

export const signUserOut = async () => {
  const auth = getAuth()
  try {
    await signOut(auth)
  } catch (err) {
    console.log(err);
  }
}

function handleAuthError(error:any){
  const authError = useAuthError()
  authError.value = error
  console.log(error);
}