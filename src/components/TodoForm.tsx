import React, { useState } from "react";
import { Button, Input, Label, TextField } from "react-aria-components";

type TodoFormProps = {
  onAdd: (title: string) => void;
};

export const TodoForm = ({ onAdd }: TodoFormProps): React.JSX.Element => {
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim());
      setTitle("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <TextField value={title} onChange={setTitle} className="flex-1">
        <Label className="sr-only">新しいTodo</Label>
        <Input
          placeholder="What needs to be done?"
          className="w-full px-4 py-2.5 text-sm bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-md outline-none transition-colors placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600"
        />
      </TextField>
      <Button
        type="submit"
        className="px-4 py-2.5 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-md transition-colors outline-none pressed:opacity-80 focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600 hovered:bg-zinc-800 dark:hovered:bg-zinc-200"
      >
        Add
      </Button>
    </form>
  );
};
