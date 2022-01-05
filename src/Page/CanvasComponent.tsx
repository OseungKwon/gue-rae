import React, { ReactElement, useContext, useRef } from "react";
import { Rnd, ResizeEnable } from "react-rnd";
import { CanvasContext, ICanvasComponent } from "./Canvas";
import TextElement from "./TextElement";

const componentMap: { [key: string]: React.ComponentType<ICanvasComponent> } = {
  TEXT: TextElement
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

  // double클릭시, 편집 가능
  const onDoubleClick = () => {
    if (!isReadOnly) return;
    setIsReadOnly(false);
    actions?.setEnableQuillToolbar(true);
  };

  // element가 foucs됨
  const onfocus = (event: React.MouseEvent) => {
    if (id) {
      actions?.setActiveSelection(new Set(state?.activeSelection.add(id)));
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

  //
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
      activeSelection.delete(id); //activeSelection 비우기
      actions?.setActiveSelection(new Set(activeSelection));
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
      (id && state?.activeSelection.has(id)) || showGrids || isDragged.current
        ? "#21DEE5"
        : "transparent"
    }`
  };
  const handleClass =
    id && state?.activeSelection.has(id) && state?.activeSelection.size === 1
      ? "showHandles"
      : "";
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
          isDragged.current = true;
        }}
        onDragStop={(e, d) => {
          isDragged.current = false;
          actions?.updateCanvasData({ id, position: { left: d.x, top: d.y } });
        }}
        resizeHandleWrapperClass={handleClass}
        onResize={(e, size, ref, delta, position) => {
          actions?.updateCanvasData({
            id,
            size: { width: ref.style.width, height: ref.style.height },
            position: { top: position.y, left: position.x }
          });
        }}
        onKeyDown={onKeyPressed}
        enableResizing={getEnableResize(type)}
        minWidth={100}
        minHeight={50}
        disableDragging={!isReadOnly}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onDoubleClick={onDoubleClick}
        onFocus={onfocus}
        onBlur={onBlur}
        tabIndex={0}
      >
        <div className="item-container">{getComponent()}</div>
      </Rnd>
    </div>
  );
}
