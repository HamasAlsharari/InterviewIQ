🎯 InterviewIQ

InterviewIQ is an AI-powered technical interview practice platform designed to help candidates prepare for technical interviews through realistic interview questions, AI-powered evaluation, and performance tracking.

The platform allows users to create an account, start technical interviews, answer generated questions, receive AI-based feedback and scores, and review their interview performance through a personalized dashboard.

⸻

🚀 Features

Feature	Description
🔐 User Authentication	Secure registration and login using JWT authentication
🎤 AI-Powered Interviews	Generate technical interview questions and practice answering them
🤖 AI Evaluation	Receive AI-powered feedback and scores for interview answers
📊 Performance Dashboard	View previous interviews, scores, and performance
📄 PDF Reports	Generate PDF reports containing interview results and evaluation
🛡️ Protected Routes	Restrict access to authenticated user pages

⸻

🛠️ Tech Stack

Frontend

Technology	Purpose
React	Building the user interface
React Router	Client-side routing
JavaScript	Application logic
HTML	Page structure
CSS	Styling
Axios	API communication

Backend

Technology	Purpose
Python	Backend development
FastAPI	REST API framework
Pydantic	Data validation
Uvicorn	Development server
JWT	User authentication

AI

Technology	Purpose
Groq API	AI-powered interview questions and evaluation

Development Tools

Tool	Purpose
Git	Version control
GitHub	Code hosting
Visual Studio Code	Development environment
Postman	API testing

⸻

📁 Project Structure

InterviewIQ/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar/
│   │   │
│   │   ├── pages/
│   │   │   ├── Home/
│   │   │   ├── Login/
│   │   │   ├── Register/
│   │   │   └── Dashboard/
│   │   │
│   │   └── ...
│   │
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── main.py
│   ├── ...
│   ├── .env
│   └── requirements.txt
│
├── .gitignore
└── README.md

⸻

⚙️ Installation & Setup

1. Clone the Repository

git clone https://github.com/HamasAlsharari/InterviewIQ.git
cd InterviewIQ

⸻

🔧 Backend Setup

1. Navigate to the Backend

cd backend

2. Create a Virtual Environment

python -m venv venv

Windows

venv\Scripts\activate

macOS / Linux

source venv/bin/activate

3. Install Dependencies

pip install -r requirements.txt

⸻

🔑 Environment Variables

Create a .env file inside the backend directory:

SECRET_KEY=your_secret_key
GROQ_API_KEY=your_groq_api_key

⚠️ Important: Never commit the .env file or expose your API keys publicly.

Make sure .env is included in .gitignore.

⸻

▶️ Run the Backend

Start the FastAPI development server:

uvicorn main:app --reload

The backend will run at:

http://127.0.0.1:8000

⸻

💻 Frontend Setup

1. Navigate to the Frontend

Open a new terminal:

cd frontend

2. Install Dependencies

npm install

3. Start the Development Server

npm run dev

The frontend will be available at:

http://localhost:5173

⸻

🔐 Authentication

InterviewIQ uses JWT-based authentication to protect user-specific resources.

Authentication Flow

User Registration
       ↓
     Login
       ↓
JWT Token Generated
       ↓
Authenticated Requests
       ↓
Protected Resources

The authentication system includes:

* User registration
* User login
* JWT token generation
* JWT token verification
* Protected routes
* Secure environment variables

⸻

🎤 Interview Workflow

The main interview workflow is:

Login
  ↓
Start Interview
  ↓
Generate Questions
  ↓
Answer Questions
  ↓
AI Evaluation
  ↓
Score & Feedback
  ↓
Interview Result
  ↓
Dashboard
  ↓
PDF Report

⸻

🤖 AI-Powered Evaluation

InterviewIQ integrates with the Groq API to provide AI-powered interview evaluation.

The AI evaluation process provides:

Evaluation	Description
📝 Answer Evaluation	Analyzes the candidate’s response
📊 Score	Provides a performance score
💬 Feedback	Gives feedback about the answer
💡 Improvement Areas	Highlights areas that can be improved

This allows users to practice technical interviews and receive immediate AI-generated feedback.

⸻

📊 Dashboard

The dashboard allows authenticated users to review their interview performance.

It provides information such as:

* Previous interviews
* Interview scores
* Evaluation results
* Interview history

⸻

📄 PDF Reports

InterviewIQ allows users to generate a PDF report containing their interview results and evaluation.

The report can be used to:

* Review interview performance
* Identify strengths
* Identify areas for improvement
* Keep a record of interview results

⸻

🧪 API Health Check

The backend provides a health-check endpoint:

GET /api/health

Example Response

{
  "status": "success",
  "message": "InterviewIQ API is running"
}

⸻

🔒 Security

InterviewIQ follows basic security practices to protect sensitive information and user data.

Security Practice	Implementation
🔑 API Keys	Stored in environment variables
🔐 Authentication	JWT-based authentication
🛡️ Protected Pages	Protected frontend routes
🚫 .env Protection	Excluded from Git
🔒 Secret Key	Loaded from environment variables

Never upload API keys, passwords, secret keys, or other sensitive credentials to GitHub.

⸻

🧹 Project Hygiene

Before publishing the project to GitHub, make sure the repository does not contain:

* .env files
* API keys or secret credentials
* Personal PDF reports
* Temporary test files
* Debug files
* Python cache files
* Unnecessary generated files

⸻

🎯 Project Goal

The goal of InterviewIQ is to provide a practical and accessible environment for technical interview preparation by combining:

Technical Interview Practice + Artificial Intelligence + Automated Evaluation + Performance Tracking

⸻

🔮 Future Improvements

Potential future improvements include:

* More technical interview categories
* Different interview difficulty levels
* Improved AI evaluation criteria
* Advanced performance analytics
* Interview history filtering
* Personalized improvement recommendations
* Additional report customization

⸻

👩‍💻 Author

Hamas Alsharari

Software Engineering Graduate

GitHub: HamasAlsharari

⸻

⭐ InterviewIQ

Practice. Improve. Get Interview Ready.
