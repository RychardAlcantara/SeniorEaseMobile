import { create } from 'zustand'
import { User } from '../domain/entities/User'
import { signInUseCase, signOutUseCase } from '../shared/di/container'
import { auth } from '../infrastructure/firebase/config'
import { onAuthStateChanged } from 'firebase/auth'

interface AuthStore {
  user: User | null
  isLoading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  init: () => () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  error: null,

  init: () => {
    const unsub = onAuthStateChanged(auth, (u) => {
      set({
        user: u ? { id: u.uid, email: u.email! } : null,
        isLoading: false,
      })
    })
    return unsub
  },

  signIn: async (email, password) => {
    set({ isLoading: true, error: null })
    const result = await signInUseCase.execute(email, password)
    if (result.success) {
      set({ user: result.data, isLoading: false })
    } else {
      set({ error: result.error, isLoading: false })
    }
  },

  signOut: async () => {
    await signOutUseCase.execute()
    set({ user: null })
  },
}))