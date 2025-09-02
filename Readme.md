# PrismAI 💰🤖

An AI-powered personal finance tracker with Google OAuth login, smart transaction parsing, and real-time dashboard updates.

---

## 📂 Project

PrismAI - financial tracker/
├── frontend/ # React + Vite + shadcn/ui (UI & Dashboard)
├── backend/ # Express.js + MongoDB (API & Auth)
├── docs/ # Documentation + screenshots + demo script
│ └── demo.md
├── README.md # You are here 🚀
├── .env.example # Environment variable template
└── package.json # Root dependencies

2️⃣ Setup Backend
cd PrismAI
cd backend
cd server
npm install
npm run dev
Backend runs by default on http://localhost:5000

3️⃣ Setup Frontend
cd PrismAI
cd frontend
npm install
npm run dev
Frontend runs by default on http://localhost:8081

🔑 Environment Variables
Copy .env.example → .env in both backend and frontend folders.

Backend .env

Available in backend file

MONGO_URI=your-mongodb-uri
JWT_SECRET=supersecretkey
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
OPENAI_API_KEY=your-openai-api-key

Frontend .env

Available in frontend file

VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id

📊 Features
✅ Google OAuth login
✅ Add transactions via AI parsing (e.g. "Bought coffee ₹200")
✅ Real-time WebSocket dashboard updates
✅ Dark/Light mode toggle
✅ Responsive design (desktop + mobile)
✅ MongoDB persistence

📖 Demo Script
See docs/demo.md for step-by-step demo instructions.

🛠 Tech Stack
Frontend: React, Vite, TypeScript, shadcn/ui, TailwindCSS
Backend: Express.js, MongoDB, JWT Auth
AI: OpenAI API
Auth: Google OAuth
