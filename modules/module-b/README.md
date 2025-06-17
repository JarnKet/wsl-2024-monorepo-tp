============================================================
EXPERT README - WorldSkills 2024
============================================================
Project: Module B (Full-Stack Application)
Contestant ID: 16 (Example)

---

This document provides the instructions for executing and accessing the deployed NodeJS application.

---

## [1] Prerequisites

- NodeJS (v18+) and NPM installed.
- PM2 process manager installed globally (`npm install pm2 -g`).
- A running MySQL server.

---

## [2] Installation Steps

This project is a monorepo. All commands should be run from the project's root directory.

1. Navigate to the project directory:
   cd /path/to/wsl-2024-project

2. Install all dependencies for both frontend and backend. This will generate a Linux-compatible node_modules folder.
   npm install

---

## [3] Database Setup

The backend for Module B requires a database and table. The SQL script to set up the 'module_b_db' database and its 'products' table is located in the original project files (`setup.sql`). The backend is configured via environment variables in `modules/module-b/backend/.env` to connect to this database.

---

## [4] Executing the Application with PM2

The application consists of two services: the Next.js frontend and the Express.js backend. They are managed by PM2.

1. To start both services, run the following commands from the project root:

   # Start the Express.js backend API

   pm2 start modules/module-b/backend/server.js --name 16_module_b_backend

   # Start the Next.js frontend server

   pm2 start npm --name 16_module_b_frontend -- run start -w module-b-frontend

2. To view the status of the running applications:
   pm2 list

---

## [5] Accessing the Application

The services are running on different ports as required.

1. Frontend Application (Next.js):

   - URL: http://ws01.worldskills.org:3001/16_module_b

2. Backend API (Express.js):
   - URL: http://ws01.worldskills.org:4001/16_module_b/api/
   - Example Endpoint: http://ws01.worldskills.org:4001/16_module_b/api/users

---

## [6] Stopping the Application

To stop the services, use the following PM2 commands:

pm2 stop 16_module_b_frontend
pm2 stop 16_module_b_backend

============================================================
