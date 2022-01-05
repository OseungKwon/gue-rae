import React, { useContext } from "react";
import { CanvasContext } from "./Canvas";
import { Button } from "antd";
import "antd/dist/antd.css";
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
      <div style={{ display: "flex" }}>
        <Button
          onClick={() => addElement("TEXT")}
          style={{ width: "6rem", height: "3rem" }}
        >
          버튼
        </Button>
        <Button
          onClick={() => addElement("DRAW")}
          style={{ width: "6rem", height: "3rem" }}
        >
          버튼
        </Button>
      </div>
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
    </div>
  );
}
