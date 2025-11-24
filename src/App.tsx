import React, { Suspense } from "react";
import { getTodos } from "./actions/getTodos.ts";
import { TodoContainer } from "./components/TodoContainer.tsx";
import "./App.css";

const App = (): React.JSX.Element => {
  const todosPromise = getTodos();

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 dark:border-zinc-100">
            </div>
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
              Loading todos...
            </p>
          </div>
        </div>
      }
    >
      <TodoContainer todosPromise={todosPromise} />
    </Suspense>
  );
};

export default App;
