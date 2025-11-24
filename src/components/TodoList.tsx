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
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-zinc-400 dark:text-zinc-600">
          No todos yet
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-zinc-500 dark:text-zinc-500 px-2">
        Double-click to edit
      </p>
      <ul className="border border-zinc-200 dark:border-zinc-800 rounded-md overflow-hidden bg-white dark:bg-zinc-900">
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
    </div>
  );
};
