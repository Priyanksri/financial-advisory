# 💰 AI-Powered Personal Finance Dashboard

A full-stack personal finance management application with AI-powered insights, interactive charts, and PDF report generation.

## 🌐 Live Demo

- **Frontend:** https://financial-advisory-fi9ba3wke-priyanksris-projects.vercel.app
- **Backend:** https://financial-advisory-backend.onrender.com

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure register/login with bcrypt password hashing
- 💳 **Transaction Management** — Add, view, filter and delete income/expense transactions
- 🎯 **Budget Tracking** — Set monthly budgets per category with animated progress bars
- 📊 **Interactive Charts** — Pie, Bar and Line charts powered by Recharts
- 🤖 **AI Financial Insights** — Personalized advice powered by Groq AI (LLaMA 3.3)
- 📄 **PDF Reports** — Download monthly financial reports with transaction history
- 🌙 **Dark UI** — Beautiful dark purple themed interface with Framer Motion animations

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React + Vite | UI Framework |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Recharts | Data Visualization |
| Axios | API Calls |
| React Router | Navigation |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | Server |
| MongoDB + Mongoose | Database |
| JWT + bcryptjs | Authentication |
| Groq AI (LLaMA 3.3) | AI Insights |
| html-pdf-node | PDF Generation |

### Deployment
| Service | Purpose |
|---|---|
| Vercel | Frontend Hosting |
| Render | Backend Hosting |
| MongoDB Atlas | Cloud Database |

---

## 📁 Project Structure

```
financial-advisory/
├── Backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── transactionController.js
│   │   ├── budgetController.js
│   │   ├── aiController.js
│   │   └── reportController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Transaction.js
│   │   └── Budget.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── transactionRoutes.js
│   │   ├── budgetRoutes.js
│   │   ├── aiRoutes.js
│   │   └── reportRoutes.js
│   └── server.js
│
└── frontend/
    └── src/
        ├── features/
        │   ├── auth/
        │   ├── dashboard/
        │   ├── transactions/
        │   ├── budgets/
        │   ├── ai/
        │   └── reports/
        ├── components/
        ├── context/
        ├── hooks/
        └── services/
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Groq API key

### 1. Clone the repository
```bash
git clone https://github.com/Priyanksri/financial-advisory.git
cd financial-advisory
```

### 2. Setup Backend
```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend/` folder:
```env
PORT=3000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
```

Start the backend:
```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
```

Update `src/services/api.js` with your backend URL:
```js
baseURL: 'http://localhost:3000/api'
```

Start the frontend:
```bash
npm run dev
```

### 4. Open the app
```
http://localhost:5173
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/get-me | Get logged in user |

### Transactions
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/transactions | Add transaction |
| GET | /api/transactions | Get all transactions |
| DELETE | /api/transactions/:id | Delete transaction |
| PATCH | /api/transactions/:id | Update transaction |

### Budgets
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/budgets | Set budget |
| GET | /api/budgets | Get all budgets |
| PATCH | /api/budgets/:id | Update budget |

### AI & Reports
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/ai/insights | Get AI insights |
| GET | /api/reports/pdf | Download PDF report |

---

## 🔐 Environment Variables

### Backend `.env`
```
PORT=3000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
GROQ_API_KEY=your_groq_key
```

---

## 👨‍💻 Author

**Priyank**
- GitHub: [@Priyanksri](https://github.com/Priyanksri)

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).