import { IPreferencesRepository } from '../../domain/repositories/IPreferencesRepository'
import { Preferences } from '../../domain/entities/Preferences'

export class SaveProfileUseCase {
  constructor(private readonly prefsRepo: IPreferencesRepository) {}

  async execute(userId: string, prefs: Preferences) {
    await this.prefsRepo.save(userId, prefs)
    return prefs
  }
}