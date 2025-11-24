import { useState } from "react";
import { Button, Checkbox, Input, TextField } from "react-aria-components";
import type { Todo } from "../types.ts";

type TodoItemProps = {
  todo: Todo;
  onToggle: (id: number) => void;
  onUpdate: (id: number, title: string) => void;
  onDelete: (id: number) => void;
};

export const TodoItem = ({
  todo,
  onToggle,
  onUpdate,
  onDelete,
}: TodoItemProps): JSX.Element => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);

  const handleDoubleClick = (): void => {
    setIsEditing(true);
    setEditText(todo.title);
  };

  const handleSave = (): void => {
    const trimmedText = editText.trim();
    if (trimmedText && trimmedText !== todo.title) {
      onUpdate(todo.id, trimmedText);
    }
    setIsEditing(false);
  };

  const handleCancel = (): void => {
    setEditText(todo.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <li className="flex items-center gap-3 py-3 px-4 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-md">
        <TextField value={editText} onChange={setEditText} className="flex-1">
          <Input
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            autoFocus
            className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-600 rounded-md outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-500"
          />
        </TextField>
      </li>
    );
  }

  return (
    <li className="group/item flex items-center gap-3 py-3 px-4 border-b border-zinc-200 dark:border-zinc-800 last:border-b-0 transition-colors hovered:bg-zinc-50 dark:hovered:bg-zinc-800/50">
      <Checkbox
        isSelected={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="flex items-center cursor-pointer outline-none group/checkbox"
      >
        <div className="w-5 h-5 border-2 border-zinc-300 dark:border-zinc-600 rounded transition-all group-selected/checkbox:border-zinc-900 dark:group-selected/checkbox:border-zinc-100 group-selected/checkbox:bg-zinc-900 dark:group-selected/checkbox:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900">
          <svg
            viewBox="0 0 18 18"
            aria-hidden="true"
            className="w-full h-full fill-none stroke-white dark:stroke-zinc-900 stroke-[3] opacity-0 group-selected/checkbox:opacity-100 transition-opacity"
          >
            <polyline points="1 9 7 14 15 4" />
          </svg>
        </div>
      </Checkbox>
      <span
        onDoubleClick={handleDoubleClick}
        className={`flex-1 text-sm cursor-pointer select-none transition-colors ${
          todo.completed
            ? "line-through text-zinc-400 dark:text-zinc-600"
            : "text-zinc-900 dark:text-zinc-100"
        }`}
      >
        {todo.title}
      </span>
      <Button
        onPress={() => onDelete(todo.id)}
        className="px-3 py-1.5 text-xs text-zinc-500 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700 rounded transition-colors outline-none hovered:text-zinc-900 dark:hovered:text-zinc-100 hovered:border-zinc-400 dark:hovered:border-zinc-600 pressed:bg-zinc-100 dark:pressed:bg-zinc-800 focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600"
      >
        Delete
      </Button>
    </li>
  );
};
