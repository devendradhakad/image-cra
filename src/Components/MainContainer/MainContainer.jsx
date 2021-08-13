import React from "react";
import ImageContainer from "../ImageContainer";
import "./MainContainer.css";

/**
 *
 * @returns Main Container with Image
 */
export default function MainContainer() {
  return (
    <>
      <div className="row">
        <div className="column">
          <h2>Generated Image</h2>
          (256 x 128)
        </div>
        <div className="column">
          <div className="canvas-wrap">
            <ImageContainer />
          </div>
        </div>
      </div>
    </>
  );
}
