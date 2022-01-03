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
  return (
    <div>
      <Canvas />
    </div>
  );
};

export default App;
