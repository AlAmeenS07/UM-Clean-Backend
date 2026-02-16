📌 User Management System (Dual Database Architecture)
🚀 Project Overview

This is a backend User Management System built using:

Node.js + Express

TypeScript

PostgreSQL (Primary Database)

MongoDB (Read Replica / Mirror Database)

Redis + BullMQ (Queue System)


The system follows Repository Pattern and SOLID principles, and implements event-driven dual database synchronization.

🏗️ Architecture Overview
Client Request
     ↓
Express API
     ↓
PostgreSQL (Source of Truth)
     ↓
Redis Queue (BullMQ)
     ↓
Worker Process
     ↓
MongoDB (Synced Copy)


PostgreSQL → Primary database

Redis → Queue broker

Worker → Background processor

MongoDB → Mirrored read database

✨ Features
👤 User

Register

Login (JWT Authentication)

Password hashing using bcrypt

Role-based access (USER / ADMIN)

🔐 Admin

Block / Unblock users

Protected admin routes (RBAC middleware)

🔄 Dual Database Sync

On user creation → sync-user job

On user update → update-user job

Worker syncs Mongo asynchronously

Retry enabled with exponential backoff

🛡️ Security

Passwords hashed using bcrypt

JWT stored in HttpOnly cookies

Role-Based Access Control (RBAC)

Sensitive data (password) NOT synced to MongoDB

PostgreSQL is single source of truth

📁 Folder Structure
src/
│
├── controllers/
├── services/
├── repositories/
├── routes/
├── middlewares/
├── queues/
├── workers/
├── models/
├── config/
└── utils/


Clean separation of concerns:

Controllers → Handle HTTP requests

Services → Business logic

Repositories → Database access

Worker → Background job processing
