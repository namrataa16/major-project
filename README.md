# ONGO — The Digital Operating System for Road Transport Businesses

> **"One platform to run your fleet."**  
> *"Not just the shortest route. The right route for your vehicle."*

ONGO is a B2B SaaS/ERP-style platform engineered for small and medium-sized road transport and fleet operators. It centralizes fleet tracking, trip dispatches, cargo loads, expense reconciliation, RTO compliance documents, and enterprise customer invoicing.

---

## 🚀 Key Differentiator: Vehicle-Aware Route Intelligence

Traditional navigation systems only optimize for the shortest distance or standard car traffic. 
A route can be geographically shorter but feature steep ghat gradients, poor road surfaces, and severe elevation changes that increase gear shifting, double clutch strain, and cause higher fuel consumption in heavy trucks.

ONGO dynamically scores routes across 6 weighted parameters:
- **Fuel Cost Burden (25%)**
- **Travel Time & Speed (20%)**
- **Road Quality & Pavement (15%)**
- **Terrain & Elevation Gradient (15%)**
- **Vehicle Specification & Payload Fit (15%)**
- **FASTag Tolls (10%)**

### Corridor Example: Mumbai ➔ Pune (18T Payload on Ashok Leyland 2820)
- **Route A (Old NH4 / Bhor Ghat)**: 120 km • 3h 50m • Fuel ₹2,950 • Toll ₹420 • Terrain: High (8.2% grade) • Score: `71/100`
- **Route B (Expressway Corridor)**: 135 km • 3h 35m • Fuel ₹2,700 • Toll ₹510 • Terrain: Low (3.8% grade) • Score: `89/100` — **RECOMMENDED**
- **Route C (Karjat / Kamshet Bypass)**: 128 km • 4h 05m • Fuel ₹3,050 • Toll ₹350 • Terrain: Medium • Score: `64/100`

> **Takeaway:** Route B is 11% longer in distance, but saves an estimated **8% in total operating cost** and prevents severe powertrain wear.

---

## 🛠 Tech Stack

- **Framework:** React 18 with TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS (Modern Slate & Emerald Design System)
- **Icons:** Lucide React
- **Charts & Data Viz:** Recharts
- **Routing:** React Router v6
- **State Management:** React Context with LocalStorage persistence

---

## 📦 Features Included

1. **Command Center Dashboard (`/dashboard`)**: Live KPIs (Revenue, Cost, Profit, Utilization), Western corridor live SVG telemetry map, urgent compliance alerts, and financial performance trajectory.
2. **Fleet Management (`/fleet`)**: 24 commercial Indian vehicles (Ashok Leyland, Tata Motors, BharatBenz, Eicher) with filters, search, and Add Vehicle modal.
3. **Vehicle Telemetry & Unit Economics (`/fleet/:vehicleId`)**: Detailed profile for `MH 04 AB 2847`, driver info, documents checklist, maintenance log, and monthly profitability charts.
4. **Load Board & AI Vehicle Matching (`/loads`)**: Consignment load board with dynamic vehicle matching scoring drawer (e.g. 96% match for `LD-1045`).
5. **Route Intelligence Engine (`/route-intelligence`)**: Interactive route comparison, terrain gradient cross-section, and customizable matrix weight fine-tuning.
6. **Trips & Tracking (`/trips` & `/trips/:tripId`)**: Live dispatch tracking, status progression (`Planned` ➔ `Loading` ➔ `On Route` ➔ `Delivered`), and trip profit reconciliation.
7. **Expense Management (`/expenses`)**: Fuel, FASTag tolls, driver advances, maintenance expenses, and corridor profitability analysis.
8. **Fleet Compliance & Documents (`/documents`)**: RTO fitness, insurance, PUC, and national permits with automated expiry countdowns and warning badges.
9. **Enterprise Customers & Billing (`/customers` & `/customers/:customerId`)**: Accounts for Tata Steel, Reliance, Mahindra Logistics, Asian Paints, L&T, plus GST invoice creation.
10. **Executive BI Analytics (`/analytics`)**: Empty running ratio (8.2%), fuel efficiency by vehicle class, fleet utilization index, and vehicle profitability leaderboard.

---

## ⚡ Getting Started Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run production build & type check
npm run build

# Preview production build
npm run preview
```

Open [http://localhost:5173/](http://localhost:5173/) in your browser and click **"1-Click Instant Demo Access"** to explore.

---

## 🏢 Demo Organization
- **Company:** Rajesh Transport Services
- **User:** Rajesh Sharma (*Fleet Operations Manager*)
- **Corridor Focus:** Maharashtra & Gujarat Freight Network (*Mumbai, Thane, Bhiwandi, Pune, Nashik, Surat*)
