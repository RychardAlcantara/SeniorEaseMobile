import { IAuthRepository } from '../../domain/repositories/IAuthRepository'

export class UpdatePasswordUseCase {
  constructor(private readonly authRepo: IAuthRepository) {}

  async execute(currentPassword: string, newPassword: string, confirmPassword: string): Promise<{ success: boolean; error?: string }> {
    if (!currentPassword)              return { success: false, error: 'Informe a senha atual.' }
    if (newPassword.length < 6)        return { success: false, error: 'A nova senha deve ter no mínimo 6 caracteres.' }
    if (newPassword !== confirmPassword) return { success: false, error: 'As senhas não coincidem.' }

    return this.authRepo.updatePassword(currentPassword, newPassword)
  }
}