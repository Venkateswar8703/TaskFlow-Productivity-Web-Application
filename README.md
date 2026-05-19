# TaskFlow — Modern Productivity & Task Management Web Application

TaskFlow is a premium, highly responsive task management web application built with **React**, **HTML5**, **Vanilla CSS3**, and **JavaScript (ES6+)** using the **Vite** tooling ecosystem. It offers full CRUD functionality for daily planning, along with client-side data persistence.

![Clean UI Design Example](https://img.shields.io/badge/UI-Modern--Premium-blueviolet)
![React Version](https://img.shields.io/badge/React-19.0-blue)
![Vite Version](https://img.shields.io/badge/Vite-8.0-yellow)

---

## 🌟 Key Features

1. **Full CRUD Operations**:
   - Create, Read, Update, and Delete tasks through intuitive modals and card actions.
2. **Interactive Checklists & Subtasks**:
   - Add multiple checklist items per task. Track progress in real-time with visual, color-coded progress bars.
3. **Advanced Filtering & Search**:
   - Filter tasks by category (**Work, Personal, Shopping, Health, Ideas**).
   - Filter tasks by priority levels (**High, Medium, Low**).
   - Live search matching task titles and descriptions.
4. **Custom Sorting Options**:
   - Sort tasks by creation date, due date, or priority weight.
5. **Theme Switcher**:
   - Toggle between a sleek, vibrant Light Mode and a modern, high-contrast Dark Mode (custom built with CSS variables).
6. **Task Deadlines & Overdue Indicators**:
   - Track due dates. Clear visual cues mark overdue tasks.
7. **Interactive Dashboard Stats**:
   - At-a-glance summary cards showing **Completion Rate (%)**, **Active Tasks count**, **Critical (High Priority) tasks**, and **Overdue alerts**.
8. **Local State Persistence**:
   - State automatically synchronizes with browser `localStorage`, ensuring user data is persistent across page reloads.

---

## 🛠️ Technology Stack

- **Frontend Library**: React (with component-based UI architecture)
- **Styling**: Vanilla CSS (CSS variables, flexbox, custom grid structures, glassmorphism, transitions)
- **Tooling**: Vite (fast builds and HMR)
- **Linting**: ESLint (clean rules)
- **State Storage**: HTML5 LocalStorage API

---

## ⚙️ Quick Start

Follow these steps to run the application locally on your machine:

### 1. Prerequisite
Ensure you have [Node.js](https://nodejs.org/) installed (version 18+ recommended).

### 2. Install Dependencies
Run the package installation command:
```bash
npm install
```

### 3. Run Development Server
Start the dev server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

### 4. Build for Production
To bundle the application for production deployment, run:
```bash
npm run build
```
This generates optimized static files inside the `dist/` directory.

---

## 📂 Project Structure

```text
TaskFlow/
├── public/                 # Static assets & SVG icons
├── src/
│   ├── assets/             # Images & logos
│   ├── components/         # Modular UI Components
│   │   ├── Sidebar.jsx     # Category navigation & theme toggles
│   │   ├── StatsView.jsx   # Dashboard metrics cards
│   │   ├── TaskCard.jsx    # Individual task render
│   │   ├── TaskForm.jsx    # Create/Edit task modal
│   │   └── TaskDetailsModal.jsx # Detailed task & checklist view
│   ├── App.jsx             # Main state coordinator & filter pipeline
│   ├── index.css           # Core styling tokens & animations
│   └── main.jsx            # React root mount script
├── index.html              # Entry HTML file
├── package.json            # Scripts & dependencies
└── vite.config.js          # Vite config options
```
