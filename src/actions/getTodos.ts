import type { Todo } from "../types/Todo.ts";
import { STORE_NAME } from "./const.ts";
import { initDB } from "./initDB.ts";

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
