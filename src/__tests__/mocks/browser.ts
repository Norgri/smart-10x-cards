import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// Eksport workera dla MSW
export const worker = setupWorker(...handlers);
