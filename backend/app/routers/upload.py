from fastapi import APIRouter, UploadFile, File
import shutil
import os
from app.services.ai_service import generate_questions

from app.services.pdf_service import extract_text_from_pdf

router = APIRouter()

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/cv")
async def upload_cv(file: UploadFile = File(...)):

    file_path = os.path.join(
        UPLOAD_FOLDER,
        file.filename,
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    cv_text = extract_text_from_pdf(file_path)
    questions = generate_questions(cv_text)

    return {
        "status": "success",
        "filename": file.filename,
        "questions": questions,
    }