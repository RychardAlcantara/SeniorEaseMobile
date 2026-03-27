import { create } from 'zustand'
import { Preferences, defaultPreferences } from '../domain/entities/Preferences'
import { getPreferencesUseCase, updatePreferencesUseCase } from '../shared/di/container'

interface PreferencesStore {
  preferences: Preferences
  isLoading: boolean
  load: (userId: string) => Promise<void>
  update: (userId: string, prefs: Partial<Preferences>) => Promise<void>
}

export const usePreferencesStore = create<PreferencesStore>((set) => ({
  preferences: defaultPreferences,
  isLoading: false,

  load: async (userId) => {
    set({ isLoading: true })
    const prefs = await getPreferencesUseCase.execute(userId)
    set({ preferences: prefs, isLoading: false })
  },

  update: async (userId, prefs) => {
    set({ isLoading: true })
    const updated = await updatePreferencesUseCase.execute(userId, prefs)
    set({ preferences: updated, isLoading: false })
  },
}))