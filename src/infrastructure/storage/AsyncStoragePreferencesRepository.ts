import AsyncStorage from '@react-native-async-storage/async-storage'
import { IPreferencesRepository } from '../../domain/repositories/IPreferencesRepository'
import { Preferences, defaultPreferences } from '../../domain/entities/Preferences'

const KEY = (id: string) => `prefs:${id}`

export class AsyncStoragePreferencesRepository implements IPreferencesRepository {
  async get(userId: string): Promise<Preferences> {
    const raw = await AsyncStorage.getItem(KEY(userId))
    return raw ? JSON.parse(raw) : defaultPreferences
  }

  async save(userId: string, prefs: Preferences): Promise<void> {
    await AsyncStorage.setItem(KEY(userId), JSON.stringify(prefs))
  }
}