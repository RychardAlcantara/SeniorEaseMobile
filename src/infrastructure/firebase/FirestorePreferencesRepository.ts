import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './config'
import { IPreferencesRepository } from '../../domain/repositories/IPreferencesRepository'
import { Preferences, defaultPreferences } from '../../domain/entities/Preferences'

export class FirestorePreferencesRepository implements IPreferencesRepository {
  async get(userId: string): Promise<Preferences> {
    const snap = await getDoc(doc(db, 'preferences', userId))
    return snap.exists() ? (snap.data() as Preferences) : defaultPreferences
  }

  async save(userId: string, prefs: Preferences): Promise<void> {
    await setDoc(doc(db, 'preferences', userId), prefs, { merge: true })
  }
}