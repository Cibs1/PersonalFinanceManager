# Project Overview

The Personal Finance Manager is a full-stack web application designed to help users track, manage, and analyze their finances efficiently. It provides features like income tracking, expense management, category-based budgeting, savings tracking, and insightful financial visualizations.

The project is built with:<br>

Backend: Spring Boot (Java), Spring Security (JWT Authentication), PostgreSQL
Frontend: React.js (Material-UI, Chart.js, Axios)
<br>
# Core Features
# 🏦 Income & Salary Management
Users can set and edit their monthly salary.<br>
Salary is used to calculate surplus or deficit in relation to monthly expenses.
<br>
# 📉 Expense Tracking
Users can add, delete, and manage transactions (expenses).<br>
Transactions are categorized (e.g., Food, Rent, Shopping).<br>
All transactions are securely stored and associated with a logged-in user.
<br>
# 📊 Financial Insights & Charts
Category Breakdown: A pie chart visualizing expenses by category.<br>
Monthly Expense Trends: A line chart showing spending patterns over time.<br>
Income vs. Expenses Bar: A modern dual-colored bar where:<br>
💙 Blue → Surplus<br>
🔴 Red → Deficit<br>
A white dot with a black outline marks the current balance position.
<br>
# 🎯 Budgeting by Category
Users can set a budget per category to control spending.<br>
Budgets help users compare actual expenses vs. planned budgets.<br>
Budgets can be updated or deleted at any time.
<br>
# 💾 Savings Tracking
Users can manually set, edit, and track their total savings.<br>
Savings are displayed alongside income and expenses for a complete financial overview.
<br>
# 🔒 Secure Authentication & User Management

JWT-based authentication (Spring Security).<br>
User login and registration via React frontend.<br>
Backend ensures data is private and only accessible to the logged-in user.
<br>
<br>
<br>
# Tech Stack
# 🖥 Backend (Spring Boot)
Spring Boot – RESTful API development<br>
Spring Security + JWT – Secure authentication<br>
Spring Data JPA – Database management<br>
PostgreSQL – Relational database<br>
Maven – Dependency management
<br>
# 🎨 Frontend (React.js)
React.js – UI Development<br>
Material-UI – Responsive and modern UI components<br>
Chart.js – Data visualization<br>
Axios – API communication
<br>
# 🔗 Other Technologies
JWT (JSON Web Token) – Secure API authentication<br>
CORS (Cross-Origin Resource Sharing) – Backend-to-Frontend communication<br>
Docker (Optional) – Containerized deployment
<br>
<br>
<br>
# Project Setup
# Backend (Spring Boot)

Clone the repository<br>
git clone https://github.com/YOUR_GITHUB_USERNAME/PersonalFinanceManager.git<br>
cd PersonalFinanceManager/personal-finance-backend
<br>
Build & run<br>
mvn clean install<br>
mvn spring-boot:run<br>
<br>
Backend runs on: http://localhost:8080/<br>
Ensure you have PostgreSQL running and update application.properties with your DB credentials.
<br>
# Frontend (React)
-cd personal-finance-frontend
<br>
Install dependencies<br>
-npm install
<br>
Run the frontend<br>
-npm start<br>
Frontend runs on: http://localhost:3000/
<br>
# Next Steps & Future Enhancements 🚀
✅ Notifications for overspending (alerts when a budget is exceeded).<br>
✅ Multi-user support with role-based access.<br>
✅ Recurring transactions (e.g., subscriptions, rent, utility bills).<br>
✅ Dark mode & UI improvements.<br>
✅ Export financial data to CSV or PDF.
<br>
# Contributions & Contact
💡 Contributions are welcome! Feel free to submit pull requests or open issues for bugs or improvements.<br>
📧 Contact: ricardojcr11@gmail.com
