# SmartManage frontend

This is the React CRUD interface for customers, staff, and admins in the Spring Boot API.

## Run locally

1. Start the Spring Boot app and make sure MySQL is running. The API uses port `8426`. The backend terminal prints a generated password for the `user` account; enter it on the sign-in screen.
2. In a terminal, go to this folder and install the frontend packages:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

3. Open the local URL printed by Vite (usually `http://localhost:5173`).

In development, Vite forwards API requests to `http://localhost:8426` using the proxy in `vite.config.js`. If you change the backend port, update the proxy target there. The frontend keeps sign-in credentials in memory only, so sign in again after a page refresh.
