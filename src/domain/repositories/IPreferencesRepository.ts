import { Preferences } from '../entities/Preferences'

export interface IPreferencesRepository {
  get(userId: string): Promise<Preferences>
  save(userId: string, prefs: Preferences): Promise<void>
}