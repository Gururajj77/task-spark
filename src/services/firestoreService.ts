
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import type { Task, NewTaskFirestore, UpdateTaskFirestore } from '@/types';

const TASKS_COLLECTION = 'tasks';

// Fetch all tasks from Firestore
export const getAllTasks = async (): Promise<Task[]> => {
  const tasksCollectionRef = collection(db, TASKS_COLLECTION);
  // Order by createdAt to maintain a consistent order, newest first or oldest first
  // For this example, let's order by oldest first.
  const q = query(tasksCollectionRef, orderBy('createdAt', 'asc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      title: data.title,
      description: data.description,
      deadline: data.deadline, // Assuming deadline is stored as ISO string
      columnId: data.columnId,
      createdAt: (data.createdAt as Timestamp)?.toDate().toISOString(), // Convert Firestore Timestamp to ISO string
    } as Task;
  });
};

// Add a new task to Firestore
export const addTaskToFirestore = async (taskData: Omit<NewTaskFirestore, 'createdAt'>): Promise<string> => {
  const taskWithTimestamp: NewTaskFirestore = {
    ...taskData,
    createdAt: serverTimestamp(),
  };
  const docRef = await addDoc(collection(db, TASKS_COLLECTION), taskWithTimestamp);
  return docRef.id;
};

// Update an existing task in Firestore
export const updateTaskInFirestore = async (taskId: string, taskData: UpdateTaskFirestore): Promise<void> => {
  const taskDocRef = doc(db, TASKS_COLLECTION, taskId);
  await updateDoc(taskDocRef, taskData);
};

// Delete a task from Firestore
export const deleteTaskFromFirestore = async (taskId: string): Promise<void> => {
  const taskDocRef = doc(db, TASKS_COLLECTION, taskId);
  await deleteDoc(taskDocRef);
};
