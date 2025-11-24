/// <reference lib="deno.ns" />
import { assertEquals } from "@std/assert";
import { afterEach, describe, it } from "@std/testing/bdd";
import "fake-indexeddb/auto";
import { addTodo } from "../../src/actions/addTodo.ts";
import { deleteTodo } from "../../src/actions/deleteTodo.ts";
import { getTodos } from "../../src/actions/getTodos.ts";

afterEach(async () => {
  await new Promise<void>((resolve) => {
    const request = indexedDB.deleteDatabase("TodoDB");
    request.onsuccess = () => resolve();
    request.onerror = () => resolve();
  });
});

describe("deleteTodo", () => {
  it("Todoが削除される", async () => {
    const id1 = await addTodo("削除するTodo");
    const id2 = await addTodo("残すTodo");

    await deleteTodo(id1);

    const todos = await getTodos();
    assertEquals(todos.length, 1);
    assertEquals(todos[0].id, id2);
    assertEquals(todos[0].title, "残すTodo");
  });

  it("削除後、getTodos()で取得できない", async () => {
    const id = await addTodo("削除するTodo");

    const todosBefore = await getTodos();
    assertEquals(todosBefore.length, 1);

    await deleteTodo(id);

    const todosAfter = await getTodos();
    assertEquals(todosAfter.length, 0);
    const deletedTodo = todosAfter.find((t) => t.id === id);
    assertEquals(deletedTodo, undefined);
  });

  it("存在しないIDを削除しても正常終了する", async () => {
    await addTodo("既存Todo");
    const todosBefore = await getTodos();
    const countBefore = todosBefore.length;

    await deleteTodo(99999);

    const todosAfter = await getTodos();
    assertEquals(todosAfter.length, countBefore);
    assertEquals(todosAfter.length, 1);
  });
});
