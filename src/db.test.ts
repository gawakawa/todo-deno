/// <reference lib="deno.ns" />
import { assertEquals, assertExists } from "jsr:@std/assert";
import "npm:fake-indexeddb/auto";
import { initDB } from "./db.ts";

Deno.test("initDB: データベースとオブジェクトストアが作成される", async () => {
  const db = await initDB();

  assertExists(db);
  assertEquals(db.name, "TodoDB");
  assertEquals(db.objectStoreNames.contains("todos"), true);

  db.close();
});

Deno.test("initDB: オブジェクトストアのキーパスとautoIncrementが正しく設定される", async () => {
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
