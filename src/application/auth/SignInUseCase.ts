import { IAuthRepository } from '../../domain/repositories/IAuthRepository'

export class SignInUseCase {
  constructor(private readonly authRepo: IAuthRepository) {}

  async execute(email: string, password: string) {
    if (!email || !password) {
      return { success: false, error: 'Preencha e-mail e senha.' }
    }
    return this.authRepo.signIn(email.trim().toLowerCase(), password)
  }
}