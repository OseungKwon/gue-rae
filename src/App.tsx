import React, { useState } from "react";
import Canvas from "./Page/Canvas";
import { Rnd } from "react-rnd";

const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "solid 1px #ddd",
  background: "#f0f0f0"
};

const App = () => {
  const [area, setArea] = useState([1, 2, 3]);
  const click = () => {
    setArea(area);
  };
  return (
    <div>
      <button onClick={click}>생성</button>
      <Canvas />
    </div>
  );
};

export default App;
