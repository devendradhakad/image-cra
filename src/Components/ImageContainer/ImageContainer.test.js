import { jest, describe } from "@jest/globals";
import { render } from "@testing-library/react";
import ImageContainer from "./ImageContainer";

import { workerScript, workercode } from "../../Workers/ImageWorker.worker.js";

/**
 * @description Define worker
 */
class MyWorker {
  constructor() {
    this.onmessage = (msg) => {
      const newWorkerCode = new workercode()
      const pixels = newWorkerCode.calculatePixels({data: msg});
      return [pixels]
    };
  }
  postMessage(msg) {
    const newFn = this.onmessage(msg);
    return newFn
  }
}

window.Worker = MyWorker;

/**
 *
 * @returns Methods of getContext
 */
window.HTMLCanvasElement.prototype.getContext = () => {
  return {
    clearRect: jest.fn(),
    getImageData: jest.fn(() => {
      return {
        data : []
      };
    }),
    createImageData: jest.fn(() => {
      return {
        data: {
          set: jest.fn(),
        },
      };
    }),
    putImageData: jest.fn(),
  };
};

window.HTMLCanvasElement.prototype.toDataURL = function () {
  return "";
}

/**
 * @description Test suit for ImageContainer Component
 */
describe("Testing of ImageContainer Component", () => {

  test("Test rendering", () => {
    const { getByTestId } = render(<ImageContainer />);
    expect(getByTestId("canvas-test-id")).toBeInTheDocument();
  });

  test("Test total number of pixles Draw", async () => {
    const domCanvas = document.createElement('CANVAS');
    const ctx = domCanvas.getContext("2d");
    domCanvas.width = domCanvas.height = 10;
    document.body.appendChild(domCanvas);

    const { height, width } = domCanvas; 
    const id = ctx.getImageData(0, 0, width, height);
    const pixels = id.data;
    
    const myWorker = new Worker(workerScript);

    const [myPixels] = myWorker.postMessage([width, height, pixels, id]);
    expect(height * width * 4).toBe(myPixels.length)
  })

  test("Test uniqueness of test pixels", () => {
    const domCanvas = document.createElement('CANVAS');
    const ctx = domCanvas.getContext("2d");
    domCanvas.width = domCanvas.height = 10;
    document.body.appendChild(domCanvas);

    const { width, height } = domCanvas;
    const id = ctx.getImageData(0, 0, width, height);
    const pixels = id.data;
    
    const myWorker = new Worker(workerScript);

    const [myPixels] = myWorker.postMessage([width, height, pixels, id]);
    const initialPixelValues = myPixels.slice(0,4)
    const lastPixelValues = myPixels.slice(myPixels.length-4, myPixels.length);

    //Pixels are unique only if they have first and last pixel value as expected
    expect(JSON.stringify([8, 8, 8, 255])).toBe(JSON.stringify(initialPixelValues))
    expect(JSON.stringify([8, 32, 32, 255])).toBe(JSON.stringify(lastPixelValues))
  })

});
