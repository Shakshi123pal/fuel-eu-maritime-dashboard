# Reflection — FuelEU Maritime Compliance Dashboard

This project was built using AI-assisted development (GitHub Copilot / ChatGPT) alongside traditional coding practices. It summarizes what I learned, how AI impacted the workflow, and how errors were addressed.

## 1. What I learned using AI tools

- AI tools are excellent for scaffolding repetitive code (e.g., repositories, services, adapters) and generating consistent patterns across the frontend and backend.
- They help me think through architectural decisions quickly, particularly when mapping hexagonal architecture concepts into concrete code structures.
- AI can provide multiple implementation ideas rapidly, but the final design decision still requires human judgment and validation.

## 2. How AI improved development speed

- Generated boilerplate code (Express routes, Prisma repository layer, React components) significantly reduced setup time.
- Saved time on UI layout by producing Tailwind + React patterns for tables, forms, and tabs.
- Allowed me to iterate quickly through API designs and UI interactions without hand-coding every line.

## 3. Challenges faced with AI-generated code

- Generated code sometimes contained incorrect assumptions (e.g., incorrect Prisma field names like `shipId` vs `ship_id`).
- Some business logic (pooling / banking rules) required close review to ensure compliance rules were correctly enforced.
- AI may produce working code, but the semantics and edge-cases must be validated manually.

## 4. How errors were debugged and corrected

- Used logs and failing API responses to identify issues (e.g., Prisma query errors, bad request payloads).
- Debugging often required tracing through the hexagonal layers to find where domain values did not match persistence field names.
- Quick iteration was done by using Postman/curl and running unit tests to confirm behavior after changes.

## 5. Future improvements

- Add stronger input validation and clearer error response structures in the backend.
- Introduce automated end-to-end tests (e.g., Cypress) to validate the frontend / backend workflow.
- Enhance the UI with better user feedback (toasts, loading indicators) and persistence of selections.

---

Overall, AI assistance accelerated development significantly, but effective results required consistent validation and correction of generated output. The combination of AI scaffolding and human verification produced a clean, maintainable implementation for this assignment.