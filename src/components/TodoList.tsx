import type { Todo } from "../types.ts";
import { TodoItem } from "./TodoItem.tsx";

type TodoListProps = {
  todos: Todo[];
  onToggle: (id: number) => void;
  onUpdate: (id: number, title: string) => void;
  onDelete: (id: number) => void;
};

export const TodoList = ({
  todos,
  onToggle,
  onUpdate,
  onDelete,
}: TodoListProps): JSX.Element => {
  if (todos.length === 0) {
    return <p>Todoがありません</p>;
  }

  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};
