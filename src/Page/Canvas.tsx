import React, { ReactElement, useState, useRef, useCallback } from "react";

import CanvasComponent from "./CanvasComponent";
import Toolbar from "./Toolbar";
export const CanvasContext = React.createContext<ICanvasContext>({});

export interface ICanvasContext {
  state?: {
    canvasData: ICanvasData[];
    activeSelection: Set<string>;
    enableQuillToolbar: boolean;
  };
  actions?: {
    setCanvasData: React.Dispatch<React.SetStateAction<ICanvasData[]>>;
    updateCanvasData: (data: Partial<ICanvasComponent>) => void;
    setEnableQuillToolbar: (state: boolean) => void;
    setActiveSelection: React.Dispatch<React.SetStateAction<Set<string>>>;
    addElement: (type: string) => void;
  };
}
///////////////
export interface ICanvasData {
  component?: string;
  id?: string;
  position?: { top: number; left: number };
  dimension?: { width: string; height: string };
  content?: string;
  type: string;
}
export interface ICanvasComponent {
  position?: { top: number; left: number };
  size?: { width: string; height: string };
  content?: string;
  id?: string;
  type: string;
  isReadOnly?: boolean;
}
const getInitialData = (data: any[], type: string = "TEXT") => {
  return {
    type: type,
    id: `${type}__${Date.now()}__${data.length}`,
    position: {
      top: 100,
      left: 100
    },
    size: {
      width: "150",
      height: type === "TEXT" ? "50" : "150"
    },
    content: type === "TEXT" ? "Sample Text" : ""
  };
};

const exampleData = [
  {
    type: "TEXT",
    id: "TEXT__1616155060789__1",
    position: { left: 126, top: 100 },
    size: { width: "174px", height: "50px" },
    content:
      '<p><strong style="font-family: &quot;Trebuchet MS&quot;; font-size: 20px;">Visual BI Solutions</strong></p>'
  },
  {
    type: "TEXT",
    id: "TEXT__1616155106456__2",
    position: { left: 130, top: 100 },
    size: { width: "100px", height: "50px" },
    content: "<p>Invoice</p>"
  }
];
////////////

export default function Canvas(): ReactElement {
  const [canvasData, setCanvasData] = useState<ICanvasData[]>(exampleData); // 현재 canvas에 있는 element 전체 데이터
  const [activeSelection, setActiveSelection] = useState<Set<string>>( // focus된 element
    new Set()
  );
  const [enableQuillToolbar, setEnableQuillToolbar] = useState<boolean>(false); // QuillToolbar

  const containerRef = useRef<HTMLDivElement>(null); // 컨테이너 ref
  console.log(activeSelection);

  // element 추가
  const addElement = (type: string) => {
    const defaultData = getInitialData(canvasData, type);
    setCanvasData([...canvasData, { ...defaultData, type: type ?? "TEXT" }]);
    activeSelection.clear();
    activeSelection.add(defaultData.id);
    setActiveSelection(new Set(defaultData.id));
  };

  // element 업데이트
  const updateCanvasData = (data: Partial<ICanvasComponent>) => {
    const currentDataIndex =
      canvasData.findIndex((canvas) => canvas.id === data.id) ?? -1;
    const updatedData = { ...canvasData?.[currentDataIndex], ...data };
    canvasData.splice(currentDataIndex, 1, updatedData);
    setCanvasData([...(canvasData || [])]);
  };

  // element 삭제
  const deleteElement = useCallback(() => {
    setCanvasData([
      ...canvasData.filter((data) => {
        if (data.id && activeSelection.has(data.id)) {
          activeSelection.delete(data.id);
          return false;
        }
        return true;
      })
    ]);
    setActiveSelection(new Set(activeSelection));
  }, [activeSelection, canvasData]);

  const context: ICanvasContext = {
    actions: {
      setCanvasData,
      setActiveSelection,
      updateCanvasData,
      addElement,
      setEnableQuillToolbar
    },
    state: {
      canvasData,
      activeSelection,
      enableQuillToolbar
    }
  };

  // 키 눌렀을 때 이벤트
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Delete") {
        deleteElement();
      }
    },
    [deleteElement]
  );

  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div>
      <div ref={containerRef}>
        <CanvasContext.Provider value={context}>
          <Toolbar isEditEnable={enableQuillToolbar} />

          <div className="canvas-container">
            {canvasData.map((canvas) => {
              return <CanvasComponent {...canvas} />;
            })}
          </div>
          {/* {JSON.stringify(canvasData)} */}
        </CanvasContext.Provider>
      </div>
    </div>
  );
}
