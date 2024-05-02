import React from "react";
import Router from "./components/Routes/Router";
import { BrowserRouter} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}

export default App;