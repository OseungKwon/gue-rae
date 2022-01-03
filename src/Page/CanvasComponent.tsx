import React, { ReactElement, useContext, useRef } from "react";
import { Rnd, ResizeEnable } from "react-rnd";

interface ICanvasComponent {
  position?: { top: number; left: number };
  size?: { width: string; height: string };
  content?: string;
  id?: string;
  type: string;
  isReadOnly?: boolean;
}

export default function CanvasComponent(props: ICanvasComponent): ReactElement {
  console.log(props);
  const { size, position, content, id, type } = props;
  const [showGrids, setShowGrids] = React.useState(false);
  const [isReadOnly, setIsReadOnly] = React.useState(true);
  const elementRef = React.useRef<HTMLDivElement>(null);
  const isDragged = useRef<boolean>(false);

  return (
    <div ref={elementRef}>
      <Rnd
        size={{ width: size?.width || 0, height: size?.height || 0 }}
        style={{ border: "1px solid black" }}
      >
        props.content
      </Rnd>
    </div>
  );
}
