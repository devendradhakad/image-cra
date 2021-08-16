import { jest, describe } from "@jest/globals";
import { render } from "@testing-library/react";
import ImageContainer from "./ImageContainer";

import workerScript from "../../Workers/ImageWorker.worker.js";

/**
 * @description Define own worker
 */
class Worker {
  constructor(stringUrl) {
    this.url = stringUrl;
    this.onmessage = (msg) => {
      let counter = 0;
      let count = 0;
      const [width, height, pixels, id] = msg;
      let tempOff = 255, tempY = 8;
      for (let r = 8; r <= 256; r += 8) {
        for (let g = 8; g <= 256; g += 8) {
          for (let b = 8; b <= 256; b += 8) {
            if(count == height * width){
              break;
            }
            const x = Math.floor(Math.random() * width);
            const y = Math.floor(Math.random() * height);
            const off = (y * id.width + x) * 4;
            pixels[counter] = r;
            pixels[counter + 1] = g;
            pixels[counter + 2] = b;
            pixels[counter + 3] = 255;
            if (y > width / 2) {
              pixels[off + 3] = 2 * (1 - x / 10);
              tempOff = off;
              tempY = y;
            }
            counter += 4;
            count = count + 1;
          }
        }
      }
      return [pixels, tempOff, tempY]
    };
  }

  postMessage(msg) {
    const newFn = this.onmessage(msg);
    return newFn
  }
}
window.Worker = Worker;

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
    domCanvas.width = 10;
    domCanvas.height = 10;
    document.body.appendChild(domCanvas);

    const height = domCanvas.height;
    const width = domCanvas.width; 
    const id = ctx.getImageData(0, 0, width, height);
    const pixels = id.data;
    
    const myWorker = new Worker(workerScript);

    const [myPixels] = myWorker.postMessage([width, height, pixels, id]);
    expect(height * width * 4).toBe(myPixels.length)
  })

  test("Test uniqueness of test pixels", () => {
    const domCanvas = document.createElement('CANVAS');
    const ctx = domCanvas.getContext("2d");
    domCanvas.width = 10;
    domCanvas.height = 10;
    document.body.appendChild(domCanvas);

    const height = domCanvas.height;
    const width = domCanvas.width; 
    const id = ctx.getImageData(0, 0, width, height);
    const pixels = id.data;
    
    const myWorker = new Worker(workerScript);

    const [myPixels, tempOff, tempY] = myWorker.postMessage([width, height, pixels, id]);
    const initialPixelValues = myPixels.slice(0,4)
    const lastPixelValues = myPixels.slice(myPixels.length-4, myPixels.length);
    const expectedLastPixel = [];
    let count = 0, counter = 0;
    for (let r = 8; r <= 256; r += 8) {
      for (let g = 8; g <= 256; g += 8) {
        for (let b = 8; b <= 256; b += 8) {
          if(count == height * width){
            break;
          }
          const x = Math.floor(Math.random() * width);
          const y = Math.floor(Math.random() * height);
          expectedLastPixel[0] = r
          expectedLastPixel[1] = g
          expectedLastPixel[2] = b
          expectedLastPixel[3] = 255
          if (y > width / 2) {
            expectedLastPixel[3] = 2 * (1 - x / 10);
          }
          counter += 4;
          count = count + 1;
        }
      }
    }

    //Pixels are unique only if they have first and last pixel value as expected
    expect(JSON.stringify([8, 8, 8, 255])).toBe(JSON.stringify(initialPixelValues))
    expect(JSON.stringify(expectedLastPixel)).toBe(JSON.stringify(lastPixelValues))
  })

});
