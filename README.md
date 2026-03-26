# 🏌️ Golf Charity Subscription Platform

A full-stack web application that combines **golf performance tracking**, **subscription-based rewards**, and **charity contributions** into a single engaging platform.

---

## 🚀 Overview

This platform allows users to:

* Subscribe monthly or yearly
* Track their golf scores (last 5 scores logic)
* Participate in monthly draw-based rewards
* Contribute a portion of their subscription to charities

It is designed to be **modern, engaging, and impact-driven**, focusing on both user experience and real-world contribution.

---

## ✨ Features

### 👤 User Features

* Secure authentication (JWT-based)
* Subscription management (Monthly & Yearly)
* Golf score tracking (auto-maintains last 5 scores)
* Participation in monthly draw system
* Charity selection and contribution tracking
* Winnings dashboard & status tracking

### 🎯 Draw System

* Monthly lottery-style draw
* 5-match, 4-match, 3-match reward tiers
* Jackpot rollover system
* Fair prize distribution logic

### ❤️ Charity System

* Select preferred charity
* Minimum 10% contribution
* Track total donations and impact

### 🛠 Admin Features

* Manage users & subscriptions
* Configure and run draws
* Verify winners & payouts
* Manage charities
* View analytics (users, revenue, donations)

---

## 🛠 Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* Stripe (Payments)
* Joi (Validation)

### Frontend

* React / Next.js
* Tailwind CSS
* Framer Motion

### Other Tools

* Multer (File Uploads)
* Nodemailer (Email System)
* Winston & Morgan (Logging)

---

## 📂 Project Structure

```
golf_charity/
│
├── backend/
├── frontend/
├── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/nitin-4921/golf_charity.git
cd golf_charity
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file inside backend:

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=your_stripe_key
EMAIL_USER=your_email
EMAIL_PASS=your_password
```

---

## 📸 Screenshots

*(Add your UI screenshots here for better presentation)*

```
/screenshots/home.png
/screenshots/dashboard.png
/screenshots/draw.png
```

---

## 🌟 Unique Highlights

* 🎨 Emotion-driven UI focused on charity impact
* 🎲 Lottery-style animated draw experience
* 📊 Real-time dashboard insights
* 🎯 Gamified experience with rewards & engagement
* ⚡ Scalable backend architecture

---

## 🚀 Future Improvements

* Mobile app version
* Real-time notifications
* Multi-country support
* Advanced analytics dashboard

---

## 👨‍💻 Author

**Nitin Kumar**

---

## 📌 Note

This project was built as part of a **full-stack development assessment**, focusing on real-world architecture, scalability, and user experience.
