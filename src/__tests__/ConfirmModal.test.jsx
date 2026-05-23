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

  it("has default confirm label 'Confirm'", () => {
    render(<ConfirmModal title="Test" message="Msg" onConfirm={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByText("Confirm")).toBeInTheDocument();
  });

  it("has default cancel label 'Cancel'", () => {
    render(<ConfirmModal title="Test" message="Msg" onConfirm={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("calls onConfirm when confirm clicked", async () => {
    const onConfirm = vi.fn();
    render(<ConfirmModal title="Test" message="Msg" onConfirm={onConfirm} onCancel={vi.fn()} />);
    await userEvent.click(screen.getByText("Confirm"));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when cancel clicked", async () => {
    const onCancel = vi.fn();
    render(<ConfirmModal title="Test" message="Msg" onConfirm={vi.fn()} onCancel={onCancel} />);
    await userEvent.click(screen.getByText("Cancel"));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("applies custom confirm color via confirmVariant", () => {
    render(<ConfirmModal title="Test" message="Msg" confirmVariant="danger" onConfirm={vi.fn()} onCancel={vi.fn()} />);
    const confirmBtn = screen.getByText("Confirm");
    expect(confirmBtn.className).toContain("btn-danger");
  });
});
