import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InputField from "../components/common/inputfield/InputField";

describe("InputField", () => {
    it("renders label text", () => {
        render(<InputField label="Email" name="email" />);
        expect(screen.getByText("Email")).toBeInTheDocument();
    });

    it("does not render label when not provided", () => {
        render(<InputField name="email" />);
        expect(screen.queryByText("label")).not.toBeInTheDocument();
    });

    it("renders input with correct name", () => {
        render(<InputField name="email" />);
        expect(screen.getByRole("textbox")).toHaveAttribute("name", "email");
    });

    it("renders placeholder text", () => {
        render(<InputField name="test" placeholder="Enter text" />);
        expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
    });

    it("passes value correctly", () => {
        render(<InputField name="test" value="hello" onChange={() => {}} />);
        expect(screen.getByRole("textbox")).toHaveValue("hello");
    });

    it("calls onChange when typing", async () => {
        const onChange = vi.fn();
        render(<InputField name="test" onChange={onChange} />);
        await userEvent.type(screen.getByRole("textbox"), "a");
        expect(onChange).toHaveBeenCalled();
    });

    it("toggles password visibility", async () => {
        render(<InputField label="Password" name="pwd" type="password" />);

        const input = document.querySelector('input[name="pwd"]');
        expect(input).toHaveAttribute("type", "password");

        await userEvent.click(screen.getByLabelText("Show password"));
        expect(input).toHaveAttribute("type", "text");

        await userEvent.click(screen.getByLabelText("Hide password"));
        expect(input).toHaveAttribute("type", "password");
    });
});
