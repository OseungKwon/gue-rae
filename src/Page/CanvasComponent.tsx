import React, { ReactElement, useContext, useRef } from "react";
import { Rnd, ResizeEnable } from "react-rnd";
import { CanvasContext, ICanvasComponent } from "./Canvas";
import TextElement from "./TextElement";
import DrawElement from "./DrawElement";

const componentMap: { [key: string]: React.ComponentType<ICanvasComponent> } = {
  TEXT: TextElement,
  DRAW: DrawElement
};

const getEnableResize = (type: string): ResizeEnable => {
  return {
    bottom: type === "IMAGE",
    bottomLeft: true,
    bottomRight: true,

    top: type === "IMAGE",
    topLeft: true,
    topRight: true,

    left: true,
    right: true
  };
};

export default function CanvasComponent(props: ICanvasComponent): ReactElement {
  const { state, actions } = useContext(CanvasContext);
  const { size, position, content, id, type } = props;
  const [showGrids, setShowGrids] = React.useState(false);
  const [isReadOnly, setIsReadOnly] = React.useState(true);
  const elementRef = React.useRef<HTMLDivElement>(null);
  const isDragged = useRef<boolean>(false);
  const activeSelection = state?.activeSelection;

  console.log("isread", isReadOnly);
  // double클릭시, 편집 가능
  const onDoubleClick = () => {
    if (!isReadOnly) return;
    setIsReadOnly(false);
    if (type === "TEXT") actions?.setEnableQuillToolbar(true);
    else if (type === "DRAW") {
      actions?.setEnableDrawToolbar(true);
    }
  };

  // element가 foucs됨
  const onfocus = (event: React.MouseEvent) => {
    if (id) {
      actions?.setActiveSelection(id);
    }
  };

  // 마우스가 element 안에 들어왔을 때
  const onMouseEnter = () => {
    setShowGrids(true);
  };
  //마우스가 element 밖으로 나갔을 때
  const onMouseLeave = () => {
    setShowGrids(false);
  };

  // focus 없애기
  const onBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    const toolbarElement = document.querySelector("#toolbar");
    console.log("onBlur", event, toolbarElement, id, activeSelection);

    if (
      event.currentTarget.contains(event?.relatedTarget as Element) ||
      toolbarElement?.contains(event?.relatedTarget as Element)
    ) {
      return;
    }
    setIsReadOnly(true);
    actions?.setEnableQuillToolbar(false);
    if (id && activeSelection) {
      actions?.setActiveSelection("");
    }
  };

  // 방향키 이외의 키를 눌렀을 때 동작
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!isReadOnly) event.stopPropagation();
  };

  // 방향키 눌렀을 때, element 위치 이동
  const onKeyPressed = (e: any) => {
    if (position) {
      switch (e.key) {
        case "ArrowLeft":
          actions?.updateCanvasData({
            id,
            size,
            position: {
              left: position.left - 10,
              top: position.top
            }
          });
          break;
        case "ArrowUp":
          actions?.updateCanvasData({
            id,
            size,
            position: {
              left: position.left,
              top: position.top - 10
            }
          });
          break;

        case "ArrowRight":
          actions?.updateCanvasData({
            id,
            size,
            position: {
              left: position.left + 10,
              top: position.top
            }
          });
          break;
        case "ArrowDown":
          actions?.updateCanvasData({
            id,
            size,
            position: {
              left: position.left,
              top: position.top + 10
            }
          });
          break;
        default:
          onKeyDown(e);
          break;
      }
    }
  };

  const style: React.CSSProperties = {
    outline: "none",
    border: `2px solid ${
      (id && state?.activeSelection === id) || showGrids || isDragged.current
        ? "#21DEE5"
        : "transparent"
    }`
  };

  // handle span element의 css 클래스 이름을 설정하는데 사용
  const handleClass = id && state?.activeSelection === id ? "showHandles" : "";
  // TextElement, ImageElement 선택
  const getComponent = () => {
    const Component = type && componentMap[type];
    if (!Component || !id) return null;
    return (
      <Component
        key={id}
        id={id}
        type={type}
        position={position}
        size={size}
        content={content}
        isReadOnly={isReadOnly}
      />
    );
  };

  return (
    <div ref={elementRef}>
      <Rnd
        style={style}
        size={{ width: size?.width || 0, height: size?.height || 0 }}
        position={{ x: position?.left || 0, y: position?.top || 0 }}
        onDragStart={() => {
          // 드래그 시작
          isDragged.current = true;
        }}
        onDragStop={(e, d) => {
          // 드래그 종료
          isDragged.current = false;
          actions?.updateCanvasData({ id, position: { left: d.x, top: d.y } });
        }}
        resizeHandleWrapperClass={handleClass} // handle span element의 css 클래스 이름을 설정
        onResize={(e, size, ref, delta, position) => {
          // 리사이징
          actions?.updateCanvasData({
            id,
            size: { width: ref.style.width, height: ref.style.height },
            position: { top: position.y, left: position.x }
          });
        }}
        onKeyDown={onKeyPressed} // 키보드 클릭
        enableResizing={getEnableResize(type)}
        minWidth={100}
        minHeight={50}
        disableDragging={!isReadOnly} // 드래그 허용 여부
        onMouseEnter={onMouseEnter} // 마우스가 element에 들어왔을 때
        onMouseLeave={onMouseLeave} // 마우스가 element에서 빠져나왔을 때
        onDoubleClick={onDoubleClick} // 더블클릭 시
        onFocus={onfocus} // 포커싱됨
        onBlur={onBlur} // 포커싱에서 나와짐
        tabIndex={0}
      >
        <div className="item-container">{getComponent()}</div>
      </Rnd>
    </div>
  );
}
