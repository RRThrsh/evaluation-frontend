import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConfirmModal from "../components/common/ConfirmModal";

describe("ConfirmModal", () => {
  it("renders title and message", () => {
    render(<ConfirmModal title="Delete?" message="Are you sure?" onConfirm={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByText("Delete?")).toBeInTheDocument();
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
  });

  it("renders extra text when provided", () => {
    render(<ConfirmModal title="Test" message="Msg" extra="Extra detail" onConfirm={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByText("Extra detail")).toBeInTheDocument();
  });

  it("renders custom confirm label", () => {
    render(<ConfirmModal title="Test" message="Msg" confirmLabel="Proceed" onConfirm={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByText("Proceed")).toBeInTheDocument();
  });

  it("has default confirm label 'Yes'", () => {
    render(<ConfirmModal title="Test" message="Msg" onConfirm={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByText("Yes")).toBeInTheDocument();
  });

  it("has default cancel label 'No'", () => {
    render(<ConfirmModal title="Test" message="Msg" onConfirm={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByText("No")).toBeInTheDocument();
  });

  it("calls onConfirm when confirm clicked", async () => {
    const onConfirm = vi.fn();
    render(<ConfirmModal title="Test" message="Msg" onConfirm={onConfirm} onCancel={vi.fn()} />);
    await userEvent.click(screen.getByText("Yes"));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when cancel clicked", async () => {
    const onCancel = vi.fn();
    render(<ConfirmModal title="Test" message="Msg" onConfirm={vi.fn()} onCancel={onCancel} />);
    await userEvent.click(screen.getByText("No"));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("applies custom confirm color", () => {
    render(<ConfirmModal title="Test" message="Msg" confirmColor="bg-red-600 hover:bg-red-700" onConfirm={vi.fn()} onCancel={vi.fn()} />);
    const confirmBtn = screen.getByText("Yes");
    expect(confirmBtn.className).toContain("bg-red-600");
  });
});
