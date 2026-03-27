import {
  collection, doc, getDocs, getDoc,
  setDoc, deleteDoc, query, where, orderBy,
} from 'firebase/firestore'
import { db } from './config'
import { ITaskRepository } from '../../domain/repositories/ITaskRepository'
import { Task } from '../../domain/entities/Task'

export class FirestoreTaskRepository implements ITaskRepository {
  async findAll(userId: string): Promise<Task[]> {
    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', userId),
      where('status', '!=', 'done'),
      orderBy('createdAt', 'desc')
    )
    const snap = await getDocs(q)
    return snap.docs.map(d => d.data() as Task)
  }

  async findById(taskId: string): Promise<Task | null> {
    const snap = await getDoc(doc(db, 'tasks', taskId))
    return snap.exists() ? (snap.data() as Task) : null
  }

  async save(task: Task): Promise<void> {
    await setDoc(doc(db, 'tasks', task.id), task, { merge: true })
  }

  async delete(taskId: string): Promise<void> {
    await deleteDoc(doc(db, 'tasks', taskId))
  }

  async findHistory(userId: string): Promise<Task[]> {
    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', userId),
      where('status', '==', 'done'),
      orderBy('completedAt', 'desc')
    )
    const snap = await getDocs(q)
    return snap.docs.map(d => d.data() as Task)
  }
}