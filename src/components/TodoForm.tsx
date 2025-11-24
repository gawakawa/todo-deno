import { useState } from "react";

type TodoFormProps = {
  onAdd: (title: string) => void;
};

export const TodoForm = ({ onAdd }: TodoFormProps): JSX.Element => {
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim());
      setTitle("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="新しいTodoを入力"
      />
      <button type="submit">追加</button>
    </form>
  );
};
