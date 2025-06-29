# 🏢 Intrasync

Intrasync is an internal company platform designed to streamline employee and HR activities within the organization.
It acts as a central hub for all internal operations, such as user management, resignation handling, ticket tracking, 
event announcements, and more.

────────────────────────────
🚀 Features
────────────────────────────
👤 User Login & Authentication  
🧑‍💼 Employee Management  
📅 Event Announcements  
🎫 Ticket Raising & Tracking  
📤 Resignation Submissions  
📝 Daily Update of Work  
🔒 Role-Based Access Control (HR/Admin/Employee)  

# 📁 Folder Structure
────────────────────────────
project-root/
├── app.js                            # Main entry point
├── config/
│   └── config.js                     # Sequelize and environment config
├── migrations/                       # Sequelize schema migration files
│   ├── 20250612102401-create-users.js
│   ├── 20250612102551-create-employees.js
│   ├── 20250620041612-create-employeeDocuments.js
│   ├── 20250621060742-create-tickets.js
│   ├── 20250621060748-create-ticketDetails.js
│   ├── 20250621153105-create-settings.js
│   ├── 20250624112335-create-departments.js
│   ├── 20250624112401-create-designations.js
│   └── 20250628073836-create-dailyUpdates.js
├── models/
│   ├── dailyUpdates.js
│   ├── departments.js
│   ├── designations.js
│   ├── employeeDocuments.js
│   ├── employees.js
│   ├── index.js
│   ├── settings.js
│   ├── ticketDetails.js
│   ├── tickets.js
│   └── users.js
├── seeders/
│   └── 20250626133037-seed-settings.js
├── src/
│   ├── controllers/
│   │   ├── dailyUpdateController.js
│   │   ├── employeeController.js
│   │   ├── loginController.js
│   │   ├── masterDataController.js
│   │   └── ticketController.js
│   ├── database/
│   │   └── db.js
│   ├── emails/
│   │   └── templates/
│   │       ├── forgot-email.handlebars
│   │       └── reset-password-email.handlebars
│   ├── helper/
│   │   └── commonHelper.js
│   ├── middleware/
│   │   └── auth.js
│   ├── repository/
│   │   ├── dailyUpdateRepo.js
│   │   ├── EmailRepo.js
│   │   ├── EmployeeRepo.js
│   │   ├── MasterDataRepo.js
│   │   ├── ticketRepo.js
│   │   └── UserRepo.js
│   └── router/
│       ├── dailyUpdateRouter.js
│       ├── employeeRouter.js
│       ├── loginRouter.js
│       ├── masterDataRouter.js
│       └── ticketRouter.js

────────────────────────────
📦 Tech Stack
────────────────────────────
Backend  : Node.js, Express.js  
Database : PostgreSQL (Sequelize ORM)  
Email    : Handlebars templates  
Auth     : JWT-based authentication  

────────────────────────────
⚙️ Setup Instructions
────────────────────────────
# 1. Clone the repository
git clone https://github.com/your-org/intrasync.git
cd intrasync

# 2. Install dependencies
npm install

# 3. Configure environment
# Create a .env file with DB credentials, JWT secret, etc.

# 4. Run DB migrations and seeders
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all

# 5. Start the server
npm start

────────────────────────────
🧑‍💻 Contribution
────────────────────────────
This platform is internal to our company.
If you're a team member, please follow code standards and submit a pull request.

────────────────────────────
📬 Contact
────────────────────────────
For issues or support, contact the dev team or HR representative.
