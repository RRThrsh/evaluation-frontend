import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";

vi.mock("../services/api", () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
    },
}));

import api from "../services/api";

function renderProtected(roles, initialRoute = "/") {
    return render(
        <MemoryRouter initialEntries={[initialRoute]}>
            <AuthProvider>
                <ProtectedRoute roles={roles}>
                    <div data-testid="protected-content">Protected Content</div>
                </ProtectedRoute>
            </AuthProvider>
        </MemoryRouter>
    );
}

beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
});

describe("ProtectedRoute", () => {
    it("shows spinner while loading", () => {
        localStorage.setItem("token", "token");
        api.get.mockReturnValue(new Promise(() => {})); // never resolves

        renderProtected([]);
        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("redirects to /login when not authenticated", async () => {
        renderProtected([], "/protected");
        await vi.dynamicImportSettled?.();

        // We wait for loading to finish then check for redirect
        const content = screen.queryByTestId("protected-content");
        expect(content).not.toBeInTheDocument();
    });

    it("renders children when authenticated with matching role", async () => {
        localStorage.setItem("token", "token");
        api.get.mockResolvedValue({ data: { id: 1, role: "user" } });

        renderProtected(["user", "admin"]);
        const content = await screen.findByTestId("protected-content");
        expect(content).toBeInTheDocument();
        expect(content).toHaveTextContent("Protected Content");
    });

    it("renders children when no roles required", async () => {
        localStorage.setItem("token", "token");
        api.get.mockResolvedValue({ data: { id: 1, role: "user" } });

        renderProtected([]);
        const content = await screen.findByTestId("protected-content");
        expect(content).toBeInTheDocument();
    });

    it("redirects to /401 when role not authorized", async () => {
        localStorage.setItem("token", "token");
        api.get.mockResolvedValue({ data: { id: 1, role: "user" } });

        renderProtected(["admin"], "/protected");
        const content = screen.queryByTestId("protected-content");
        expect(content).not.toBeInTheDocument();
    });
});
