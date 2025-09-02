SETUP CHECKLIST

Backend
- cd server && npm install
- copy server/.env.example to server/.env and fill values
- npm run dev

Frontend
- npm install
- create .env with:
    VITE_API_URL=http://localhost:5000/api
    VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
- npm run dev

Use the app
- Click Sign in with Google.
- Add transactions with natural language; confirm and Save to persist.
- Dashboard shows total balance, monthly income/expenses, and recent transactions from MongoDB.