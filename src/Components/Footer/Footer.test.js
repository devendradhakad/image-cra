import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

/**
 * Testing Rendering of Footer
 */
test("testing rendering of Footer", () => {
  render(<Footer />);
  expect(screen.getByText("@Blazeclan 2021")).toBeInTheDocument();
});
