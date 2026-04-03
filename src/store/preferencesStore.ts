import { create } from 'zustand'
import { Preferences, defaultPreferences } from '../domain/entities/Preferences'
import { getPreferencesUseCase, updatePreferencesUseCase } from '../shared/di/container'

interface PreferencesStore {
  preferences: Preferences
  isLoading: boolean
  load: (userId: string) => Promise<void>
  update: (userId: string, prefs: Partial<Preferences>) => Promise<void>
  preview: (prefs: Partial<Preferences>) => void
}

export const usePreferencesStore = create<PreferencesStore>((set, get) => ({
  preferences: defaultPreferences,
  isLoading: false,

  load: async (userId) => {
    set({ isLoading: true })
    try {
      const prefs = await getPreferencesUseCase.execute(userId)
      set({ preferences: prefs, isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },

  update: async (userId, prefs) => {
    set({ isLoading: true })
    try {
      const updated = await updatePreferencesUseCase.execute(userId, prefs)
      set({ preferences: updated, isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },

  preview: (prefs) => {
    set({ preferences: { ...get().preferences, ...prefs } })
  },
}))