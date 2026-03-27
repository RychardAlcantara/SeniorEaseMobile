import { IAuthRepository } from '../../domain/repositories/IAuthRepository'

export class SignOutUseCase {
  constructor(private readonly authRepo: IAuthRepository) {}

  async execute() {
    await this.authRepo.signOut()
  }
}