# Smart Farmer Procurement & Queue Management Platform
> **Smart India Hackathon (SIH 2026)** — Real-Time Digital Mandi Slot Booking, Token Queue & DBT Platform

---

## Overview

The **Smart Farmer Procurement & Queue Management Platform** addresses the critical agricultural supply-chain problem of long waiting times, lack of slot visibility, and payment uncertainty at state procurement centres (mandis).

By replacing physical queues with an automated digital appointment system, farmers receive **unique sequential queue tokens**, track their **live queue position via WebSockets** in real-time, inspect their **certified crop weight & moisture receipts**, and track **Direct Benefit Transfer (DBT) payments** credited directly to their bank accounts.

---

## User Roles & Capabilities

| Role | Access | Key Capabilities |
|---|---|---|
| **Farmer** | `/dashboard`, `/book-slot`, `/live-queue`, `/my-bookings`, `/payments` | Register with Farmer ID, select mandi, book arrival slot, receive token pass, watch live queue without reload, view MSP receipts & DBT bank payments, English/हिन्दी toggle. |
| **Procurement Staff** | `/staff/dashboard` | View today's queue, call next farmer, start inspection/weighbridge check, record crop quantity & moisture %, auto-advance queue on completion, disburse DBT payments with UTR, manage slots. |
| **Super Admin** | `/admin/dashboard` | National oversight KPIs, total farmers, total centres, active queue bottlenecks, total disbursed ₹, centre-wise analytics, user activation/deactivation, staff provisioning, audit reports. |

---

## Tech Stack

### Frontend
- **Framework**: React.js 19 + Vite
- **Styling**: Tailwind CSS (Farmer-friendly high-contrast earth & emerald visual system)
- **Routing**: React Router v7
- **HTTP Client**: Axios (with Bearer token request & 401 response interceptors)
- **Real-Time**: Native WebSocket client with auto-reconnect & heartbeat ping
- **Icons**: Lucide React
- **Maps**: Leaflet + OpenStreetMap interactive mapping
- **i18n**: Built-in bilingual switch (English / हिन्दी)

### Backend
- **Framework**: Python 3.14 + FastAPI
- **Database ORM**: SQLAlchemy 2.0
- **Validation**: Pydantic v2
- **Security**: JWT Authentication (`PyJWT`) + `Bcrypt` password hashing
- **Real-Time Engine**: WebSockets broadcast hub (`/ws/queue/{centre_id}` and `/ws/farmer/{user_id}`)
- **Testing**: Pytest + HTTPX

### Database
- **Primary**: PostgreSQL (DDL schemas, constraints, indexes in `database/schema.sql`)
- **Zero-Config Dev**: Automated SQLite fallback (`smart_farmer.db`) for immediate testing without requiring an active PostgreSQL daemon
- **Containerization**: `database/docker-compose.yml` for 1-command PostgreSQL setup

---

## Project Structure

```
d:\SIH 2026/
├── backend/
│   ├── app/
│   │   ├── config.py                 # App settings & environment variables
│   │   ├── database.py               # SQLAlchemy engine & session factory
│   │   ├── main.py                   # FastAPI app, CORS, error handler, startup
│   │   ├── models/                   # Database ORM models
│   │   │   ├── user.py               # User, Farmer, Staff
│   │   │   ├── centre.py             # Procurement Centre
│   │   │   ├── slot.py               # Capacity-managed Slots
│   │   │   ├── booking.py            # Unique token bookings
│   │   │   ├── queue.py              # Real-time queue entries
│   │   │   ├── procurement.py        # Quality, moisture, MSP receipts
│   │   │   ├── payment.py            # DBT payouts & UTR
│   │   │   └── notification.py       # Alerts & reminders
│   │   ├── schemas/                  # Pydantic v2 schemas
│   │   ├── routes/                   # REST API routes & WebSockets
│   │   │   ├── auth.py               # /api/auth/register, /api/auth/login
│   │   │   ├── centres.py            # /api/centres
│   │   │   ├── slots.py              # /api/slots
│   │   │   ├── bookings.py           # /api/bookings
│   │   │   ├── queue.py              # /api/queue, /call-next
│   │   │   ├── procurement.py        # /api/procurement
│   │   │   ├── payments.py           # /api/payments
│   │   │   ├── notifications.py      # /api/notifications
│   │   │   ├── staff.py              # /api/staff/...
│   │   │   ├── admin.py              # /api/admin/...
│   │   │   └── websocket.py          # /ws/queue/{centre_id}, /ws/farmer/{user_id}
│   │   ├── services/                 # Business logic & queue engine
│   │   │   ├── queue_service.py      # Waiting time logic & auto progression
│   │   │   ├── token_service.py      # Sequential duplicate-safe token generation
│   │   │   ├── notification_service.py
│   │   │   └── websocket_manager.py  # WebSocket broadcast hub
│   │   ├── middleware/
│   │   │   └── auth.py               # Role authorization dependencies
│   │   └── utils/
│   │       ├── security.py           # Bcrypt & JWT utils
│   │       └── seed_data.py          # Pre-seeded test users, mandis, and queue
│   ├── tests/                        # Pytest automated test suite
│   ├── verify_e2e.py                 # Full end-to-end integration test
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/               # Navbar, Footer, ProtectedRoute, CentreMap, QueueBadge, StatusStepper
│   │   ├── context/                  # AuthContext, LanguageContext, WebSocketContext
│   │   ├── pages/                    # Home, Login, Register, Centres, BookSlot, LiveQueue,
│   │   │                             # FarmerDashboard, MyBookings, ProcurementTracking, PaymentTracking,
│   │   │                             # Notifications, Profile, StaffDashboard, AdminDashboard
│   │   ├── services/                 # Axios client
│   │   └── utils/                    # English & Hindi translation dictionaries
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── database/
│   ├── init.sql                      # Database initialization
│   ├── schema.sql                    # PostgreSQL table definitions, DDL, constraints
│   └── docker-compose.yml            # 1-command Docker container for PostgreSQL
└── README.md
```

