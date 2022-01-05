import React, { useRef, useState, useCallback, useEffect } from "react";
import "../styles.css";
import { CanvasContext, ICanvasComponent } from "./Canvas";

interface Coordinate {
  x: number;
  y: number;
}

const DrawElement = (props: ICanvasComponent) => {
  const { size, position } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState<Coordinate | undefined>(
    undefined
  );
  const [isPainting, setIsPainting] = useState(false);

  const getCoordinates = (event: MouseEvent): Coordinate | undefined => {
    if (!canvasRef.current) {
      return;
    }

    const canvas: HTMLCanvasElement = canvasRef.current;
    if (position) {
      console.log(
        event.pageX,
        position.left,
        canvas.getBoundingClientRect().left
      );
      console.log("cavnas", canvasRef.current.getBoundingClientRect());
      return {
        x: event.pageX - canvas.getBoundingClientRect().left,
        y: event.pageY - canvas.getBoundingClientRect().top
      };
    }
    return {
      x: event.pageX - canvas.offsetLeft,
      y: event.pageY - canvas.offsetTop
    };
  };

  const drawLine = (
    originalMousePosition: Coordinate,
    newMousePosition: Coordinate
  ) => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    const context = canvas.getContext("2d");

    if (context) {
      context.strokeStyle = "red";
      context.lineJoin = "round";
      context.lineWidth = 5;

      context.beginPath();
      context.moveTo(originalMousePosition.x, originalMousePosition.y);
      context.lineTo(newMousePosition.x, newMousePosition.y);
      context.closePath();

      context.stroke();
    }
  };

  const startPaint = useCallback(
    (event: MouseEvent) => {
      if (active) {
        const coordinates = getCoordinates(event);
        if (coordinates) {
          setIsPainting(true);
          setMousePosition(coordinates);
        }
      }
    },
    [active]
  );

  const paint = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (isPainting) {
        const newMousePosition = getCoordinates(event);
        if (mousePosition && newMousePosition) {
          drawLine(mousePosition, newMousePosition);
          setMousePosition(newMousePosition);
        }
      }
    },
    [isPainting, mousePosition]
  );

  const exitPaint = useCallback(() => {
    setIsPainting(false);
  }, []);

  const clearCanvas = () => {
    if (!canvasRef.current) {
      return;
    }

    const canvas: HTMLCanvasElement = canvasRef.current;
    canvas.getContext("2d")!!.clearRect(0, 0, canvas.width, canvas.height);
  };
  const onDoubleClick = useCallback(() => {
    console.log("더블클릭함", active);
    setActive(!active);
  }, [active]);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;

    canvas.addEventListener("mousedown", startPaint);
    canvas.addEventListener("mousemove", paint);
    canvas.addEventListener("mouseup", exitPaint);
    canvas.addEventListener("mouseleave", exitPaint);

    return () => {
      canvas.removeEventListener("mousedown", startPaint);
      canvas.removeEventListener("mousemove", paint);
      canvas.removeEventListener("mouseup", exitPaint);
      canvas.removeEventListener("mouseleave", exitPaint);
    };
  }, [startPaint, paint, exitPaint]);

  return (
    <div className="App">
      <canvas
        onDoubleClick={onDoubleClick}
        ref={canvasRef}
        height={size?.height}
        width={size?.width}
        className="canvas"
      />
    </div>
  );
};

export default DrawElement;