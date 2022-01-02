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
      {area.map((a) => (
        <Rnd
          disableDragging={false}
          style={style}
          default={{
            x: 0,
            y: 0,
            width: 550,
            height: 550
          }}
        >
          <Canvas width={500} height={500} />
        </Rnd>
      ))}
    </div>
  );
};

export default App;
