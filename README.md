# StructureAI

**StructureAI** is an advanced, AI-powered Structural Health Monitoring (SHM) and Predictive Maintenance platform. It provides governments and infrastructure authorities with real-time analytics, 3D digital twins, live map telemetry, and predictive alerts to ensure the safety and longevity of critical infrastructure like bridges, flyovers, and public buildings.

## 🚀 Features
- **Real-Time Sensor Monitoring:** Live tracking of vibration, strain, temperature, and corrosion.
- **3D Digital Twins:** Interactive 3D visualization of infrastructure using React Three Fiber.
- **Predictive Analytics:** AI-driven anomaly detection and lifespan cost forecasting.
- **Geospatial Dashboard:** Interactive map monitoring with Leaflet.
- **Kanban Task Management:** Built-in workflow for inspectors and maintenance engineers.
- **Public Portal:** Transparent public-facing dashboard for citizens to view infrastructure safety metrics without requiring credentials.

## 💻 Tech Stack
- **Frontend:** React 18, TypeScript, Vite, TailwindCSS, Framer Motion, Recharts, React-Leaflet, Three.js
- **Backend:** Node.js, Express, Socket.IO (for real-time updates)
- **Database:** MongoDB (Mongoose)

## 🛠️ Local Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Local instance or MongoDB Atlas cluster)

### 1. Clone the Repository
```bash
git clone https://github.com/naren214/Hackverse_Hackathon2026.git
cd Hackverse_Hackathon2026
```

### 2. Backend Setup
```bash
cd Backend
npm install
```
- Create a `.env` file in the `Backend` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/structureai
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_key
```
- **Seed the Database** with real-world infrastructure data (Required for first run):
```bash
npm run seed
```
- Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd Frontend
npm install
```
- Start the Vite development server:
```bash
npm run dev
```

### 4. Access the Application
- **Main Dashboard:** [http://localhost:5173](http://localhost:5173)
- **Default Credentials:**
  - Email: `demo@structureai.com`
  - Password: `demo1234`
- **Public Portal:** Available directly from the login screen via the "Public Portal" button.

## 🌐 Deployment
- **Frontend:** Designed to be deployed on [Vercel](https://vercel.com).
- **Backend:** Designed to be deployed on [Render](https://render.com) or Railway (requires WebSocket support).

## 📄 License
This project is built for the Hackverse Hackathon 2026.
