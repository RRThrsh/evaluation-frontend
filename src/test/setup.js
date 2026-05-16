import "@testing-library/jest-dom/vitest";

class LocalStorageMock {
    constructor() {
        this.store = {};
    }
    getItem(key) {
        return this.store[key] ?? null;
    }
    setItem(key, value) {
        this.store[key] = String(value);
    }
    removeItem(key) {
        delete this.store[key];
    }
    clear() {
        this.store = {};
    }
    get length() {
        return Object.keys(this.store).length;
    }
    key(index) {
        return Object.keys(this.store)[index] ?? null;
    }
}

if (!window.localStorage || typeof window.localStorage.getItem !== "function") {
    const mock = new LocalStorageMock();
    Object.defineProperty(window, "localStorage", {
        value: mock,
        writable: true,
        configurable: true,
    });
}
