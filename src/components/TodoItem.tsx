import { useState } from "react";
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
      <li>
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      </li>
    );
  }

  return (
    <li>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span
        onDoubleClick={handleDoubleClick}
        style={{
          textDecoration: todo.completed ? "line-through" : "none",
          cursor: "pointer",
        }}
      >
        {todo.title}
      </span>
      <button onClick={() => onDelete(todo.id)}>削除</button>
    </li>
  );
};
