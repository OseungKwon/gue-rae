import React, { useContext } from "react";
import { CanvasContext } from "./Canvas";

interface IToolbarProps {
  isEditEnable: boolean;
}

export default function Toolbar({ isEditEnable }: IToolbarProps) {
  const { actions } = useContext(CanvasContext);
  const addElement = (type: string) => {
    actions?.addElement(type);
  };
  return (
    <div className="toolbarWrapper">
      {isEditEnable && (
        <div id="toolbar">
          <select className="ql-size">
            <option value="small"></option>
            <option value="normal"></option>
            <option value="large"></option>
            <option value="huge"></option>
          </select>
          <button className="ql-bold" />
          <button className="ql-italic" />
          <button className="ql-underline" />
          <select className="ql-align" />
          <select className="ql-color" />
          <select className="ql-background" />
        </div>
      )}
      <div>
        <button onClick={() => addElement("TEXT")}>버튼</button>
        <button onClick={() => addElement("DRAW")}>버튼</button>
      </div>
    </div>
  );
}
