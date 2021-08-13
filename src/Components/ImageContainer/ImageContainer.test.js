import { jest, describe } from "@jest/globals";
import { render } from "@testing-library/react";
import ImageContainer from "./ImageContainer";

/**
 * @description Define own worker
 */
class Worker {
  constructor(stringUrl) {
    this.url = stringUrl;
    this.onmessage = () => {};
  }

  postMessage(msg) {
    this.onmessage(msg);
  }
}
window.Worker = Worker;

/**
 *
 * @returns Methods of getContext
 */
HTMLCanvasElement.prototype.getContext = () => {
  return {
    clearRect: jest.fn(),
    getImageData: jest.fn(() => {
      return "data";
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

/**
 * @description Test suit for ImageContainer Component
 */
describe("Testing of ImageContainer Component", () => {
  test("Test rendering", () => {
    const { getByTestId } = render(<ImageContainer />);
    expect(getByTestId("canvas-test-id")).toBeInTheDocument();
  });
});
