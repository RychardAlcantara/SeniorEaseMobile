import { useEffect } from 'react'
import { Slot, useRouter, useSegments } from 'expo-router'
import { useAuthStore } from '../src/store/authStore'

export default function RootLayout() {
  const { user, isLoading, init } = useAuthStore()
  const router   = useRouter()
  const segments = useSegments()

  useEffect(() => {
    const unsub = init()
    return unsub
  }, [])

  useEffect(() => {
    if (isLoading) return
    const inAuth = segments[0] === '(auth)'
    if (!user && !inAuth) router.replace('/(auth)/login')
    if (user  &&  inAuth) router.replace('/(app)/dashboard')
  }, [user, isLoading])

  return <Slot />
}