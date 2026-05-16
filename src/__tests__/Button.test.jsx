import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "../components/common/button/Button";

describe("Button", () => {
    it("renders children text", () => {
        render(<Button>Click Me</Button>);
        expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
    });

    it("calls onClick when clicked", async () => {
        const onClick = vi.fn();
        render(<Button onClick={onClick}>Click</Button>);
        await userEvent.click(screen.getByRole("button"));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("is disabled when disabled prop is true", () => {
        render(<Button disabled>Click</Button>);
        expect(screen.getByRole("button")).toBeDisabled();
    });

    it("is disabled when loading", () => {
        render(<Button loading>Click</Button>);
        expect(screen.getByRole("button")).toBeDisabled();
    });

    it("shows spinner when loading", () => {
        render(<Button loading>Click</Button>);
        const button = screen.getByRole("button");
        expect(button.querySelector(".animate-spin")).toBeInTheDocument();
    });

    it("renders with default type button", () => {
        render(<Button>Click</Button>);
        expect(screen.getByRole("button")).toHaveAttribute("type", "button");
    });

    it("accepts custom type", () => {
        render(<Button type="submit">Submit</Button>);
        expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
    });

    it("renders left icon when not loading", () => {
        render(<Button leftIcon={<span data-testid="left-icon">L</span>}>Click</Button>);
        expect(screen.getByTestId("left-icon")).toBeInTheDocument();
    });

    it("renders right icon when not loading", () => {
        render(<Button rightIcon={<span data-testid="right-icon">R</span>}>Click</Button>);
        expect(screen.getByTestId("right-icon")).toBeInTheDocument();
    });

    it("does not render icons when loading", () => {
        render(
            <Button loading leftIcon={<span data-testid="left-icon">L</span>}>
                Click
            </Button>
        );
        expect(screen.queryByTestId("left-icon")).not.toBeInTheDocument();
    });

    it("applies custom className", () => {
        render(<Button className="custom-class">Click</Button>);
        expect(screen.getByRole("button").className).toContain("custom-class");
    });
});
