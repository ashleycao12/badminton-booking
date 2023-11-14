import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile, sendEmailVerification, updatePassword, sendPasswordResetEmail } from "firebase/auth";

export async function createAccount(email:string, password:string, fullName:string, phoneNumber:string){
  const auth = getAuth()
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    updateProfile(auth.currentUser, {
      displayName:fullName
    })
    await sendEmailVerification(auth.currentUser)
    await addUserPhoneNumber(userCredential.user.uid, phoneNumber)
    clearError()
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
    clearError()
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

export async function initUser(){
  const auth = getAuth()
  const firebaseUser = useFirebaseUser()
  const isAdmin = useIsAdmin()
  firebaseUser.value = auth.currentUser as any
  console.log(firebaseUser.value);
  
  onAuthStateChanged(auth, async (user) => {
    firebaseUser.value = user as any
    console.log(firebaseUser.value);
    if (user){
      const idTokenResult = await firebaseUser.value.getIdTokenResult()
      if (idTokenResult.claims.admin === true){
        isAdmin.value = true
      }
      console.log('is admin:',  isAdmin.value);
    }
  })
}

// in case we need to know if the user is the admin right after sign-in which getting from state may result in delay
export async function getIsAdmin(user){
  if (!user) {
    return false
  }
  const idTokenResult = await user.getIdTokenResult()
  if (idTokenResult.claims.admin === true) {
    return true
  }
  return false
}

export const signUserOut = async () => {
  const auth = getAuth()
  try {
    await signOut(auth)
  } catch (err) {
    console.log(err);
  }
}

export async function changePassword(newPassword: string){
  const auth = getAuth();
  const user = auth.currentUser;
  try {
    await updatePassword(user, newPassword)
  } catch(error){
    console.log(error);
  }
}

export async function sendFirebasePasswordResetEmail(email:string) {
  const auth = getAuth();
  try {
    await sendPasswordResetEmail(auth, email)
  } catch (error) {
    handleAuthError(error)
  }
}

function handleAuthError(error:any){
  if (handledAuthErrMsgs.includes(error.code)){
    const authError = useAuthError()
    authError.value = error
  }
  console.log(error);
}

// to avoid error state being carried to a new instant
function clearError(){
  const authError = useAuthError()
  authError.value = {code: ''}
}

const handledAuthErrMsgs = [
  'auth/invalid-email',
  'auth/wrong-password',
  'auth/invalid-email',
  'auth/user-not-found'
]