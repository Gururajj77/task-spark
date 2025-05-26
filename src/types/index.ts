
import type { FieldValue } from 'firebase/firestore';

// Task data as stored in Firestore and used in the app
export interface Task {
  id: string; // Firestore document ID
  title: string;
  description?: string;
  deadline?: string; // ISO string
  columnId: string; // ID of the column it belongs to ('todo', 'inprogress', 'done')
  createdAt?: string; // ISO string, converted from Firestore Timestamp for client use
}

// Data structure for creating a new task in Firestore
export interface NewTaskFirestore {
  title: string;
  description?: string;
  deadline?: string;
  columnId: string;
  createdAt: FieldValue; // For serverTimestamp()
}

// Data structure for updating an existing task in Firestore
// All fields are optional.
export interface UpdateTaskFirestore {
  title?: string;
  description?: string;
  deadline?: string;
  columnId?: string;
  // createdAt is typically not updated after creation
}

// Defines the static structure of a column (ID and title)
export interface Column {
  id: string;
  title: string;
}

// Client-side representation of a column, including the list of task IDs it contains
export interface ClientColumn extends Column {
  taskIds: string[];
}

// Represents the overall state of the Kanban board on the client-side
export interface BoardState {
  tasks: Record<string, Task>;          // All tasks, keyed by their ID
  columns: Record<string, ClientColumn>; // Columns, keyed by ID, each with its list of task IDs
  columnOrder: string[];                 // Array of column IDs defining their display order
}
