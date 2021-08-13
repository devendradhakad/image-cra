import { render, screen } from "@testing-library/react";
import Header from "./Header";

/**
 * Testing Rendering of Header
 */
test("testing rendering of Header", () => {
  render(<Header />);
  expect(screen.getByText("Image Generator")).toBeInTheDocument();
});
