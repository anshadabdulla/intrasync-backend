# 🏢 Intrasync - Internal Company Portal for HR & Team Operations

Intrasync is an internal enterprise platform designed to centralize and streamline core HR and employee operations. 
It supports essential workflows like employee management, daily work updates, resignations, event announcements, 
ticket tracking, and more — helping teams collaborate efficiently and enabling HR to manage operations digitally.

## 📋 Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Features

- **User Login & Authentication**
  - JWT-based session management
- **Employee Directory**
  - Add, edit, filter, and manage employee profiles
- **Daily Update of Work**
  - Employees log their daily tasks and total hours
- **Ticket Management System**
  - Employees can raise, update, and track tickets
  - HR/Admin can manage ticket status
- **Resignation Workflow**
  - Submit and process resignation applications
- **Event Announcements**
  - Post and manage internal company events
- **Role-Based Access Control**
  - Admin, HR, and Employee roles with permission gating

## 🛠️ Technologies Used

- **Node.js**: Server-side runtime
- **Express.js**: Web framework for routing and middleware
- **PostgreSQL**: Relational database
- **Sequelize**: ORM for database modeling and migration
- **JWT**: Authentication and session management
- **Handlebars**: Email template engine
- **JavaScript (ES6+)**: Application logic and backend scripting

## 📥 Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-org/intrasync.git
cd intrasync

2. Install dependencies

npm install

3. Set up environment variables

DB_HOST=localhost
DB_USER=youruser
DB_PASS=yourpass
DB_NAME=intrasync
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password

4. Run migrations and seeders

npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all

5. Start the application

npm start

6. 📂 Folder Structure

intrasync/
├── app.js                          # Main application entry point
├── config/                         # DB config and environment setup
│   └── config.js
├── migrations/                     # Sequelize migration scripts
│   ├── 20250612102401-create-users.js
│   ├── 20250612102551-create-employees.js
│   ├── ... (more migration files)
├── models/                         # Sequelize models
│   ├── users.js
│   ├── employees.js
│   ├── ... (more models)
├── seeders/                        # Initial data population
│   └── 20250626133037-seed-settings.js
├── src/
│   ├── controllers/                # Business logic handlers
│   ├── database/                   # Sequelize DB connection
│   ├── emails/templates/           # Handlebars email templates
│   ├── helper/                     # Common utilities
│   ├── middleware/                 # Auth middleware
│   ├── repository/                 # Data access layer
│   └── router/                     # Express route modules
├── .env                            # Environment configuration
├── .gitignore                      # Git ignored files
├── package.json                    # Project metadata & dependencies
└── README.md                       # Project documentation

🧑‍💻 Contributing

This is a private, internal project. If you're a team member contributing to this platform:

Follow the existing code style
Create a feature branch
Submit a pull request with a clear description


⚖️ License

This project is for internal use only and is not open-source. All rights reserved by the organization.



