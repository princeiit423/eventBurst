# 🧠 Student Innovation Center – Empowering Innovation through Collaboration

The **Student Innovation Center (SIC)** is a full-stack web application created to foster creativity, innovation, and collaboration among students. The platform offers a dual-interface system: one for **Admins** to manage events and content, and another for **Users** to participate in events, manage their profiles, and connect with the community.

---

## 🌟 Core Features

### 👨‍🏫 Admin Panel
- 🔐 Secure admin login
- ➕ Add new events, workshops, and competitions
- ✏️ Edit or update existing events
- ❌ Delete past or invalid events
- 📊 Dashboard with overview of registered users per event

### 🧑‍🎓 User Panel
- 📝 User Signup/Login with session-based authentication
- 📅 View and register for upcoming events
- 📄 Personal user profile with:
  - Edit profile info
  - View registered events
- 📨 Receive confirmation and updates for event registrations

---

## 🧰 Tech Stack

- **Frontend**: HTML5, CSS3, Tailwind CSS, JavaScript, EJS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Passport.js (Local Strategy)
- **Templating**: EJS
- **Animations**: GSAP, ScrollReveal (for smooth UI/UX)

---

## 🗂️ Folder Structure (Typical)
student-innovation-center/ ├── models/ # Mongoose Schemas (User, Event)
├── views/ # EJS templates
├── public/ # Static files (CSS, JS, images) 
├── middleware/ # Auth checks
├── app.js # Main server entry point 
├── package.json 
└── .env # Environment variables


---

## 🚀 Getting Started

### 1. Clone the repository

git clone https://github.com/your-username/eventBurst.git
cd eventBirst

2.**Install dependencies:**
npm install

3.**Configure Environment Variables:**
Create a .env file:
DATABASE_URL=your_mongo_uri
SESSION_SECRET=your_session_secret

4.**Run the app**
npx nodemon app.js
Go to: http://localhost:3000

-------------------------------------------------------------------------------------
📸 Screenshots
![WonderLust - Google Chrome 25-04-2025 20_02_59](https://github.com/user-attachments/assets/fbd35f37-08f5-4984-9bea-d77668b007ad)
![WonderLust - Google Chrome 25-04-2025 20_02_28](https://github.com/user-attachments/assets/297c8c88-c65e-45ba-b728-d6e54e2aab70)
![WonderLust - Google Chrome 25-04-2025 20_02_13](https://github.com/user-attachments/assets/0e4f8511-4edb-4c02-bc2e-814c5c9f05e9)
![WonderLust - Google Chrome 25-04-2025 20_01_44](https://github.com/user-attachments/assets/9566ab09-a002-440c-8c9e-ba9f078a16db)
![WonderLust - Google Chrome 25-04-2025 20_01_33](https://github.com/user-attachments/assets/f9e41489-390f-487a-9e33-eb0249275e55)
![Student Innovation Center - Google Chrome 14-03-2025 19_16_06](https://github.com/user-attachments/assets/885453d0-9afb-4141-9a19-3e11f47a8723)

💡 Future Enhancements
📬 Email notifications for event confirmations

📥 Event materials/resources upload (PDFs, links)

📱 PWA support for offline access

📊 Admin analytics dashboard (charts, data insights)

📦 Deployment Options
Vercel (frontend only)

Render / Railway (full-stack with MongoDB Atlas)

Heroku (legacy support)

👨‍💻 Developer
Faiz Hussain
📧 faiz18513@gmail.com
🔗 github.com/princeiit423

📄 License
This project is licensed under the MIT License

Live Deployment Link:-
https://student-innovation-center.vercel.app/

Would you like me to help generate a matching logo or banner for this project as well?

