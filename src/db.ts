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
