import React from "react";
import Modal from "../Component/Modal";
import "../Css/component.css"

export default function ConnectionScreen({ show, conn }) {
  return (
    <Modal
      type={"small-square"}
      show={show}
      closeOutsideClick={false}
      label={""}
      className={"connection-screen"}
    >
      <div>
        <p>Connecting...</p>
        <p>We are letting {conn.username} know you are ready to play!</p>
      </div>
      <div className="connection-loader connection-screen-loader"></div>
    </Modal>
  );
}
