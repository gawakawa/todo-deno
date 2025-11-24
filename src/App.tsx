import React, { Suspense } from "react";
import { getTodos } from "./actions/getTodos.ts";
import { TodoContainer } from "./components/TodoContainer.tsx";
import { Loading } from "./components/Loading.tsx";
import "./App.css";

const App = (): React.JSX.Element => {
  const todosPromise = getTodos();

  return (
    <Suspense fallback={<Loading />}>
      <TodoContainer todosPromise={todosPromise} />
    </Suspense>
  );
};

export default App;
