/// <reference lib="deno.ns" />
import { assertEquals, assertExists, assertInstanceOf } from "jsr:@std/assert";
import { afterEach, describe, it } from "jsr:@std/testing/bdd";
import "npm:fake-indexeddb/auto";
import { addTodo, initDB } from "./db.ts";
import type { Todo } from "./types.ts";

afterEach(async () => {
  await new Promise<void>((resolve) => {
    const request = indexedDB.deleteDatabase("TodoDB");
    request.onsuccess = () => resolve();
    request.onerror = () => resolve();
  });
});

describe("initDB", () => {
  it("データベースとオブジェクトストアが作成される", async () => {
    const db = await initDB();

    assertExists(db);
    assertEquals(db.name, "TodoDB");
    assertEquals(db.objectStoreNames.contains("todos"), true);

    db.close();
  });

  it("オブジェクトストアのキーパスとautoIncrementが正しく設定される", async () => {
    const db = await initDB();

    const transaction = db.transaction(["todos"], "readonly");
    const store = transaction.objectStore("todos");

    assertEquals(store.keyPath, "id");
    assertEquals(store.autoIncrement, true);

    await new Promise<void>((resolve) => {
      transaction.oncomplete = () => {
        db.close();
        resolve();
      };
    });
  });
});

describe("addTodo", () => {
  it("新規Todoが追加され、idが返される", async () => {
    const title = "テストTodo";
    const id = await addTodo(title);

    assertExists(id);
    assertEquals(typeof id, "number");
  });

  it("completedがfalseで初期化される", async () => {
    const db = await initDB();
    const title = "テストTodo";
    const id = await addTodo(title);

    const transaction = db.transaction(["todos"], "readonly");
    const store = transaction.objectStore("todos");
    const request = store.get(id);

    await new Promise<void>((resolve) => {
      request.onsuccess = () => {
        const todo = request.result as Todo;
        assertExists(todo);
        assertEquals(todo.completed, false);
        resolve();
      };
      transaction.oncomplete = () => {
        db.close();
      };
    });
  });

  it("createdAtとupdatedAtがDate型で設定される", async () => {
    const db = await initDB();
    const title = "テストTodo";
    const id = await addTodo(title);

    const transaction = db.transaction(["todos"], "readonly");
    const store = transaction.objectStore("todos");
    const request = store.get(id);

    await new Promise<void>((resolve) => {
      request.onsuccess = () => {
        const todo = request.result as Todo;
        assertExists(todo);
        assertInstanceOf(todo.createdAt, Date);
        assertInstanceOf(todo.updatedAt, Date);
        resolve();
      };
      transaction.oncomplete = () => {
        db.close();
      };
    });
  });

  it("titleが正しく保存される", async () => {
    const db = await initDB();
    const title = "買い物リスト";
    const id = await addTodo(title);

    const transaction = db.transaction(["todos"], "readonly");
    const store = transaction.objectStore("todos");
    const request = store.get(id);

    await new Promise<void>((resolve) => {
      request.onsuccess = () => {
        const todo = request.result as Todo;
        assertExists(todo);
        assertEquals(todo.title, title);
        assertEquals(todo.id, id);
        resolve();
      };
      transaction.oncomplete = () => {
        db.close();
      };
    });
  });
});
