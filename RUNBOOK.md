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

## Production Database (MongoDB Atlas)
1. Create a free-tier cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Database User with a strong password.
3. Under Network Access, add IP Address `0.0.0.0/0` (or Render's specific egress IPs if you prefer tighter security) to allow your backend to connect.
4. Get the connection string from the "Connect your application" dialog. Replace `<password>` (URL-encoding any special characters like `@` or `#`), and append the DB name (`/structureai`) before the `?` query string if Atlas' generated string doesn't already include it.
5. Locally, set `MONGODB_URI` to this Atlas URI and run `npm run seed --prefix Backend` once to populate production data and create the demo user on your live database.

## Deploying to Production
Follow this exact order to deploy the application successfully, as each step depends on the previous one:

1. **Create the Atlas cluster (Task 3)** — get your `MONGODB_URI`.
2. **Deploy Backend to Render** using `Backend/render.yaml` — set `MONGODB_URI`, `JWT_SECRET` (generate with e.g. `openssl rand -base64 32`), and `JWT_REFRESH_SECRET`. Leave `CLIENT_URL` as a placeholder for now (there's a chicken-and-egg dependency — you don't have the Vercel URL yet). Note the resulting Render URL, e.g. `https://structureai-backend.onrender.com`.
3. **Run the seed script once** against the live `MONGODB_URI` (locally, with the env var pointed at Atlas, or via Render's shell) to populate data.
4. **Deploy Frontend to Vercel**, setting `VITE_API_URL` to `https://structureai-backend.onrender.com/api` (the URL from step 2). Note the resulting Vercel URL, e.g. `https://structureai.vercel.app`.
5. **Go back to Render's dashboard** and update `CLIENT_URL` to the real Vercel URL from step 4, then redeploy/restart the backend so CORS and Socket.IO accept requests from it.
6. **Verify:** Open the Vercel URL, log in with the demo credentials (`demo@structureai.com` / `demo1234`), confirm the dashboard loads data (not blank/CORS errors in the browser console), and that a Socket.IO connection succeeds (check the Network tab for a `101 Switching Protocols` on the websocket).
