import { User } from '../entities/User'

export interface IAuthRepository {
  signIn(email: string, password: string): Promise<{ success: boolean; data?: User; error?: string }>
  signOut(): Promise<void>
  getCurrentUser(): Promise<User | null>
  onAuthStateChanged(callback: (user: User | null) => void): () => void
}