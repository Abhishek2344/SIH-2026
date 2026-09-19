# smart-Mandi (स्मार्ट मंडी)
### Transparent Procurement & Commodity Intelligence Platform
**Developed for the Ministry of Consumer Affairs, Food & Public Distribution (Government of India)**  
*Smart India Hackathon (SIH 2026) Prototype Demonstration*

> **Disclaimer**: *Prototype / Demonstration — Not an Official Government Portal.*

---

## Executive Overview

Farmers across India often face debilitating bottlenecks at agricultural procurement centres (APMCs/Mandis), including **long waiting queues (often lasting 12–48 hours)**, **opacity in procurement scheduling**, **vulnerability to unauthorised handling charges/middlemen**, and **uncertainty regarding payment disbursement**.

Simultaneously, government authorities and the **Department of Consumer Affairs (DoCA)** require early market intelligence to detect supply deficits, farm-to-retail price spread anomalies, and storage imbalances before retail inflation strikes consumer households.

**smart-Mandi** bridges these gaps by establishing a trusted, end-to-end digital chain connecting:
1. **Farmers** (Crop declarations, bay slot reservations, live queue tokens, and digital vouchers)
2. **Procurement Centres** (Daily yard capacity management, electronic weighbridge integration, and assaying)
3. **Verified Commercial Buyers/Vendors** (Privacy-shielded macro district stock visibility and contract interests)
4. **District Authorities (DMO / Collectorate)** (Grievance investigations and anti-intermediary enforcement)
5. **Ministry of Consumer Affairs & Food Distribution** (National procurement telemetry, GIS capacity radar, and buffer stock redistribution)

---

## Core Product Features

### 1. Farmer Convenience & Queue Elimination
- **Slot Reservation**: Reserve bay intake hours based on real-time yard capacity (e.g., `23/30 available`, `FULL`).
- **Real-Time Queue Telemetry**: Live countdown tracker showing Assigned Token (e.g., `A-124`), Currently Serving Token (`A-113`), vehicles ahead, and estimated wait minutes (`~42 min`).
- **Audio & Visual Yard Alerts**: Broadcast chime when the farmer's trolley is called to Bay 3.
- **8-Stage Procurement Timeline**: From Slot Booked → Arrived → Quality Verified → Weighed → Procured → Payment Initiated → Processing → Credited.

### 2. Anti-Intermediary & Transparent Transaction Ledger
- **Strict Zero-Fee Policy**: Transparent fee ledger explicitly displays:
  $$\text{Government Procurement Price (MSP)} + \text{Authorised Charges (₹0)} = \text{Final Net Credited Amount}$$
- **Zero Plain-Text Aadhaar Storage**: Protects citizen privacy by retaining verification flags (`aadhaar_verification_status: 'Verified'`) rather than sensitive identity numbers.
- **Direct Benefit Transfer (DBT)**: Direct account settlement via PFMS mock UTR reference (`PFMS2026031900984128`).
- **Digital Procurement Receipt**: Digitally hashed, printable vouchers featuring dynamic QR codes linking to `/verify/:code`.
- **Citizen Grievance Cell**: Instant lodging of complaints regarding unauthorized handling charges, weight disputes, or payment delays.

### 3. Macro Stock Visibility Model (Section 6 Compliance)
- **Public & Vendor View**: Aggregated district-level volume (e.g., Jaipur: 1,250 quintals Wheat across 84 farmers; average 14.8 quintals/farmer).
- **Privacy Shield**: Anonymized farmer listings (e.g., `FMR-1024`, 12 Qtl Grade A Wheat) without exposing phone numbers, Aadhaar, bank details, or private home addresses.
- **Procurement Interest**: Commercial millers send official interest through the Mandi Board rather than directly contacting farmers privately.

### 4. Ministry & DoCA Commodity Intelligence
- **Essential Commodities Monitored**: Wheat, Rice, Onion, Potato, Tomato, Chana Dal, Mustard Oil.
- **Farm-to-Retail Price Spread Radar**: Tracks value chain markups: $\text{Farm Gate} \rightarrow \text{Wholesale APMC} \rightarrow \text{Consumer Retail}$.
- **Deterministic Anomaly Engine**: Detects statistically abnormal price surges ($\Delta > 15\%$) or arrival contractions without probabilistic ML hallucinations.
- **Supply Stress Detection**: Triangulates arrival contractions ($\downarrow 18\%$), storage drops ($\downarrow 12\%$), and price spikes ($\uparrow 14\%$) to generate early warning signals.
- **Government Buffer Stock Management**: Monitors FCI/CWC godown utilization and recommends inter-district stock redistribution.
- **Immutable Audit Trail**: System-wide logging of all price updates, queue advancements, transaction completions, and grievance resolutions with gateway IPs.

---

## 1-Click Evaluation Accounts (All 7 Roles)

To evaluate the platform during SIH demonstrations, use the **1-Click Role Switcher** in the top navigation bar:

