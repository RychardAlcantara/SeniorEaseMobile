import { User } from '../entities/User'

export interface IAuthRepository {
  signIn(email: string, password: string): Promise<{ success: boolean; data?: User; error?: string }>
  signUp(email: string, password: string, name: string): Promise<{ success: boolean; data?: User; error?: string }>
  signOut(): Promise<void>
  updateProfile(name: string, photoURL?: string | null): Promise<{ success: boolean; error?: string }>
  updatePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }>
  getCurrentUser(): User | null
  onAuthStateChanged(callback: (user: User | null) => void): () => void
  forgotPassword(email: string): Promise<{ success: boolean; error?: string }>
}