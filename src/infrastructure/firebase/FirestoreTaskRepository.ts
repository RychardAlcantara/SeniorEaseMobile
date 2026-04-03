import {
  collection, doc, getDocs, getDoc,
  setDoc, deleteDoc, query, where, orderBy,
  Timestamp,
} from 'firebase/firestore'
import { db } from './config'
import { ITaskRepository } from '../../domain/repositories/ITaskRepository'
import { Task } from '../../domain/entities/Task'

function toISOString(val: any): string | null {
  if (!val) return null
  if (val instanceof Timestamp) return val.toDate().toISOString()
  if (val instanceof Date) return val.toISOString()
  if (typeof val === 'string') return val
  if (typeof val?.toDate === 'function') return val.toDate().toISOString()
  return null
}

function parseTask(id: string, data: any): Task {
  return {
    ...data,
    id,
    expectedToBeDone: toISOString(data.expectedToBeDone),
    createdAt: toISOString(data.createdAt) ?? new Date().toISOString(),
    concludedAt: toISOString(data.concludedAt),
  } as Task
}

export class FirestoreTaskRepository implements ITaskRepository {
  async findAll(userId: string): Promise<Task[]> {
    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', userId),
      where('completed', '==', false),
      orderBy('createdAt', 'desc')
    )
    const snap = await getDocs(q)
    return snap.docs.map(d => parseTask(d.id, d.data()))
  }

  async findById(taskId: string): Promise<Task | null> {
    const snap = await getDoc(doc(db, 'tasks', taskId))
    return snap.exists() ? parseTask(snap.id, snap.data()) : null
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
      where('completed', '==', true),
      orderBy('concludedAt', 'desc')
    )
    const snap = await getDocs(q)
    return snap.docs.map(d => parseTask(d.id, d.data()))
  }
}