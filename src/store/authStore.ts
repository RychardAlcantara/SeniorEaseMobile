import { create } from 'zustand'
import { User } from '../domain/entities/User'
import {
  signInUseCase,
  signOutUseCase,
  signUpUseCase,
  updateProfileUseCase,
  updatePasswordUseCase,
  forgotPasswordUseCase,
} from '../shared/di/container'
import { auth } from '../infrastructure/firebase/config'
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'

interface AuthStore {
  user: User | null
  isLoading: boolean
  isInitialized: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (name: string, photoURL?: string | null) => Promise<boolean>
  updatePassword: (current: string, next: string, confirm: string) => Promise<boolean>
  forgotPassword: (email: string) => Promise<boolean>
  clearError: () => void
  init: () => () => void
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  init: () => {
    const unsub = onAuthStateChanged(auth, (u) => {
      set({
        user: u ? { id: u.uid, email: u.email!, name: u.displayName ?? '', photoURL: u.photoURL } : null,
        isLoading: false,
        isInitialized: true,
      })
    })
    return unsub
  },

  clearError: () => set({ error: null }),

  signIn: async (email, password) => {
    if (!email.trim() || !password.trim()) {
      set({ error: 'Preencha e-mail e senha para continuar.' })
      return
    }
    set({ isLoading: true, error: null })
    const result = await signInUseCase.execute(email.trim(), password)
    if (result.success) {
      set({ user: result.data, isLoading: false, error: null })
    } else {
      set({ error: result.error, isLoading: false })
    }
  },

  signUp: async (email, password, name) => {
    set({ isLoading: true, error: null })
    const result = await signUpUseCase.execute(email, password, name)
    if (result.success) {
      set({ user: result.data, isLoading: false, error: null })
    } else {
      set({ error: result.error, isLoading: false })
    }
  },

  signOut: async () => {
    set({ isLoading: true })
    await firebaseSignOut(auth)
    await signOutUseCase.execute()
    set({ user: null, isLoading: false, error: null, isInitialized: true })
  },

  updateProfile: async (name, photoURL) => {
    set({ isLoading: true, error: null })
    const result = await updateProfileUseCase.execute(name, photoURL)
    if (result.success) {
      const current = get().user
      set({
        user: current ? { ...current, name, photoURL: photoURL ?? current.photoURL } : null,
        isLoading: false,
      })
      return true
    } else {
      set({ error: result.error, isLoading: false })
      return false
    }
  },

  updatePassword: async (current, next, confirm) => {
    set({ isLoading: true, error: null })
    const result = await updatePasswordUseCase.execute(current, next, confirm)
    if (result.success) {
      set({ isLoading: false })
      return true
    } else {
      set({ error: result.error, isLoading: false })
      return false
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null })
    const result = await forgotPasswordUseCase.execute(email)
    if (result.success) {
      set({ isLoading: false })
      return true
    } else {
      set({ error: result.error, isLoading: false })
      return false
    }
  },
}))