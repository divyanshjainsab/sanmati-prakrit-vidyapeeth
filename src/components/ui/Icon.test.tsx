// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Icon from "./Icon";

describe("Icon", () => {
  it("renders an svg for a known icon name", () => {
    const { container } = render(<Icon name="home" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders nothing for an unknown name instead of crashing", () => {
    // This is the guard that prevents a typo'd admin nav icon from taking
    // down the whole site (Navbar renders in the root layout).
    const { container } = render(<Icon name={"not-a-real-icon" as never} />);
    expect(container.querySelector("svg")).toBeNull();
    expect(container).toBeEmptyDOMElement();
  });
});
