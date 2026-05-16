import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "../context/AuthContext";

const mockUser = { id: 1, name: "Test", email: "test@test.com", role: "user" };

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

function TestComponent() {
    const auth = useAuth();
    return (
        <div>
            <div data-testid="loading">{auth.loading.toString()}</div>
            <div data-testid="user">{auth.user ? JSON.stringify(auth.user) : "null"}</div>
            <button data-testid="login-btn" onClick={() => auth.login("a@b.com", "pwd")}>Login</button>
            <button data-testid="register-btn" onClick={() => auth.register({ email: "a@b.com", password: "pwd", name: "A" })}>Register</button>
            <button data-testid="forgot-btn" onClick={() => auth.forgotPassword("a@b.com")}>Forgot</button>
            <button data-testid="logout-btn" onClick={auth.logout}>Logout</button>
            <button data-testid="update-btn" onClick={() => auth.updateProfile({ name: "New" })}>Update</button>
        </div>
    );
}

function renderWithProvider() {
    return render(
        <AuthProvider>
            <TestComponent />
        </AuthProvider>
    );
}

beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
});

describe("AuthContext", () => {
    it("shows no user when no token", async () => {
        renderWithProvider();
        await waitFor(() => {
            expect(screen.getByTestId("loading")).toHaveTextContent("false");
        });
        expect(screen.getByTestId("user")).toHaveTextContent("null");
    });

    it("fetches user when token exists", async () => {
        localStorage.setItem("token", "valid-token");
        api.get.mockResolvedValue({ data: mockUser });

        renderWithProvider();
        await waitFor(() => {
            expect(screen.getByTestId("loading")).toHaveTextContent("false");
        });
        expect(screen.getByTestId("user")).toHaveTextContent(JSON.stringify(mockUser));
    });

    it("clears invalid token on fetch failure", async () => {
        localStorage.setItem("token", "bad-token");
        api.get.mockRejectedValue(new Error("Unauthorized"));

        renderWithProvider();
        await waitFor(() => {
            expect(screen.getByTestId("loading")).toHaveTextContent("false");
        });
        expect(localStorage.getItem("token")).toBeNull();
        expect(screen.getByTestId("user")).toHaveTextContent("null");
    });

    it("login sets user and stores token", async () => {
        api.post.mockResolvedValue({ data: { token: "new-token", user: mockUser } });

        renderWithProvider();
        await waitFor(() => {
            expect(screen.getByTestId("loading")).toHaveTextContent("false");
        });

        await userEvent.click(screen.getByTestId("login-btn"));
        await waitFor(() => {
            expect(screen.getByTestId("user")).toHaveTextContent(JSON.stringify(mockUser));
        });
        expect(localStorage.getItem("token")).toBe("new-token");
    });

    it("register creates account and logs in", async () => {
        api.post.mockResolvedValueOnce({}); // register
        api.post.mockResolvedValueOnce({ data: { token: "reg-token", user: mockUser } }); // login after register

        renderWithProvider();
        await waitFor(() => {
            expect(screen.getByTestId("loading")).toHaveTextContent("false");
        });

        await userEvent.click(screen.getByTestId("register-btn"));
        await waitFor(() => {
            expect(screen.getByTestId("user")).toHaveTextContent(JSON.stringify(mockUser));
        });
        expect(localStorage.getItem("token")).toBe("reg-token");
        expect(api.post).toHaveBeenCalledTimes(2);
    });

    it("logout clears user and token", async () => {
        localStorage.setItem("token", "some-token");
        api.get.mockResolvedValue({ data: mockUser });

        renderWithProvider();
        await waitFor(() => {
            expect(screen.getByTestId("user")).toHaveTextContent(JSON.stringify(mockUser));
        });

        await userEvent.click(screen.getByTestId("logout-btn"));
        expect(screen.getByTestId("user")).toHaveTextContent("null");
        expect(localStorage.getItem("token")).toBeNull();
    });

    it("updateProfile updates user state", async () => {
        localStorage.setItem("token", "valid-token");
        api.get.mockResolvedValue({ data: mockUser });
        const updatedUser = { ...mockUser, name: "New" };
        api.put.mockResolvedValue({ data: updatedUser });

        renderWithProvider();
        await waitFor(() => {
            expect(screen.getByTestId("user")).toHaveTextContent(JSON.stringify(mockUser));
        });

        await userEvent.click(screen.getByTestId("update-btn"));
        await waitFor(() => {
            expect(screen.getByTestId("user")).toHaveTextContent(JSON.stringify(updatedUser));
        });
    });

    it("throws error if useAuth used outside provider", () => {
        const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
        expect(() => render(<TestComponent />)).toThrow(
            "useAuth must be used within an AuthProvider"
        );
        consoleSpy.mockRestore();
    });

    it("forgotPassword calls the API", async () => {
        api.post.mockResolvedValue({ message: "ok" });

        renderWithProvider();
        await waitFor(() => {
            expect(screen.getByTestId("loading")).toHaveTextContent("false");
        });

        await userEvent.click(screen.getByTestId("forgot-btn"));
        expect(api.post).toHaveBeenCalledWith("/api/auth/forgot-password", { email: "a@b.com" });
    });
});
