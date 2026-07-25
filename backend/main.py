from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.auth import router as auth_router
from app.database.database import Base, engine
from app.models.user import User
from app.routers.upload import router as upload_router
from app.routers.interview import router as interview_router
from app.routers.evaluate import router as evaluate_router

app = FastAPI()
Base.metadata.create_all(bind=engine)

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health Check API
@app.get("/api/health")
def health():
    return {
        "status": "success",
        "message": "InterviewIQ API is running"
    }

# Auth Router
app.include_router(auth_router, prefix="/api/auth")
app.include_router(upload_router, prefix="/api/upload")
app.include_router(interview_router, prefix="/api/interview")
app.include_router(evaluate_router, prefix="/api/interview")