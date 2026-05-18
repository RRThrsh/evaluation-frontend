import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ErrorBoundary from "../components/common/ErrorBoundary";

function Bomb({ shouldThrow }) {
  if (shouldThrow) throw new Error("Boom!");
  return <div data-testid="safe">All good</div>;
}

describe("ErrorBoundary", () => {
  it("renders children when no error", () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">Content</div>
      </ErrorBoundary>
    );
    expect(screen.getByTestId("child")).toHaveTextContent("Content");
  });

  it("renders fallback UI on error", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Boom!")).toBeInTheDocument();
    expect(screen.getByText("Reload Page")).toBeInTheDocument();
    expect(screen.getByText("Go Home")).toBeInTheDocument();

    vi.restoreAllMocks();
  });

  it("renders fallback UI when child throws after initial render", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    const { rerender } = render(
      <ErrorBoundary>
        <Bomb shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByTestId("safe")).toHaveTextContent("All good");

    rerender(
      <ErrorBoundary>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();

    vi.restoreAllMocks();
  });
});
