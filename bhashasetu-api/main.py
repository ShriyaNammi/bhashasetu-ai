import os
import json
import logging
from typing import List, Optional
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv
import google.generativeai as genai

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("bhashasetu-api")

# Load environment variables
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    logger.error("GEMINI_API_KEY not found in environment variables!")
else:
    genai.configure(api_key=GEMINI_API_KEY)

app = FastAPI(title="BhashaSetu AI API", version="1.0.0")

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------------------------------
# Pydantic Schemas for Requests and Responses
# ----------------------------------------------------

class TranslateRequest(BaseModel):
    text: str
    target_lang: str

class TranslateResponse(BaseModel):
    translated_text: str
    detected_lang: str

class ExplainRequest(BaseModel):
    text: str
    persona: str  # child, student, general, senior
    target_lang: str

class ExplainResponse(BaseModel):
    explanation: str
    original_summary: str

class DocumentResponse(BaseModel):
    ocr_text: str
    translation: str
    explanation: str
    action_items: List[str]

class CareerRequest(BaseModel):
    query: str
    target_lang: str

class CareerItem(BaseModel):
    title: str
    description: str
    required_skills: List[str]
    stream: str
    resources: List[str]
    roadmap: List[str]

class CareerResponse(BaseModel):
    careers: List[CareerItem]

# ----------------------------------------------------
# Helper to get Gemini Model
# ----------------------------------------------------
def get_gemini_model(model_name: str = "gemini-2.5-flash"):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key is not configured on the server.")
    return genai.GenerativeModel(model_name)

# ----------------------------------------------------
# Endpoints
# ----------------------------------------------------

@app.get("/")
def read_root():
    return {"message": "BhashaSetu AI API is running!"}

@app.post("/api/translate", response_model=TranslateResponse)
async def translate_text(req: TranslateRequest):
    try:
        model = get_gemini_model()
        prompt = f"""
        You are a highly accurate translation assistant for Indian languages.
        Translate the following text into "{req.target_lang}".
        Also, detect the source language of the text.
        
        Source Text: "{req.text}"
        
        Return ONLY a JSON object matching this schema:
        {{
            "translated_text": "translated text here",
            "detected_lang": "detected source language name here"
        }}
        """
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        data = json.loads(response.text)
        return TranslateResponse(**data)
    except Exception as e:
        logger.error(f"Error in translate: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/explain", response_model=ExplainResponse)
async def explain_text(req: ExplainRequest):
    try:
        model = get_gemini_model()
        
        # Define persona guidance
        persona_guide = {
            "child": "Explain this to a 10-year-old child using simple language, stories, or analogies. Avoid jargon.",
            "student": "Explain this with educational context, definitions, illustrative examples, and key learning takeaways.",
            "general": "Provide a simple, direct, and practical explanation. Make it clear and easy to understand for everyday use.",
            "senior": "Explain this in a slow, conversational, and warm tone, focusing on clarity, comfort, and reassuring guidance."
        }.get(req.persona.lower(), "Provide a simple practical explanation.")
        
        prompt = f"""
        You are BhashaSetu's Explain Agent. Your task is to explain the text below in a simplified manner.
        
        Text to explain: "{req.text}"
        Persona context: {persona_guide}
        Target language: "{req.target_lang}"
        
        Translate and explain the text under the requested persona into the target language.
        Return ONLY a JSON object matching this schema:
        {{
            "explanation": "simplified explanation in target language",
            "original_summary": "one-sentence summary of the original text in target language"
        }}
        """
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        data = json.loads(response.text)
        return ExplainResponse(**data)
    except Exception as e:
        logger.error(f"Error in explain: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/document", response_model=DocumentResponse)
async def document_understand(
    file: UploadFile = File(...),
    target_lang: str = Form("Hindi"),
    persona: str = Form("general")
):
    try:
        model = get_gemini_model()
        
        contents = await file.read()
        image_part = {
            "mime_type": file.content_type,
            "data": contents
        }
        
        prompt = f"""
        You are BhashaSetu's Document Understanding Agent.
        Analyze the uploaded image document (which could be a government notice, medical prescription, bank receipt, educational certificate, signboard, etc.).
        
        1. Extract the text (OCR) in its original language.
        2. Translate it into "{target_lang}".
        3. Provide a simplified explanation tailored for the persona: "{persona}" in "{target_lang}".
        4. Detail clear, action-oriented items or next steps for the user in "{target_lang}".
        
        Return ONLY a JSON object matching this schema:
        {{
            "ocr_text": "raw extracted text from the image",
            "translation": "translated text in target_lang",
            "explanation": "simplified explanation in target_lang",
            "action_items": ["action item 1", "action item 2", ...]
        }}
        """
        response = model.generate_content(
            [image_part, prompt],
            generation_config={"response_mime_type": "application/json"}
        )
        data = json.loads(response.text)
        return DocumentResponse(**data)
    except Exception as e:
        logger.error(f"Error in document understanding: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/career", response_model=CareerResponse)
async def career_guide(req: CareerRequest):
    try:
        model = get_gemini_model()
        prompt = f"""
        You are BhashaSetu's Emerging Career Guide Agent.
        Provide career guidance for the query: "{req.query}".
        Focus on emerging industries (AI, clean energy, space tech, robotics, cybersecurity, etc.).
        
        Give recommendations in "{req.target_lang}".
        
        Return ONLY a JSON object matching this schema:
        {{
            "careers": [
                {{
                    "title": "Job Title (e.g. AI Engineer / AI इंजीनियर)",
                    "description": "Simple description of what they do and why it is important (in target_lang)",
                    "required_skills": ["skill 1", "skill 2", ...],
                    "stream": "Recommended stream/subject path (e.g. Science with Math) (in target_lang)",
                    "resources": ["Free resource 1 (e.g. NPTEL)", "Free resource 2", ...],
                    "roadmap": ["Step 1", "Step 2", "Step 3", ...]
                }}
            ]
        }}
        """
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        data = json.loads(response.text)
        return CareerResponse(**data)
    except Exception as e:
        logger.error(f"Error in career guide: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
