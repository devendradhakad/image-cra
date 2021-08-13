import React, {
  useRef, useEffect, useCallback, useState,
} from "react";

import workerScript from "../../Workers/ImageWorker.worker";

/**
 *
 * @returns Canvas with image draw
 */
export default function ImageContainer() {
  // Show loading until calculation of pixels done
  const [isLoading, setIsLoading] = useState(false);

  const canvasRef = useRef(null);

  /**
   * @description Memorized function that draw Image on Canvas
   */
  const draw = useCallback(() => {
    // Get canvas from canvasRef
    const canvas = canvasRef.current;
    // Get context from canvas
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;
    // Create rectangle to fit image
    ctx.clearRect(0, 0, width, height);
    ctx.clearRect(0, 0, width, height);
    // Get ImageData from canvas context
    const id = ctx.getImageData(0, 0, width, height);
    const pixels = id.data;
    // Show loader when calculation starts
    setIsLoading(true);
    // Create a worker
    const worker = new Worker(workerScript);
    // Send data to worker for do calculation on worker thread
    worker.postMessage([width, height, pixels, id]);
    // Listen for response from worker
    worker.onmessage = (ev) => {
      // Create new image for imageData
      const newImgData = ctx.createImageData(width, height);
      // Fill all fixels except 0 values
      const clampedArray = new Uint8ClampedArray(
        ev.data[0],
      );
      // Set Pixels into ImageData
      newImgData.data.set(clampedArray);
      // Stop showing Loading
      setIsLoading(false);
      // Draw Image using generated pixels
      ctx.putImageData(newImgData, 0, 0);
    };
  }, []);

  /**
   * Call Draw function when Canvas is ready
   */
  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <>
      {isLoading ? "generating image using worker thread..." : ""}
      <canvas
        ref={canvasRef}
        data-testid="canvas-test-id"
        height="128"
        width="256"
      />
    </>
  );
}
