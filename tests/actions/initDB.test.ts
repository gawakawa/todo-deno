/// <reference lib="deno.ns" />
import { assertEquals, assertExists } from "@std/assert";
import { afterEach, describe, it } from "@std/testing/bdd";
import "fake-indexeddb/auto";
import { initDB } from "../../src/actions/initDB.ts";

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
