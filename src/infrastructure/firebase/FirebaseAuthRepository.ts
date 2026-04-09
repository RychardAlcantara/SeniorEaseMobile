import {
  signInWithEmailAndPassword,
  onAuthStateChanged as firebaseAuthChanged,
  reauthenticateWithCredential,
  updatePassword,
  updateProfile,
  createUserWithEmailAndPassword,
  signOut,
  EmailAuthProvider,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { auth } from './config'
import { IAuthRepository } from '../../domain/repositories/IAuthRepository'
import { User } from '../../domain/entities/User'

const toUser = (u: any): User => ({
  id: u.uid,
  email: u.email!,
  name: u.displayName ?? undefined,
})

export class FirebaseAuthRepository implements IAuthRepository {
  async signIn(email: string, password: string): Promise<{ success: boolean; data?: User; error?: string }> {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password)
      return {
        success: true,
        data: {
          id: user.uid,
          email: user.email!,
          name: user.displayName ?? '',
          photoURL: user.photoURL,
        },
      }
    } catch (e: any) {
      return { success: false, error: this.mapError(e.code) }
    }
  }

  async signUp(email: string, password: string, name: string): Promise<{ success: boolean; data?: User; error?: string }> {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(user, { displayName: name })
      return {
        success: true,
        data: { id: user.uid, email: user.email!, name, photoURL: null },
      }
    } catch (e: any) {
      return { success: false, error: this.mapError(e.code) }
    }
  }

  async signOut(): Promise<void> {
    await signOut(auth)
  }

  async updateProfile(name: string, photoURL?: string | null): Promise<{ success: boolean; error?: string }> {
    try {
      const user = auth.currentUser
      if (!user) return { success: false, error: 'Usuário não autenticado.' }
      await updateProfile(user, { displayName: name, photoURL: photoURL ?? user.photoURL })
      return { success: true }
    } catch (e: any) {
      return { success: false, error: e.message ?? 'Erro ao atualizar perfil.' }
    }
  }

  async updatePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const user = auth.currentUser
      if (!user || !user.email) return { success: false, error: 'Usuário não autenticado.' }
      const credential = EmailAuthProvider.credential(user.email, currentPassword)
      await reauthenticateWithCredential(user, credential)
      await updatePassword(user, newPassword)
      return { success: true }
    } catch (e: any) {
      return { success: false, error: this.mapError(e.code) }
    }
  }

  async forgotPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      await sendPasswordResetEmail(auth, email)
      return { success: true }
    } catch (e: any) {
      return { success: false, error: this.mapError(e.code) }
    }
  }

  getCurrentUser(): User | null {
    const user = auth.currentUser
    if (!user) return null
    return {
      id: user.uid,
      email: user.email!,
      name: user.displayName ?? '',
      photoURL: user.photoURL,
    }
  }

  onAuthStateChanged(callback: (user: User | null) => void) {
    return firebaseAuthChanged(auth, (u) => callback(u ? toUser(u) : null))
  }

  private mapError(code: string): string {
    const map: Record<string, string> = {
      'auth/user-not-found': 'Usuário não encontrado.',
      'auth/wrong-password': 'Senha incorreta.',
      'auth/invalid-email': 'E-mail inválido.',
      'auth/too-many-requests': 'Muitas tentativas. Tente mais tarde.',
    }
    return map[code] ?? 'Erro ao entrar. Tente novamente.'
  }
}