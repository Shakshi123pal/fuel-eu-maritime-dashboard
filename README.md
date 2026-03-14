# FuelEU Maritime Compliance Dashboard

A full-stack dashboard for the **FuelEU Maritime** compliance workflow. This project includes:

- **Routes dashboard** (view and manage routes)
- **Route comparison** (baseline vs. other routes)
- **Compliance balance calculation** (CB gCO₂e per ship/year)
- **Banking surplus** (bank excess compliance credits)
- **Pooling compliance balances** (balance across a pool of ships)


## Overview

This project demonstrates a real-world compliance workflow for maritime shipping under the FuelEU regulation. The backend provides APIs for computing compliance balances, banking, and pooling; the frontend provides a clean dashboard UI to interact with the backend.



##  Architecture (Hexagonal)

The backend follows a **hexagonal (ports & adapters)** architecture:

- **Core / Domain**: Business rules, domain models, and services.
- **Ports** (interfaces): Define repository contracts.
- **Adapters**:
  - **Inbound**: Express HTTP controllers expose REST APIs.
  - **Outbound**: Prisma repositories implement persistence.

This architecture ensures the business logic is decoupled from frameworks and allows easy substitution of infrastructure components.

##  Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, Axios
- **Backend**: Node.js, TypeScript, Express, Prisma, PostgreSQL
- **Database**: PostgreSQL


## ⚙️ Setup Instructions

### Prerequisites

- Node.js (>= 18)
- PostgreSQL (local or remote)
- npm or yarn

---

### Backend Setup

1. **Install dependencies**

```bash
cd backend
npm install
```

2. **Configure database**

Create a `.env` file in `backend/` with:

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/fueleu
```

3. **Run migrations & seed data**

```bash
cd backend
npx prisma migrate dev --name init
npx prisma db seed
```

4. **Run backend server**

```bash
cd backend
npm run dev
```

The backend will run at **http://localhost:3000**.

---

### Frontend Setup

1. **Install dependencies**

```bash
cd frontend
npm install
```

2. **Run development server**

```bash
cd frontend
npm run dev
```

The frontend will run at **http://localhost:5173** (default Vite port).


## 🧩 API Endpoints

### Routes

- `GET /routes` — list all routes
- `POST /routes/:id/baseline` — set a route as the baseline
- `GET /routes/comparison` — compare all routes vs baseline

### Compliance

- `GET /compliance/cb?shipId={id}&year={year}` — compute compliance balance
- `GET /compliance/adjusted-cb?shipId={id}&year={year}` — compliance + bank balance

### Banking

- `POST /banking/bank` — bank surplus compliance credits
- `POST /banking/apply` — apply banked credits to compliance

### Pooling

- `POST /pools` — create a pooling group and allocate CB across members


## ▶️ Running the Project

1. Start the backend

```bash
cd backend
npm run dev
```

2. Start the frontend

```bash
cd frontend
npm run dev
```

3. Open the frontend in your browser:

```
http://localhost:5173
```


## ✅ Running Tests

### Backend tests

```bash
cd backend
npm test
```

The backend includes unit/integration tests that cover route comparison, compliance calculation, banking rules, and pooling rules.




**FuelEU Maritime Compliance Dashboard** is designed to be extendable, testable, and easy to integrate into larger compliance tooling.
