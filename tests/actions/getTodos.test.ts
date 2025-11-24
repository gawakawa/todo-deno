/// <reference lib="deno.ns" />
import { assertEquals, assertExists } from "@std/assert";
import { afterEach, describe, it } from "@std/testing/bdd";
import "fake-indexeddb/auto";
import { addTodo } from "../../src/actions/addTodo.ts";
import { getTodos } from "../../src/actions/getTodos.ts";

afterEach(async () => {
  await new Promise<void>((resolve) => {
    const request = indexedDB.deleteDatabase("TodoDB");
    request.onsuccess = () => resolve();
    request.onerror = () => resolve();
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
