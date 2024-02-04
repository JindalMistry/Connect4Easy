import React, { useEffect, useRef } from "react";
import parse from "html-react-parser";
import Button from "./Button";

export default function LoadingScreen({
  show,
  p1,
  p2,
  onHome,
  onRematch,
  showBtn,
  timer,
}) {
  const leftRef = useRef();
  const rightRef = useRef();

  const process = (type) => {
    if (leftRef) {
      if (leftRef.current) {
        leftRef.current.className =
          "loading-screen-section " +
          (type === false ? "left-close" : "left-open");
      }
    }
    if (rightRef) {
      if (rightRef.current) {
        rightRef.current.className =
          "loading-screen-section " +
          (type === false ? "right-close" : "right-open");
      }
    }
  };

  useEffect(() => {
    process(show);
  }, [show]);

  return (
    <div className="loading-screen-wrapper">
      <div className="loading-screen-section left-open" ref={leftRef}>
        <div
          className="loading-screen-icon"
          onClick={() => {
            process(false);
          }}
        >
          {parse(p1.icon)}
        </div>
        <p className="loading-screen-name">{p1.name}</p>
        {showBtn ? (
          <div className="loading-screen-btn-left">
            <Button label={"Home"} className={"main"} onClick={onHome} />
          </div>
        ) : null}
      </div>
      <div className="loading-screen-section right-open" ref={rightRef}>
        <div className="loading-screen-icon">{parse(p2.icon)}</div>
        <p className="loading-screen-name">{p2.name}</p>
        {showBtn ? (
          <div
            className={`loading-screen-btn-right flex ${
              timer == 0 ? "" : "w45"
            }`}
          >
            <Button label={"Rematch"} className={"main"} onClick={onRematch} />
            {timer == 0 ? null : <div className="rematch-timer">{timer}s</div>}
          </div>
        ) : null}
      </div>
    </div>
  );
}
