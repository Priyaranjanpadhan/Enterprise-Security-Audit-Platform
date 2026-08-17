# Enterprise Security Audit Platform

A full-stack, role-based IT asset management and vulnerability tracking system designed for enterprise cybersecurity teams. This platform enforces strict data isolation, tracks the end-to-end lifecycle of security flaws, and maintains audit trail of all user actions. 

## 🚀 Live Demo
* **Frontend:** [https://priyaranjan.me](https://priyaranjan.me)
* **Backend API:** `https://api.priyaranjan.me/api`
* **Database:** PostgreSQL hosted on Supabase

## 🌎 Enterprise-Grade Domain Architecture
In a true enterprise deployment, security and seamless user experience are paramount. To bypass modern browser restrictions on 3rd party cookies, this project utilizes custom DNS routing to unify a decoupled PaaS(Platform as a Service) architecture.

While the frontend is hosted on Vercel and backend on Render, they are bound together under a single root domain(`priyaranjan.me` and `api.priyaranjan.me`). This ensures that secure, cross-origin session cookies remain First-party, providing flawless authentication without requiring users to manually lower their browser privacy settings.  

## 📖 Comprehensive Documentation
To view the architectural blueprints, database schema planning, and security routing decisions, please see the handwritten engineering notes in the [docs/](./docs) folder:
* [01 - System Architecture & Deployment](./docs/01-System-Architecture.md)
* [02 - Database Schema Design](./docs/02-Database-Schema.md)
* [03 - Backend Security & Routing](./docs/03-Backend.md)
* [04 - Frontend UI Architecture](./docs/04-Frontend.md)
* [05 - Authentication Lifecycle](./docs/05-Auth-Lifecycle.md)

## ⚙️ Tech Stack
* **Frontend:** React.js (Vite), Tailwind CSS, React Router, Axios
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL (Supabase)
* **Authentication:** Express-Session, Bcrypt, Google OAuth 2.0 (Passport.js)
* **Domain Management:** Custom routing via Namecheap

## 🔐 Key Features
* **Role-Based Access Control (RBAC):** Strict permission enforcement routing users into Admin, Auditor, or Technician workflows.
* **Secure Session Management:** Implementation of `sameSite: 'none'` and `Secure` cookies working seamlessly across decoupled subdomains.
* **Immutable Audit Trails:** Permanent database logging of critical system events (e.g., asset reassignment, role changes).
* **Hardware Asset Tracking:** Full CRUD lifecycle for IT assets, linking physical hardware to authorized network users.
* **Optimized Mobile UX:** Fully responsive dashboards using custom Tailwind CSS breakpoints and horizontal scroll table wrappers.

## 👨‍💻 Author
**Priya Ranjan Padhan**
*M.Tech in Information Systems Security Engineering*