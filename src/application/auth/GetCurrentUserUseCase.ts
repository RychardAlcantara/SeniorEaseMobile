import { IAuthRepository } from '../../domain/repositories/IAuthRepository'

export class GetCurrentUserUseCase {
  constructor(private readonly authRepo: IAuthRepository) {}

  async execute() {
    return this.authRepo.getCurrentUser()
  }
}