# Agent Workflow — FuelEU Maritime Full-Stack Assignment

## 1. Agents Used

- **Primary Agent (GitHub Copilot)**
  - Leveraged for most code generation, architecture guidance, refactoring, and implementing requested features.
  - Used to directly generate and adjust backend services, Prisma schemas, API routes, and frontend UI components.

## 2. Prompts & Outputs

### Backend
- **Prompt**: "Implement FuelEU Maritime banking logic in Node.js/TypeScript with Prisma and Express. Should include banking endpoint + compliance calculation."  
  **Output**: Generated `BankingService`, `PrismaBankingRepository`, and Express routes (`/banking/bank`, `/banking/apply`).

- **Prompt**: "Create pooling logic for FuelEU Maritime; ensure pool rules enforce non-negative total CB and fair transfer."  
  **Output**: Implemented `PoolingService`, controller for `/pools`, and persisted pools in Prisma.

### Frontend
- **Prompt**: "Create a minimal React + TypeScript + Tailwind dashboard with four tabs: Routes, Compare, Banking, Pooling."  
  **Output**: Generated `App.tsx`, `NavBar.tsx`, and stub tab components.

- **Prompt**: "Implement the Routes tab to fetch from GET /routes and show a table with a Set Baseline button."  
  **Output**: Completed `RoutesTab.tsx` with Axios calls, table display, and baseline actions.

- **Prompt**: "Implement the Banking tab to fetch compliance balance and bank surplus."  
  **Output**: Completed `BankingTab.tsx` with inputs, API calls, and results display.

## 3. Validation / Corrections

- **API Verification (Postman / curl)**
  - Verified endpoints such as `/routes`, `/routes/:id/baseline`, `/compliance/cb`, `/banking/bank`, and `/pools` returned expected objects.
  - Used HTTP requests to confirm the server responses and validate request/response schemas.

- **Debugging & Fixes**
  - Corrected Prisma query errors due to wrong field naming (`shipId` vs `ship_id`).
  - Added proper request validation and error handling in controllers (e.g., checking request body structure, returning helpful error messages).
  - Fixed backend logic where the pooling controller passed an incorrect object to the compliance repository.

## 4. Observations

### Where AI Helped
- Quickly scaffolded the backend architecture and generated service / repository layers adhering to hexagonal design.
- Produced consistent, reusable UI patterns with Tailwind for components and tables.
- Accelerated Prisma schema creation and repository wiring.

### Where AI Fell Short
- Occasionally generated incorrect field names (e.g., Prisma `ship_id` vs domain `shipId`), requiring manual correction.
- Initial pooling controller had a type mismatch that caused runtime errors; required review to ensure correct parameter usage.
- Some advanced business rules (e.g., CB transfer fairness and edge-case validation) needed human validation and adjustment.

## 5. Best Practices Followed

- **Hexagonal Architecture**
  - Clear separation between adapters (HTTP + Prisma) and application core (services + domain logic).
  - Defined ports (interfaces) for repositories and injected them into services.

- **API Design**
  - RESTful endpoints with predictable behavior and clear status codes.
  - Consistent use of DTOs and response shapes.

- **Frontend Structure**
  - Functional React components with clean state management and side effects.
  - Tailwind utility classes for consistent styling.
  - Axios used for API calls with error handling.

- **Verification & Testing**
  - Backend unit/integration tests covering key service behavior (baseline switching, comparison, banking validation, pooling rules).
  - Manual verification using Postman/curl to ensure end-to-end correctness.

---

*This document is designed for review by senior engineers and reflects an approach where AI-assisted development is augmented with careful validation, error correction, and architectural discipline.*
