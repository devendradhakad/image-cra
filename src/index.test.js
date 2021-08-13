import { describe, it, jest } from "@jest/globals";
import reportWebVitals from "./reportWebVitals";

/**
 * @description Mock the child component
 */
jest.mock("./Components/ImageContainer", () => {
  return {
    __esModule: true,
    default: () => <>Testing Text</>,
  };
});

/**
 * @description Test suit for Index
 */
describe("Index file testing", () => {
  const onPerfEntry = jest.fn();

  it("render without crashing", () => {
    const div = document.createElement("div");
    div.id = "root";
    document.body.appendChild(div);
    require("./index.js");
  });

  reportWebVitals(onPerfEntry);
});