| Role | Demo Identity | Station / Region | Primary View |
| :--- | :--- | :--- | :--- |
| **Farmer** | Ramesh Kumar | Bassi Rural, Jaipur | Slot Booking, Live Queue (`A-124`), Vouchers |
| **Verified Vendor** | Rajeev Singhania (AgriCorp) | Jaipur, Rajasthan | Aggregated Stocks, Procurement Interest |
| **Centre Operator** | Rajesh Sharma | Muhana Mandi, Jaipur | Yard Capacity, Token Queue Dispatcher, Weighment |
| **Quality Inspector** | Er. Alok Chouhan | Jaipur Mandi Bay 3 | Moisture %, Foreign Matter %, Grade A Assaying |
| **District Authority** | Dr. Sunita Meena (DMO) | District Collectorate, Jaipur | Mandi Congestion Radar, Grievance Cell |
| **Ministry Admin** | Sh. Arvind Varma (JS) | Krishi Bhavan, New Delhi | National Control Tower, DBT Velocity, Audit Trail |
| **DoCA Officer** | Central Market Intelligence | New Delhi | Essential Commodity Spreads, Supply Alerts |

---

## Technology Stack

- **Frontend Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS (Government design system palette: `#0b2238` Navy, `#133e66` Blue, `#f59e0b` Amber, `#15803d` Emerald)
- **Icons**: Lucide React
- **Data Visualizations**: Recharts (Volume velocity, payment clearance, price spread bars)
- **Geographic Mapping**: Leaflet & Vector GIS Mandi Radar
- **Database**: PostgreSQL 15 via Supabase (DDL in `supabase/schema.sql`, realistic Indian seed data in `supabase/seed.sql`)
- **Dual Data Engine**: Automatic fallback to local reactive in-memory engine when running offline or without Supabase credentials.

---

## Quickstart & Local Setup

### Prerequisites
- Node.js 18+ (tested on Node.js v24.15.0)
- npm 9+

### 1. Clone & Install
```bash
git clone <repository-url>
cd "d:/Smart Mandi"
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```env
# Optional: Remote Supabase project credentials
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Mode Configuration
VITE_ENABLE_MOCK_FALLBACK=true
VITE_PORTAL_NAME=smart-Mandi
VITE_PORTAL_SUBTITLE=Transparent Procurement & Commodity Intelligence Platform
VITE_PORTAL_AUTHORITY=Ministry of Consumer Affairs, Food & Public Distribution
```
> *Note*: If remote Supabase credentials are not provided, the platform automatically boots into stateful **Local Evaluation Mode** with realistic Indian market datasets pre-loaded.

### 3. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
npm run preview
```

---

## Supabase Database Setup (Production Mode)

If deploying to a live Supabase project:
1. Create a new project on [Supabase.com](https://supabase.com).
2. Navigate to the **SQL Editor** in your Supabase dashboard.
3. Execute the schema script: `supabase/schema.sql`.
   - Creates 24 tables with UUID primary keys, foreign keys, and indexes.
   - Enables Row-Level Security (RLS) on all tables with strict access policies.
4. Execute the seed data script: `supabase/seed.sql`.
   - Populates crops (Wheat, Paddy, Mustard, etc.), APMC procurement centres, initial queue state, DoCA price feeds, and buffer stocks.
5. In your project settings, copy **Project URL** and **anon public key** into your `.env` file.

> **Security Warning**: NEVER commit or expose the Supabase `service_role` key in frontend application code.

---

## The SIH Benchmark Walkthrough Scenario

To demonstrate the full end-to-end synchronized lifecycle in 60 seconds:
1. Click **"Run Benchmark Scenario"** in the top ribbon.
2. The system loads **Ramesh Kumar** (Farmer `FMR-RJ-2026-1024`), booking 12 Quintals of Wheat at Jaipur Central Mandi.
3. Switch to **Centre Operator** role: Token `A-124` appears in the live queue. Advance it through `CALLED` $\rightarrow$ `IN_VERIFICATION` $\rightarrow$ `WEIGHING` $\rightarrow$ `Complete Intake`.
4. Enter Gross weight (13,240 kg) and Tare (12,040 kg), confirming 12.0 Quintals net weight at MSP ₹2,425/Qtl ($\text{Gross} = \text{₹29,100}$, $\text{Deductions} = \text{₹0.00}$).
5. The system automatically issues Digital Receipt `TXN-2026-00124` with verification code `AS-VFY-2026-99128` and credits payment via DBT.
6. Open **Verify Receipt** on the public navigation bar to test QR verification.
7. Switch to **DoCA Price & Market** to inspect the Tomato price surge and recommended buffer stock redistribution from Punjab to Eastern warehouses.
8. Switch to **Ministry Control Tower** to view the live update on national MT procured and the immutable audit log entry.

---

## Prototype Limitations & Future Roadmap

1. **SMS Gateway**: Simulated in-app and console notification gateway. In production, connect to CDAC / NIC SMS Gateway.
2. **Weighbridge Hardware**: Automated via electronic input dialog. In production, connect directly to RS-232 / IoT weighbridge digital scale indicators.
3. **Biometrics**: Aadhaar authentication is simulated using standard status verification flags (`aadhaar_verification_status`) to strictly preserve citizen privacy.
4. **Offline Sync**: PWA caching ready for intermittent rural connectivity.

---

## License & Intellectual Property

Prepared for **Smart India Hackathon (SIH 2026)**. Prototype intellectual property belongs to the contributing development team under the academic demonstration terms of the Ministry of Consumer Affairs, Food & Public Distribution.
