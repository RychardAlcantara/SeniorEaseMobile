import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseAuthChanged,
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
  async signIn(email: string, password: string) {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password)
      return { success: true, data: toUser(user) }
    } catch (err: any) {
      return { success: false, error: this.parseError(err.code) }
    }
  }

  async signOut() {
    await firebaseSignOut(auth)
  }

  async getCurrentUser(): Promise<User | null> {
    const u = auth.currentUser
    return u ? toUser(u) : null
  }

  onAuthStateChanged(callback: (user: User | null) => void) {
    return firebaseAuthChanged(auth, (u) => callback(u ? toUser(u) : null))
  }

  private parseError(code: string): string {
    const map: Record<string, string> = {
      'auth/user-not-found':    'Usuário não encontrado.',
      'auth/wrong-password':    'Senha incorreta.',
      'auth/invalid-email':     'E-mail inválido.',
      'auth/too-many-requests': 'Muitas tentativas. Tente mais tarde.',
    }
    return map[code] ?? 'Erro ao entrar. Tente novamente.'
  }
}