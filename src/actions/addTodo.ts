import type { Todo } from "../types/Todo.ts";
import { STORE_NAME } from "./const.ts";
import { initDB } from "./initDB.ts";

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
