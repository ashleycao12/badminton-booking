export default defineNuxtRouteMiddleware(async (to, from) => {
  const {$auth} = useNuxtApp()
  console.log('middleware current user', $auth?.currentUser);
  const isAdmin = await getIsAdmin($auth?.currentUser)
  console.log('middleware not Admin:', !isAdmin);
  if (!isAdmin) {
    return navigateTo('/')
  }
})