// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "./LoginForm";

describe("LoginForm", () => {
  it("submits the entered username and password", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(true);

    render(<LoginForm onSubmit={onSubmit} />);

    await user.type(screen.getByPlaceholderText("Username"), "alice");
    await user.type(screen.getByPlaceholderText("Password"), "s3cret");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(onSubmit).toHaveBeenCalledWith("alice", "s3cret");
  });

  it("shows an error when authentication fails", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(false);

    render(<LoginForm onSubmit={onSubmit} />);

    await user.type(screen.getByPlaceholderText("Username"), "alice");
    await user.type(screen.getByPlaceholderText("Password"), "wrong");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Invalid credentials");
  });

  it("disables the button and shows a pending label while submitting", async () => {
    const user = userEvent.setup();
    let resolve: (v: boolean) => void = () => {};
    const onSubmit = vi.fn().mockImplementation(() => new Promise<boolean>((r) => (resolve = r)));

    render(<LoginForm onSubmit={onSubmit} />);

    await user.type(screen.getByPlaceholderText("Username"), "alice");
    await user.type(screen.getByPlaceholderText("Password"), "s3cret");
    await user.click(screen.getByRole("button", { name: /login/i }));

    const button = screen.getByRole("button", { name: /logging in/i });
    expect(button).toBeDisabled();

    resolve(true);
  });

  it("renders localized labels when provided", () => {
    render(<LoginForm onSubmit={vi.fn()} labels={{ title: "एडमिन लॉगिन", submit: "लॉगिन" }} />);
    expect(screen.getByRole("heading", { name: "एडमिन लॉगिन" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "लॉगिन" })).toBeInTheDocument();
  });
});
