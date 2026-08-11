# Enterprise Security Audit Platform

A full-stack, role-based IT asset management and vulnerability tracking system design for enterprise cybersecurity teams. This platform enforces strict data isolation, tracks the end-to-end lifecycle of security flaws, and maintains audit trail of all user actions. 

## 🚀 Live Demo
* **Frontend:** [https://enterprise-security-audit-platform.vercel.app]
* **Backend:** Hosted on Render (with automated keep-alive cron jobs)
* **Database:** PostgreSQL hosted on Supabase

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

## 🔐 Key Features
* **Role-Based Access Control (RBAC):** Strict permission enforcement routing users into Admin, Auditor, or Technician workflows.
* **Secure Session Management:** Implementation of `HttpOnly` and `Secure` cookies with automated session restoration on the React frontend.
* **Immutable Audit Trails:** Permanent database logging of critical system events (e.g., asset reassignment, role changes).
* **Hardware Asset Tracking:** Full CRUD lifecycle for IT assets, linking physical hardware to authorized network users.
* **Optimized Mobile UX:** Fully responsive dashboards using custom Tailwind CSS breakpoints and horizontal scroll table wrappers.

## 👨‍💻 Author
**Priya Ranjan Padhan**
*M.Tech in Information Systems Security Engineering*
