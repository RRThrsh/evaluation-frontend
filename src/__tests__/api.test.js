import { describe, it, expect, vi, beforeEach } from "vitest";
import api, { ApiError } from "../services/api";

beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
});

describe("api", () => {
    describe("get", () => {
        it("makes a GET request with correct headers", async () => {
            const mockData = { data: "hello" };
            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                status: 200,
                json: () => Promise.resolve(mockData),
            });

            const result = await api.get("/test");
            expect(result).toEqual(mockData);
            expect(global.fetch).toHaveBeenCalledWith(
                "/test",
                expect.objectContaining({
                    headers: { "Content-Type": "application/json" },
                })
            );
        });

        it("includes Authorization header when token exists", async () => {
            localStorage.setItem("token", "my-token");
            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                status: 200,
                json: () => Promise.resolve({}),
            });

            await api.get("/test-auth");
            expect(global.fetch).toHaveBeenCalledWith(
                "/test-auth",
                expect.objectContaining({
                    headers: expect.objectContaining({
                        Authorization: "Bearer my-token",
                    }),
                })
            );
        });

        it("throws ApiError on non-ok response", async () => {
            global.fetch = vi.fn().mockResolvedValue({
                ok: false,
                status: 400,
                json: () => Promise.resolve({ message: "Bad request" }),
            });

            await expect(api.get("/fail")).rejects.toThrow(ApiError);
            await expect(api.get("/fail")).rejects.toThrow("Bad request");
        });

        it("extracts error from data.error if no message", async () => {
            global.fetch = vi.fn().mockResolvedValue({
                ok: false,
                status: 500,
                json: () => Promise.resolve({ error: "Server error" }),
            });

            await expect(api.get("/fail")).rejects.toThrow("Server error");
        });

        it("throws ApiError with fallback message", async () => {
            global.fetch = vi.fn().mockResolvedValue({
                ok: false,
                status: 403,
                json: () => Promise.resolve({}),
            });

            await expect(api.get("/fail")).rejects.toThrow("Request failed (403)");
        });

        it("handles 204 no content", async () => {
            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                status: 204,
            });

            const result = await api.delete("/no-content");
            expect(result).toBeNull();
        });

        it("redirects on 429", async () => {
            const originalLocation = window.location;
            delete window.location;
            window.location = { href: "" };

            global.fetch = vi.fn().mockResolvedValue({
                ok: false,
                status: 429,
                json: () => Promise.resolve({ message: "Too many requests" }),
            });

            await expect(api.get("/rate-limit")).rejects.toThrow(ApiError);
            expect(window.location.href).toBe("/429");

            window.location = originalLocation;
        });
    });

    describe("post", () => {
        it("sends JSON body with POST method", async () => {
            const body = { name: "test" };
            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                status: 200,
                json: () => Promise.resolve({ id: 1 }),
            });

            const result = await api.post("/create", body);
            expect(result).toEqual({ id: 1 });
            expect(global.fetch).toHaveBeenCalledWith(
                "/create",
                expect.objectContaining({
                    method: "POST",
                    body: JSON.stringify(body),
                    headers: { "Content-Type": "application/json" },
                })
            );
        });
    });

    describe("put", () => {
        it("sends JSON body with PUT method", async () => {
            const body = { name: "updated" };
            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                status: 200,
                json: () => Promise.resolve({ id: 1 }),
            });

            await api.put("/update/1", body);
            expect(global.fetch).toHaveBeenCalledWith(
                "/update/1",
                expect.objectContaining({
                    method: "PUT",
                    body: JSON.stringify(body),
                    headers: { "Content-Type": "application/json" },
                })
            );
        });
    });

    describe("patch", () => {
        it("sends JSON body with PATCH method", async () => {
            const body = { name: "patched" };
            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                status: 200,
                json: () => Promise.resolve({}),
            });

            await api.patch("/patch/1", body);
            expect(global.fetch).toHaveBeenCalledWith(
                "/patch/1",
                expect.objectContaining({
                    method: "PATCH",
                    body: JSON.stringify(body),
                    headers: { "Content-Type": "application/json" },
                })
            );
        });
    });

    describe("delete", () => {
        it("makes a DELETE request", async () => {
            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                status: 204,
            });

            await api.delete("/delete/1");
            expect(global.fetch).toHaveBeenCalledWith(
                "/delete/1",
                expect.objectContaining({
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                })
            );
        });
    });
});
