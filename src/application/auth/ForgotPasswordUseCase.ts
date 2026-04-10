import { IAuthRepository } from '../../domain/repositories/IAuthRepository'

export class ForgotPasswordUseCase {
  constructor(private readonly authRepo: IAuthRepository) {}

  async execute(email: string): Promise<{ success: boolean; error?: string }> {
    if (!email.trim()) return { success: false, error: 'Informe seu e-mail.' }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) return { success: false, error: 'Informe um e-mail válido.' }

    return this.authRepo.forgotPassword(email.trim())
  }
}