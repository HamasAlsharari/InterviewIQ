# InterviewIQ 🎯
AI-powered technical interview practice platform with instant feedback.
InterviewIQ helps candidates practice technical interviews by generating AI-driven interview questions, evaluating answers, and producing detailed performance reports — all in one platform.

# ✨ Features
	•	🔐 User Authentication — Secure signup/login with JWT-based auth
	•	📄 Resume/CV Upload — Upload your CV to personalize the interview experience
	•	🤖 AI-Generated Questions — Dynamic interview questions powered by AI
	•	✅ Instant Answer Evaluation — Get real-time scoring and feedback on your responses
	•	📊 Performance Dashboard — Track your progress across sessions
	•	📑 PDF Interview Reports — Auto-generated, downloadable reports summarizing each session
	
# 🛠️ Tech Stack
# Backend
	•	Python with FastAPI
	•	SQLite database
	•	JWT authentication
	•	AI integration service for question generation & evaluation
	•	PDF generation service for interview reports
# Frontend
	•	React + TypeScript
	•	Component-based architecture (components, hooks, layouts, pages, services)

# 📁 Project Structure
InterviewIQ/
├── backend/
│   ├── app/
│   │   ├── core/          # JWT handling & security
│   │   ├── crud/          # Database operations
│   │   ├── database/      # DB connection/config
│   │   ├── models/        # SQLAlchemy models
│   │   ├── routers/        # API endpoints (auth, dashboard, evaluate, interview, report, upload)
│   │   ├── schemas/       # Pydantic schemas
│   │   └── services/      # AI service & PDF generation
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       ├── services/
│       ├── styles/
│       ├── types/
│       └── utils/
└── docs/

# 🚀 Getting Started
Prerequisites
	•	Python 3.10+
	•	Node.js 18+
	•	npm or yarn
Backend Setup
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
Create a .env file inside backend/ with the required variables (see below), then run:
python main.py
Frontend Setup
cd frontend
npm install
npm run dev
