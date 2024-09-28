// index.tsx
import React from "react";
import ReactDOM from "react-dom";
import CombinedProviders from "./CombinedProviders";
import AppRouter from "./AppRouter";

const App = () => {
  return (
    <React.StrictMode>
      <CombinedProviders>
        <AppRouter />
      </CombinedProviders>
    </React.StrictMode>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
