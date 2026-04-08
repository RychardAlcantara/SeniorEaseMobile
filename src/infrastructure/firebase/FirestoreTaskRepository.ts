import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";

import { db } from "./config";
import { ITaskRepository } from "../../domain/repositories/ITaskRepository";
import Task from "../../domain/entities/Task";

function toISOString(val: any): string | null {
  if (!val) return null;
  if (val instanceof Timestamp) return val.toDate().toISOString();
  if (val instanceof Date) return val.toISOString();
  if (typeof val === "string") return val;
  if (typeof val?.toDate === "function") return val.toDate().toISOString();
  return null;
}

function parseTask(id: string, data: any): Task {
  return {
    ...data,
    id,
    expectedToBeDone: toISOString(data.expectedToBeDone),
    createdAt: toISOString(data.createdAt) ?? new Date().toISOString(),
    concludedAt: toISOString(data.concludedAt),
  } as Task;
}

function serializeTask(task: Task) {
  return {
    ...task,
    expectedToBeDone: task.expectedToBeDone
      ? new Date(task.expectedToBeDone)
      : null,
    createdAt: task.createdAt ? new Date(task.createdAt) : new Date(),
    concludedAt: task.concludedAt ? new Date(task.concludedAt) : null,
  };
}

export class FirestoreTaskRepository implements ITaskRepository {
  private collectionRef = collection(db, "tasks");

  // 🔹 CREATE
  async create(task: Task): Promise<Task> {
    const data = serializeTask(task);

    await setDoc(doc(this.collectionRef, task.id), data);

    return task;
  }

  // 🔹 GET ALL (igual localStorage)
  async getAll(): Promise<Task[]> {
    const snap = await getDocs(this.collectionRef);
    return snap.docs.map((d) => parseTask(d.id, d.data()));
  }

  // 🔹 GET BY USER
  async getByUserId(userId: string): Promise<Task[]> {
    const q = query(
      this.collectionRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
    );

    const snap = await getDocs(q);
    return snap.docs.map((d) => parseTask(d.id, d.data()));
  }

  // 🔹 UPDATE
  async update(task: Task): Promise<Task> {
    const data = serializeTask(task);

    await setDoc(doc(this.collectionRef, task.id), data, {
      merge: true,
    });

    return task;
  }

  // 🔹 DELETE
  async delete(taskId: string): Promise<void> {
    await deleteDoc(doc(this.collectionRef, taskId));
  }

  // 🔹 GET BY ID
  async findById(taskId: string): Promise<Task | null> {
    const snap = await getDoc(doc(this.collectionRef, taskId));
    return snap.exists() ? parseTask(snap.id, snap.data()) : null;
  }

  // 🔹 HISTÓRICO (mantido do seu original)
  async findHistory(userId: string): Promise<Task[]> {
    const q = query(
      this.collectionRef,
      where("userId", "==", userId),
      where("completed", "==", true),
      orderBy("concludedAt", "desc"),
    );

    const snap = await getDocs(q);
    return snap.docs.map((d) => parseTask(d.id, d.data()));
  }
}
