# SmartManage

SmartManage is a beginner-friendly customer, staff, and admin record management app.

## What it does

- Manage customers, staff, and admin contact records
- Create, view, update, and delete records
- Spring Boot REST API with MySQL and a React interface
- Spring Security protects API requests with HTTP Basic authentication
- Bean Validation checks required names and valid email addresses

## Requirements

- Java 21
- Node.js and npm
- MySQL running locally, with the connection configured in `src/main/resources/application.properties`

Spring Security creates a temporary in-memory user named `user` and prints its generated password in the Spring Boot terminal each time the backend starts. Enter those credentials on the frontend sign-in screen. New admin passwords are BCrypt encoded; old admin records created before this change may still contain plain text passwords.

This is a local learning demo. HTTP Basic credentials are not encrypted without HTTPS, so do not expose this app to the public internet or use real account passwords.

## First-time setup

Open PowerShell in the project folder and install the React packages once:

```powershell
cd frontend
npm install
```

Start MySQL before launching the app. Check the database connection settings in `src/main/resources/application.properties`; do not share that file if it contains your database password.

## Show the project

From the project root, run:

```powershell
.\start-demo.ps1
```

This opens separate PowerShell windows for Spring Boot and React, then opens the frontend in your default browser. Keep both windows open while presenting. The frontend URL is `http://localhost:5173`; the API runs on port `8426`.

If Spring Boot is already running, stop it first so the security and validation changes are loaded. The launcher reuses an API already listening on port `8426`.

You can also start the two parts manually in separate terminals:

```powershell
# Terminal 1: from the project root
.\mvnw.cmd spring-boot:run
```

```powershell
# Terminal 2: from the frontend folder
npm run dev
```

If staff or admin lists are empty, add demo records from their tabs in the frontend.
