import { IPreferencesRepository } from '../../domain/repositories/IPreferencesRepository'
import { Preferences } from '../../domain/entities/Preferences'

export class UpdatePreferencesUseCase {
  constructor(private readonly prefsRepo: IPreferencesRepository) {}

  async execute(userId: string, prefs: Partial<Preferences>) {
    const current = await this.prefsRepo.get(userId)
    const updated = { ...current, ...prefs }
    await this.prefsRepo.save(userId, updated)
    return updated
  }
}