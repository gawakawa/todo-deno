/// <reference lib="deno.ns" />
import {
  assertEquals,
  assertExists,
  assertGreater,
  assertInstanceOf,
} from "jsr:@std/assert";
import { afterEach, describe, it } from "jsr:@std/testing/bdd";
import "npm:fake-indexeddb/auto";
import { addTodo, getTodos, initDB, updateTodo } from "./db.ts";
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

describe("getTodos", () => {
  it("空の場合は空配列を返す", async () => {
    const todos = await getTodos();

    assertExists(todos);
    assertEquals(Array.isArray(todos), true);
    assertEquals(todos.length, 0);
  });

  it("複数のTodoが取得できる", async () => {
    await addTodo("Todo 1");
    await addTodo("Todo 2");
    await addTodo("Todo 3");

    const todos = await getTodos();

    assertEquals(todos.length, 3);
    assertEquals(todos[0].title, "Todo 3");
    assertEquals(todos[1].title, "Todo 2");
    assertEquals(todos[2].title, "Todo 1");
  });

  it("createdAt降順でソートされる", async () => {
    const id1 = await addTodo("最初のTodo");
    await new Promise((resolve) => setTimeout(resolve, 10));
    const id2 = await addTodo("2番目のTodo");
    await new Promise((resolve) => setTimeout(resolve, 10));
    const id3 = await addTodo("3番目のTodo");

    const todos = await getTodos();

    assertEquals(todos.length, 3);
    assertEquals(todos[0].id, id3);
    assertEquals(todos[1].id, id2);
    assertEquals(todos[2].id, id1);
    assertEquals(todos[0].title, "3番目のTodo");
    assertEquals(todos[1].title, "2番目のTodo");
    assertEquals(todos[2].title, "最初のTodo");
  });
});

describe("updateTodo", () => {
  it("既存Todoのtitleが更新される", async () => {
    const id = await addTodo("元のタイトル");
    await updateTodo(id, { title: "更新後のタイトル" });

    const todos = await getTodos();
    const todo = todos.find((t) => t.id === id);

    assertExists(todo);
    assertEquals(todo.title, "更新後のタイトル");
  });

  it("既存Todoのcompletedが更新される", async () => {
    const id = await addTodo("テストTodo");
    await updateTodo(id, { completed: true });

    const todos = await getTodos();
    const todo = todos.find((t) => t.id === id);

    assertExists(todo);
    assertEquals(todo.completed, true);
  });

  it("updatedAtが自動更新される", async () => {
    const id = await addTodo("テストTodo");
    const todosBefore = await getTodos();
    const todoBefore = todosBefore.find((t) => t.id === id);

    assertExists(todoBefore);
    const originalUpdatedAt = todoBefore.updatedAt;

    await new Promise((resolve) => setTimeout(resolve, 10));
    await updateTodo(id, { title: "更新後" });

    const todosAfter = await getTodos();
    const todoAfter = todosAfter.find((t) => t.id === id);

    assertExists(todoAfter);
    assertGreater(
      todoAfter.updatedAt.getTime(),
      originalUpdatedAt.getTime(),
    );
  });

  it("存在しないIDを更新しても何も起こらず、レコードは作成されない", async () => {
    await addTodo("既存Todo");
    const todosBefore = await getTodos();
    const countBefore = todosBefore.length;

    await updateTodo(99999, { title: "存在しない" });

    const todosAfter = await getTodos();
    assertEquals(todosAfter.length, countBefore);
    assertEquals(todosAfter.length, 1);
  });
});
