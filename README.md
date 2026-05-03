# 🎓 KCET Mentor Connect (Peer Hive)

A full-stack web platform that connects **KCET counselling aspirants (mentees)** with **engineering students (mentors)** from specific colleges to guide them in making better counselling decisions.

---

## 🚀 Overview

KCET Mentor Connect is designed to solve a real problem faced by thousands of students during KCET counselling — lack of reliable, real-time guidance.

This platform enables:

* Direct communication with real college students
* College-specific mentorship
* Real-time chat for guidance and doubt solving

---

## 👥 User Roles

### 🧑‍🎓 Mentee (KCET Aspirant)

* Register/Login using Email or Google
* Search for engineering colleges
* View mentors from selected colleges
* Send connection requests
* Chat with approved mentors

### 🎓 Mentor (Engineering Student)

* Register/Login using Email or Google
* Provide college details and USN
* Receive mentorship requests
* Accept/Reject mentees
* Guide students via chat

---

## ✨ Features

* 🔐 Dual Authentication System (Mentor & Mentee)
* 🔎 College Search Functionality
* 🤝 Mentor-Mentee Request System
* 💬 Real-Time Chat (Instagram-style messaging)
* 🔔 Notifications for Requests
* 👤 Profile Management
* 📱 Fully Responsive UI
* 🔓 Google Sign-In Integration
* 🚪 Secure Logout

---

## 🏗️ Tech Stack

### Frontend

* React.js / Next.js
* Tailwind CSS (for modern UI)

### Backend

* Node.js + Express.js

### Database

* MongoDB (Mongoose)

### Authentication

* JWT / Firebase Auth
* Google OAuth 2.0

### Real-Time Communication

* Socket.IO / Firebase Realtime Database

---

## 📂 Project Structure

```
peer_hive/
│
├── client/                # Frontend (React / Next.js)
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── styles/
│
├── server/                # Backend (Node.js / Express)
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── config/
│
├── .env.example
├── package.json
└── README.md
```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory and add:

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

CLIENT_URL=http://localhost:3000
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/AmulyaPV/peer_hive.git
cd peer_hive
```

### 2️⃣ Install Dependencies

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd client
npm install
```

---

### 3️⃣ Run the Application

#### Start Backend

```bash
cd server
npm run dev
```

#### Start Frontend

```bash
cd client
npm run dev
```

---

## 🌐 Application Flow

1. User selects role (Mentor / Mentee)
2. Registers or logs in
3. Mentee searches for colleges
4. Views mentors from selected college
5. Sends connection request
6. Mentor accepts/rejects request
7. Real-time chat is enabled upon acceptance

---

## 🔒 Security Features

* Password hashing using bcrypt
* JWT-based authentication
* Input validation and sanitization
* Protected routes and APIs

---

## 🚀 Future Enhancements

* ⭐ Mentor rating system
* 📊 College insights & cutoffs
* 🤖 AI-based college recommendations
* 🌍 Multi-language support
* 📞 Voice/video calling
* 📶 Offline/SMS support (for rural users)

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License.

---

## 💡 Inspiration

Inspired by mentorship-based platforms like “Project Clay” and modern communication apps like Instagram.

---

## 🙌 Acknowledgements

* KCET community
* Engineering students sharing real experiences
* Open-source contributors

---

## 📬 Contact

For queries or collaboration:

🌐 GitHub: https://github.com/AmulyaPV/peer_hive

---

⭐ If you like this project, don’t forget to star the repo!
