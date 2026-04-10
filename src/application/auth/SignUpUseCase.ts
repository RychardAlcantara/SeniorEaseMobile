import { IAuthRepository } from '../../domain/repositories/IAuthRepository'
import { User } from '../../domain/entities/User'

export class SignUpUseCase {
  constructor(private readonly authRepo: IAuthRepository) {}

  async execute(email: string, password: string, name: string): Promise<{ success: boolean; data?: User; error?: string }> {
    if (!name.trim())        return { success: false, error: 'Nome é obrigatório.' }
    if (!email.trim())       return { success: false, error: 'E-mail é obrigatório.' }
    if (password.length < 6) return { success: false, error: 'A senha deve ter no mínimo 6 caracteres.' }

    return this.authRepo.signUp(email.trim(), password, name.trim())
  }
}