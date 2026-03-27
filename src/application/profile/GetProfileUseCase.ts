import { IAuthRepository } from '../../domain/repositories/IAuthRepository'
import { IPreferencesRepository } from '../../domain/repositories/IPreferencesRepository'

export class GetProfileUseCase {
  constructor(
    private readonly authRepo: IAuthRepository,
    private readonly prefsRepo: IPreferencesRepository
  ) {}

  async execute(userId: string) {
    const [user, preferences] = await Promise.all([
      this.authRepo.getCurrentUser(),
      this.prefsRepo.get(userId),
    ])
    return { user, preferences }
  }
}