# StructureAI Runbook

Follow these instructions to start the Hackverse Hackathon 2026 project.

## 1. Start MongoDB
Ensure you have a local MongoDB instance running on port 27017.
If you use Docker, you can start one via:
```bash
docker run -d -p 27017:27017 --name structureai-mongo mongo:7
```

## 2. Install Dependencies
Run the following from the root directory to install packages for both Backend and Frontend:
```bash
npm run install:all
```

## 3. Seed Database
Seed the database with sample structures, sensors, alerts, and create the demo user:
```bash
npm run seed
```

## 4. Run Application
Start both the Backend (port 5001) and Frontend (port 3000) using concurrently:
```bash
npm run dev
```

## Demo Credentials
Log into the application using:
- **Email:** demo@structureai.com
- **Password:** demo1234
