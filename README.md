# 🏥 Clinical Management System

## 📘 Overview
A modular and scalable Clinical Management System supporting multiple user roles:
- **Admin**
- **Doctor**
- **Receptionist**
- **Lab Technician**
- **Pharmacist**

The system is built for efficient clinical workflow management with role-based dashboards, secure authentication, and real-time updates.

---

## 🗂️ Folder Structure Overview

| Folder | Purpose |
|--------|----------|
| `src/api/` | Handles all API requests (REST, Axios, or Fetch). |
| `src/components/` | Reusable UI components shared across modules. |
| `src/modules/` | Role-specific modules (Admin, Doctor, etc.). |
| `src/layouts/` | Role-based layouts for consistent UI. |
| `src/contexts/` | Global state using React Context. |
| `src/services/` | Business logic and service layer. |
| `src/utils/` | Helper utilities and validators. |
| `src/assets/` | Static assets like images, logos, and styles. |
| `tests/` | Unit, integration, and end-to-end test cases. |

---

## 🧑‍💻 Contribution Guidelines

### 1️⃣ Fork and Clone
```bash
git clone https://github.com/<your-username>/clinical-management-system.git
cd clinical-management-system
```

### 2️⃣ Create a Feature Branch
```bash
git checkout -b feature/Team2 Branch
```

### 3️⃣ Commit and Push Changes
```bash
git add .
git commit -m "Added: <feature-description>"
git push origin feature/<feature-name>
```

### 4️⃣ Submit Pull Request
Go to your repository on GitHub and submit a **Pull Request** to the `main` branch.

---

## 🔐 Environment Setup (Optional)
Create a `.env` file at the project root:
```bash
VITE_API_BASE_URL=https://api.clinicmanagementsystem.com
VITE_APP_ENV=development
```

---

## 🧱 Tech Stack (planned)
- **Frontend:** React + Vite / Next.js + Tailwind CSS + shadcn/ui
- **State Management:** Context API / Redux Toolkit
- **Routing:** React Router / Next.js Router
- **Backend (future):** Node.js + Express / NestJS
- **Database (future):** MongoDB / MYSQL
- **Testing:** Jest + React Testing Library + Cypress

---

## 📅 Next Steps
- [ ] Task 2: Set up GitHub repository and permissions
- [ ] Task 3: Build responsive common dashboard layout
- [ ] Task 4: Implement authentication & role-based routing

---

### 👥 Contributors
- **Project Lead: Vinayak
- **Developers: AlbittaJoshy, Chelsy Thomas, Jincy, Vishnukala
