import type { Todo } from "../types/Todo.ts";
import { STORE_NAME } from "./const.ts";
import { initDB } from "./initDB.ts";

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
