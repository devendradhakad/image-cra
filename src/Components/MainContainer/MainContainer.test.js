import { render, screen } from "@testing-library/react";
import MainContainer from "./MainContainer";

/**
 * @description Define our own worker
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
 * @returns methods of getContext
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
 * @description Test suit for MainContainer Component
 */
describe("Testing rendering of MainContainer Component", () => {
  test("Testing rendering", () => {
    render(<MainContainer />);
    expect(screen.getByText("Generated Image")).toBeInTheDocument();
  });
});
