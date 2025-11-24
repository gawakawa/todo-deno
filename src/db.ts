import type { Todo } from "./types.ts";

const DB_NAME = "TodoDB";
const DB_VERSION = 1;
const STORE_NAME = "todos";

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };
  });
};

export const addTodo = async (title: string): Promise<number> => {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const newTodo: Omit<Todo, "id"> = {
      title,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const request = store.add(newTodo);

    request.onsuccess = () => {
      db.close();
      resolve(request.result as number);
    };

    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
};

export const getTodos = async (): Promise<Todo[]> => {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const todos = request.result as Todo[];
      todos.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      db.close();
      resolve(todos);
    };

    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
};

export const updateTodo = async (
  id: number,
  updates: Partial<Omit<Todo, "id" | "createdAt">>,
): Promise<void> => {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.openCursor(id);

    request.onsuccess = () => {
      const cursor = request.result;

      if (cursor) {
        const existingTodo = cursor.value as Todo;
        const updatedTodo: Todo = {
          ...existingTodo,
          ...updates,
          updatedAt: new Date(),
        };

        const updateRequest = cursor.update(updatedTodo);

        updateRequest.onsuccess = () => {
          db.close();
          resolve();
        };

        updateRequest.onerror = () => {
          db.close();
          reject(updateRequest.error);
        };
      } else {
        db.close();
        resolve();
      }
    };

    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
};
