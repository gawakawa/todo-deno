import { useState } from "react";
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
    <div>
      <h1>Todo アプリ</h1>
      <button onClick={handleLoad}>読み込み</button>
      <TodoForm onAdd={handleAdd} />
      <TodoList
        todos={todos}
        onToggle={handleToggle}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default App;
