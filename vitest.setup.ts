import "@testing-library/jest-dom";
import { afterAll, afterEach, beforeAll } from "vitest";
import { cleanup } from "@testing-library/react";
import { server } from "./src/__tests__/mocks/node";

// Uruchomienie serwera MSW przed wszystkimi testami
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

// Automatycznie czyść po każdym teście
afterEach(() => {
  cleanup();
  server.resetHandlers();
});

// Zamknięcie serwera po wszystkich testach
afterAll(() => server.close());