---

## Test Credentials (Pre-seeded Demo Accounts)

The platform comes pre-seeded with active data. On the login screen, click any of the **1-Click Demo Buttons** or enter these credentials:

| Role | Username / Mobile | Password | Notes |
|---|---|---|---|
| **Farmer (Ramesh Kumar)** | `9876543210` *(or Farmer ID: `FID-2026-001`)* | `Farmer@123` | Has active booking (Token `TK-103`) in live queue |
| **Procurement Staff** | `staff.centre1@gov.in` *(or Mobile: `8888888888`)* | `Staff@123` | Assigned to Khanna Grain Market Mandi |
| **Super Admin** | `admin@gov.in` *(or Mobile: `9999999999`)* | `Admin@123` | Full administrative oversight & analytics |

---

## Quickstart: How to Run Locally

### Prerequisites
- Python 3.10+ (tested on Python 3.14)
- Node.js 18+ & npm
- Git

---

### Step 1: Backend Setup

1. Open terminal in `backend/`:
   ```bash
   cd backend
   ```
2. Create and activate virtual environment:
   - **Windows PowerShell**:
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```
   - **Linux / macOS**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```
3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI backend server:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
   > *The database tables and demo test records are automatically seeded on first launch!*

---

### Step 2: Frontend Setup

1. Open another terminal in `frontend/`:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
4. Open your browser at **`http://localhost:5173`**.

---

## PostgreSQL Database Setup (Optional)

If you prefer running a dedicated PostgreSQL server instead of the zero-config SQLite mode:

### Option A: Using Docker Compose (Recommended)
From the `database/` directory:
```bash
cd database
docker compose up -d
```

### Option B: Using Local PostgreSQL Service
1. Create the database:
   ```sql
   CREATE DATABASE smart_farmer;
   ```
2. Run `database/schema.sql` against your PostgreSQL server:
   ```bash
   psql -U postgres -d smart_farmer -f database/schema.sql
   ```
3. Update `DATABASE_URL` in `backend/.env`:
   ```env
   DATABASE_URL=postgresql://postgres:postgrespassword@localhost:5432/smart_farmer
   ```

---

## Running Automated Tests

### 1. Pytest Backend Test Suite
From `backend/`:
```bash
pytest -v
```
Verifies:
- Health check
- Farmer registration & validation
- JWT login & role authentication
- Centres listing
- Slot availability calculation
- My bookings retrieval
- Live queue snapshot
- Estimated wait time calculation
- Unauthorized action blocking (403 Forbidden)

### 2. End-to-End Verification Test
From project root or `backend/`:
```bash
python backend/verify_e2e.py
```
Performs a live end-to-end integration flow across:
`Register Farmer -> Book Slot -> Receive Token -> Check Waiting Time -> Staff Call Next -> Complete Procurement (₹) -> Disburse DBT Payment (UTR) -> Super Admin KPIs`.

---

## Interactive API Documentation

Once the backend is running, browse interactive Swagger & OpenAPI documentation at:
- **Swagger UI**: [http://localhost:8000/api/docs](http://localhost:8000/api/docs)
- **ReDoc**: [http://localhost:8000/api/redoc](http://localhost:8000/api/redoc)

---

## Real-Time Queue & WebSocket Engine

- **Mandi Queue Feed**: `ws://localhost:8000/ws/queue/{centre_id}`
- **Farmer Personal Alerts**: `ws://localhost:8000/ws/farmer/{user_id}`

### Automatic Queue Progression Logic
1. When staff marks the current serving token (e.g., `TK-102`) as **Completed**:
2. The next waiting token in line (e.g., `TK-103`) automatically transitions to **Serving**.
3. A WebSocket update event `QUEUE_UPDATED` is broadcasted immediately to all connected browsers.
4. The farmer's browser rings an audio chime and advances their status stepper from *Waiting* to *Serving* without refreshing the page!

### Waiting Time Formula
$$\text{Estimated Waiting Time (minutes)} = \text{Farmers Ahead in Line} \times \text{Average Processing Time (default: 15 min)}$$
*Encapsulated modularly in `app/services/queue_service.py` to allow direct drop-in replacement with AI/ML arrival prediction models.*

---

## License & SIH 2026 Submission
Developed for **Smart India Hackathon (SIH 2026)**.
All code, models, and real-time WebSocket implementations are production-grade and fully functional.
