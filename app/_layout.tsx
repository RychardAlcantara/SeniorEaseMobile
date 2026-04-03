import { useEffect } from 'react'
import { Slot, useRouter, useSegments } from 'expo-router'
import { useAuthStore } from '../src/store/authStore'
import { usePreferencesStore } from '../src/store/preferencesStore'
import { ThemeProvider } from '../src/presentation/theme/ThemeProvider'

export default function RootLayout() {
  const { user, isLoading, init } = useAuthStore()
  const loadPrefs = usePreferencesStore((s) => s.load)
  const router   = useRouter()
  const segments = useSegments()

  useEffect(() => {
    const unsub = init()
    return unsub
  }, [])

  useEffect(() => {
    if (user) loadPrefs(user.id)
  }, [user])

  useEffect(() => {
    if (isLoading) return
    const inAuth = segments[0] === '(auth)'
    if (!user && !inAuth) router.replace('/(auth)/login')
    if (user  &&  inAuth) router.replace('/(app)/dashboard')
  }, [user, isLoading])

  return (
    <ThemeProvider>
      <Slot />
    </ThemeProvider>
  )
}