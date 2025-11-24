import { useState } from "react";
import { Button } from "react-aria-components";
import type { Todo } from "./types.ts";
import { addTodo, deleteTodo, getTodos, updateTodo } from "./db.ts";
import { TodoForm } from "./components/TodoForm.tsx";
import { TodoList } from "./components/TodoList.tsx";
import "./App.css";

const App = (): JSX.Element => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const handleLoad = async (): Promise<void> => {
    const loadedTodos = await getTodos();
    setTodos(loadedTodos);
  };

  const handleAdd = async (title: string): Promise<void> => {
    await addTodo(title);
    const updatedTodos = await getTodos();
    setTodos(updatedTodos);
  };

  const handleToggle = async (id: number): Promise<void> => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      await updateTodo(id, { completed: !todo.completed });
      const updatedTodos = await getTodos();
      setTodos(updatedTodos);
    }
  };

  const handleUpdate = async (id: number, title: string): Promise<void> => {
    await updateTodo(id, { title });
    const updatedTodos = await getTodos();
    setTodos(updatedTodos);
  };

  const handleDelete = async (id: number): Promise<void> => {
    await deleteTodo(id);
    const updatedTodos = await getTodos();
    setTodos(updatedTodos);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
      <div className="w-full sm:w-11/12 lg:w-4/5 xl:w-3/4 mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight">
              Todos
            </h1>
            <Button
              onPress={handleLoad}
              className="p-2 text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700 rounded-md transition-colors outline-none hovered:bg-zinc-100 dark:hovered:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600"
              aria-label="Load todos"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
              </svg>
            </Button>
          </div>
        </header>
        <main className="space-y-6">
          <TodoForm onAdd={handleAdd} />
          <TodoList
            todos={todos}
            onToggle={handleToggle}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        </main>
      </div>
    </div>
  );
};

export default App;
