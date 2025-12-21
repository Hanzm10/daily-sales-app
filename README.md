# Store Audit Desktop

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Electron](https://img.shields.io/badge/Electron-33.0.0-blueviolet)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB)

**Store Audit Desktop** is a robust, standalone desktop application designed to streamline the daily tracking of retail sales discrepancies. Built with **Electron** and **React**, it replaces manual logbooks with a digital system that automatically calculates penalties for unrecorded sales and cash shortages based on customizable business rules.

## 🌟 Key Features

### 📅 Daily Sales Tracking
* **Intuitive Interface:** A clean, calendar-based navigation system to log entries for any specific date.
* **Two-Way Entry:** Dedicated fields for "Unrecorded" sales (missed transactions) and "Short" amounts (cash variance).
* **Conflict Prevention:** Smart validation prevents entering both "Unrecorded" and "Short" amounts for the same day to ensure data integrity.

### 👥 Worker Management
* **Dynamic Roster:** Easily add, remove, and manage a list of employees.
* **Attendance Tracking:** Select exactly who worked on a specific day.
* **Fair Penalty Splitting:** The system automatically divides the total daily penalty among the workers present on that shift.

### 🧮 Automated Penalty Logic
The application enforces a strict set of business rules to calculate penalties instantly:
* **Unrecorded Sales Rules:**
    * **₱0 - ₱50**: No Penalty (Free)
    * **₱51 - ₱100**: ₱50.00 Penalty
    * **₱101 - ₱150**: ₱75.00 Penalty
    * **₱151 - ₱200**: ₱100.00 Penalty
    * **₱200+**: Penalty = Actual Amount
* **Shortage Rules:**
    * **Formula**: `Short Amount` + `₱50.00 Base Penalty`.

### 📊 Reporting & Export
* **One-Click Excel Export**: Generates a professional `.xlsx` report using `xlsx-js-style`.
* **Formatted Reports**: The exported file includes color-coded headers, formatted currency cells, and a detailed breakdown of daily logs and individual worker shares.

### 💾 Local Data Persistence
* **Offline First**: No internet connection required.
* **Secure Storage**: All worker lists and daily entries are saved locally on the machine, ensuring data is retained even after closing the application.

---

## 🛠️ Technology Stack

This project leverages a modern web-to-desktop stack:

* **Core**: [Electron](https://www.electronjs.org/) (Main Process)
* **UI Framework**: [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
* **Build Tool**: [Vite](https://vitejs.dev/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Excel Engine**: [xlsx-js-style](https://github.com/gitbrent/xlsx-js-style)
* **Bundler**: Electron Builder (for creating `.exe` installers)

---

## 🚀 Getting Started

Follow these instructions to set up the project on your local machine for development or building.

### Prerequisites
* [Node.js](https://nodejs.org/) (v16 or higher recommended)
* [Git](https://git-scm.com/)

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/Hanzm10/store-audit-desktop.git](https://github.com/Hanzm10/store-audit-desktop.git)
    cd store-audit-desktop
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

### Development Mode
To run the application in development mode (with hot-reloading):
```bash
npm run dev

```

*This command concurrently starts the Vite dev server and the Electron app window.*

---

## 🏗️ Building the Application

To create a standalone executable (`.exe`) for Windows:

1. **Run the distribution script**
```bash
npm run dist

```


2. **Locate the installer**
After the build process finishes, navigate to the `release/` folder in your project directory. You will find the installer/executable file there (e.g., `Store Audit Desktop Setup 1.0.0.exe`).

---

## 📂 Project Structure

```
store-audit-desktop/
├── electron/           # Electron main process files
│   └── main.js         # Main entry point for the desktop window
├── src/                # React source code
│   ├── App.tsx         # Main application logic and UI
│   ├── index.css       # Tailwind imports and global styles
│   └── main.tsx        # React DOM entry point
├── dist/               # Production build output (React)
├── release/            # Final executable output (Electron)
├── package.json        # Dependencies and build scripts
├── vite.config.ts      # Vite configuration
└── README.md           # Project documentation

```

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👤 Author

**Hanzm10**

* GitHub: [@Hanzm10](https://github.com/Hanzm10)

## 📄 License

Distributed under the MIT License.

```