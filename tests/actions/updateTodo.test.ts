/// <reference lib="deno.ns" />
import { assertEquals, assertExists, assertGreater } from "@std/assert";
import { afterEach, describe, it } from "@std/testing/bdd";
import "fake-indexeddb/auto";
import { addTodo } from "../../src/actions/addTodo.ts";
import { getTodos } from "../../src/actions/getTodos.ts";
import { updateTodo } from "../../src/actions/updateTodo.ts";

afterEach(async () => {
  await new Promise<void>((resolve) => {
    const request = indexedDB.deleteDatabase("TodoDB");
    request.onsuccess = () => resolve();
    request.onerror = () => resolve();
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
