# FilmFusion - A Movie Reservation System


**FilmFusion** is a web-based movie reservation system designed to streamline the process of browsing movies, checking showtimes, and booking tickets. Built with a robust backend using Node.js, Express.js, and MySQL, and a dynamic frontend using React.js, it offers a seamless experience for users and administrators alike. Whether you're a moviegoer looking to reserve seats or a theater admin managing schedules, FilmFusion provides an efficient and reliable solution.

---
##Overview
![Alt text]((https://github.com/aadityabinod/dbms/blob/main/home))

![Alt text](https://github.com/aadityabinod/taskmanager/blob/main/2.png)

![Alt text](https://github.com/aadityabinod/taskmanager/blob/main/3.png)

![Alt text](https://github.com/aadityabinod/taskmanager/blob/main/5.png)

---

## Features 🛠️
- **🎬 Browse and Filter Movies**: Explore movies by genre, language, or release date.
- **🎥 View Movie Details**: Access synopses, cast info, and ratings.
- **🕒 Check Showtimes**: View available screening times for each movie.
- **🎫 Book Tickets**: Reserve seats in real-time with instant confirmation.
- **🔐 User Authentication**: Secure login and registration (session-based).
- **📚 Booking History**: Track past reservations.
- **🛠 Admin Panel**: Manage movie listings, showtimes, and bookings.
- **📱 Responsive UI**: Fully adaptable across devices.

---

## Tech Stack

### Backend
- **Node.js**: Server environment for running the backend.
- **Express.js**: Framework for building RESTful APIs.
- **MySQL**: Relational database for storing movie, user, and booking data.
- **Dependencies**:
- `"body-parser": "^1.20.2"` - Parse incoming request bodies.
  - `"cors": "^2.8.5"` - Enable cross-origin resource sharing.
  - `"dotenv": "^16.4.7"` - Manage environment variables.
  - `"nodemon": "^3.0.1"` - Auto-restart server during development.

### Frontend
- **React.js**: Component-based library for building the UI.
- **Dependencies**:
  - `"@reduxjs/toolkit": "^2.1.0"` - State management.
  - `"axios": "^1.6.0"` - HTTP requests to the backend.
  - `"framer-motion": "^11.3.24"` - Animations for a smooth UX.
  - `"react-router-dom": "^6.15.0"` - Navigation between pages.
  - `"react-toastify": "^9.1.3"` - User notifications.
  - Plus additional utilities like `react-icons`, `react-spinners`, and `redux`.

---

## Prerequisites
Before setting up FilmFusion, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v8 or higher) - [Download](https://www.mysql.com/downloads/)
- **Git** - [Download](https://git-scm.com/downloads)

---

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/filmfusion.git
cd filmfusion


Tech Stack
Backend
Node.js: Server environment for running the backend.
Express.js: Framework for building RESTful APIs.
MySQL: Relational database for storing movie, user, and booking data.
Dependencies:
"body-parser": "^1.20.2" - Parse incoming request bodies.
"cors": "^2.8.5" - Enable cross-origin resource sharing.
"dotenv": "^16.4.7" - Manage environment variables.
"nodemon": "^3.0.1" - Auto-restart server during development.
Frontend
React.js: Component-based library for building the UI.
Dependencies:
"@reduxjs/toolkit": "^2.1.0" - State management.
"axios": "^1.6.0" - HTTP requests to the backend.
"framer-motion": "^11.3.24" - Animations for a smooth UX.
"react-router-dom": "^6.15.0" - Navigation between pages.
"react-toastify": "^9.1.3" - User notifications.
Plus additional utilities like react-icons, react-spinners, and redux.
Prerequisites
Before setting up FilmFusion, ensure you have the following installed:

Node.js (v16 or higher) - Download
MySQL (v8 or higher) - Download
Git - Download
Installation
1. Clone the Repository
bash
Wrap
Copy
git clone https://github.com/your-username/filmfusion.git
cd filmfusion
2. Backend Setup
Navigate to the backend directory:
bash
Wrap
Copy
cd backend
Install dependencies:
bash
Wrap
Copy
npm install
Create a .env file in the backend directory and add the following:
env
Wrap
Copy
PORT=5000
MYSQL_HOST=localhost
MYSQL_USER=your_username
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=filmfusion_db
Replace your_username and your_password with your MySQL credentials.
Set up the MySQL database:
Create a database named filmfusion_db.
Run the SQL schema (e.g., from schema.sql if provided) to create tables:
bash
Wrap
Copy
mysql -u your_username -p filmfusion_db < schema.sql
Start the backend server:
bash
Wrap
Copy
npm run dev
(Uses nodemon for auto-restart during development.)
3. Frontend Setup
Navigate to the frontend directory:
bash
Wrap
Copy
cd frontend
Install dependencies:
bash
Wrap
Copy
npm install
Start the frontend development server:
bash
Wrap
Copy
npm run dev
(Assumes Vite or a similar tool based on your "vite-plugin-require" dependency.)
4. Access the Application
Backend API: http://localhost:5000
Frontend: http://localhost:5173 (default Vite port, adjust if different)
Project Structure
text
Wrap
Copy
filmfusion/
├── backend/                # Backend source code
│   ├── node_modules/       # Backend dependencies
│   ├── src/                # Backend logic (e.g., routes, controllers)
│   ├── .env              # Environment variables
│   ├── package.json        # Backend dependencies and scripts
│   └── server.js           # Entry point for Express server
├── frontend/               # Frontend source code
│   ├── node_modules/       # Frontend dependencies
│   ├── src/                # React components, Redux store, etc.
│   ├── public/             # Static assets
│   ├── package.json        # Frontend dependencies and scripts
│   └── vite.config.js      # Vite configuration (assumed)
└── README.md              # Project documentation
Usage
User Flow:
Register or log in to your account.
Browse movies and select a showtime.
Choose your seats and confirm the booking.
View your booking history.
Admin Flow:
Log in with admin credentials.
Add or update movie listings and showtimes.
Monitor seat availability and bookings.

