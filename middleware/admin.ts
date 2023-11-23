export default defineNuxtRouteMiddleware(async (to, from) => {
  const {$auth} = useNuxtApp()
  const isAdmin = await getIsAdmin($auth?.currentUser)
  if (!isAdmin) {
    return navigateTo('/')
  }
})