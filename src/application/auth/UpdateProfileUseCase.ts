import { IAuthRepository } from '../../domain/repositories/IAuthRepository'

export class UpdateProfileUseCase {
  constructor(private readonly authRepo: IAuthRepository) {}

  async execute(name: string, photoURL?: string | null): Promise<{ success: boolean; error?: string }> {
    if (!name.trim()) return { success: false, error: 'Nome é obrigatório.' }

    return this.authRepo.updateProfile(name.trim(), photoURL)
  }
}