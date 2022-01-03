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

  const onDoubleClick = () => {
    if (!isReadOnly) return;
    setIsReadOnly(false);
    actions?.setEnableQuillToolbar(true);
  };

  const onfocus = (event: React.MouseEvent) => {
    if (id) {
      actions?.setActiveSelection(new Set(state?.activeSelection.add(id)));
    }
  };
  const onMouseEnter = () => {
    setShowGrids(true);
  };
  const onBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    const toolbarElement = document.querySelector("#toolbar");
    if (
      event.currentTarget.contains(event?.relatedTarget as Element) ||
      toolbarElement?.contains(event?.relatedTarget as Element)
    ) {
      return;
    }
    setIsReadOnly(true);
    actions?.setEnableQuillToolbar(false);
    if (id && activeSelection) {
      activeSelection.delete(id);
      actions?.setActiveSelection(new Set(activeSelection));
    }
  };
  const onMouseLeave = () => {
    setShowGrids(false);
  };
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!isReadOnly) event.stopPropagation();
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
        enableResizing={getEnableResize(type)}
        minWidth={100}
        minHeight={50}
        disableDragging={!isReadOnly}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onDoubleClick={onDoubleClick}
        onKeyDown={onKeyDown}
        onFocus={onfocus}
        onBlur={onBlur}
        tabIndex={0}
        //lockAspectRatio={type === "IMAGE"}
      >
        <div className="item-container">{getComponent()}</div>
      </Rnd>
    </div>
  );
}
