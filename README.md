# BhashaSetu AI

BhashaSetu AI is a production-ready AI agent platform designed to eliminate language and literacy barriers across India. 

"Understand Anything. In Any Indian Language."

## 🏗️ Architecture

This repository is structured as a monorepo:
*   **`bhashasetu-web/`**: Next.js React frontend built with Tailwind CSS v4, Web Speech API (STT & TTS), and Firebase client configuration.
*   **`bhashasetu-api/`**: FastAPI backend implementing 4 specialized AI agents utilizing the Google Gemini API.

---

## 🤖 Core Agents

1.  **Translation Agent**: Translates text and detects language across 11 Indian languages. Uses the client-side Web Speech API for voice interactions.
2.  **Explain Agent**: Simplifies complex documents/notices using 4 distinct personas (Child, Student, General, Senior Citizen).
3.  **Document Understanding Agent**: Uses Gemini Multimodal API to perform OCR, translate, explain, and generate action items from document images.
4.  **Emerging Career Guide Agent**: Recommends future career roadmaps, skills, and free resources (like NPTEL) in the user's local language.

---

## 🚀 Running Locally

### 1. Backend (FastAPI)
1. Navigate to the backend folder:
   ```bash
   cd bhashasetu-api
   ```
2. Create and activate your virtual environment:
   ```bash
   py -3.12 -m venv venv
   .\venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file and configure your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_key_here
   ```
5. Run the FastAPI development server:
   ```bash
   uvicorn main:app --reload
   ```

### 2. Frontend (Next.js)
1. Navigate to the frontend folder:
   ```bash
   cd bhashasetu-web
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

---

## ☁️ Deployment on GCP (Google Cloud Run)

Both services contain custom `Dockerfile` templates ready to be built and deployed via Google Cloud Run:

```bash
# Build & Deploy Backend
cd bhashasetu-api
gcloud builds submit --tag gcr.io/[PROJECT_ID]/bhashasetu-api
gcloud run deploy bhashasetu-api --image gcr.io/[PROJECT_ID]/bhashasetu-api --platform managed --allow-unauthenticated --set-env-vars GEMINI_API_KEY="[YOUR_KEY]"

# Build & Deploy Frontend
cd bhashasetu-web
gcloud builds submit --tag gcr.io/[PROJECT_ID]/bhashasetu-web
gcloud run deploy bhashasetu-web --image gcr.io/[PROJECT_ID]/bhashasetu-web --platform managed --allow-unauthenticated
```
