import { setupServer } from "msw/node";
import { handlers } from "./handlers";

// Eksport serwera dla MSW w środowisku Node.js
export const server = setupServer(...handlers);
