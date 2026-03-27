import { IPreferencesRepository } from '../../domain/repositories/IPreferencesRepository'

export class GetPreferencesUseCase {
  constructor(private readonly prefsRepo: IPreferencesRepository) {}

  async execute(userId: string) {
    return this.prefsRepo.get(userId)
  }
}