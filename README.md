# 🔐 OTP Authentication with React & Node.js

A complete full-stack OTP-based authentication system built using **React** (frontend) and **Node.js + Express + MongoDB** (backend). Users can sign up or log in using a 6-digit OTP sent to their email address — without needing a password.

## ✨ Features

- ✅ OTP-based signup & login (email only)
- 📧 Send OTP via email using Nodemailer
- 🔒 Secure OTP verification with expiry
- 🛡️ JWT-based user authentication
- 📦 Backend: Express + MongoDB (Mongoose)
- 💻 Frontend: React + Tailwind CSS
- 🔁 Logout handling
- 📬 Password reset with email link

---

## 📁 Project Structure

```

OTP-Authentication/
├── client/           # React frontend
│   ├── src/
│   └── ...
├── server/           # Node.js backend
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── index.js
└── README.md

````

---

## 🚀 Getting Started

### 🔧 Prerequisites

- Node.js & npm
- MongoDB (local or Atlas)
- Gmail account (for sending OTPs)

---

## 🖥️ Frontend Setup (React)

```bash
cd client
npm install
npm run dev
````

> Frontend runs on `http://localhost:5173`

---

## 🛠 Backend Setup (Node.js + Express)

```bash
cd server
npm install
```

### ▶ Start the backend:

```bash
node Server.js
```

> Backend runs on `http://localhost:3000`

---

## ✅ API Endpoints

### POST `/auth/send-otp`

* Sends OTP to user's email

### POST `/auth/verify-otp`

* Verifies OTP and logs in user

### POST `/auth/send-reset-link`

* Sends password reset link with JWT token

### POST `/auth/reset-password`

* Resets password using token from email

### POST `/auth/logout`

* Clears auth session (optional)

---

## 👨‍💻 Author

Made by **Krish Maurya** 🔗 [GitHub Profile](https://github.com/krish-maurya)

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 📌 Notes

* Use **Gmail App Passwords**, not your actual Gmail password.
* Use **HTTPS** in production for secure OTP/token transport.
* Add **rate limiting** to prevent OTP spamming.

---

