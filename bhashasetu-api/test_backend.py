import os
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "BhashaSetu AI API is running!"}
    print("[OK] Root endpoint working")

def test_translation():
    payload = {
        "text": "Hello, how are you doing today?",
        "target_lang": "Hindi"
    }
    response = client.post("/api/translate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "translated_text" in data
    assert "detected_lang" in data
    print("[OK] Translation Agent working")
    print(f"  Input: {payload['text']}")
    print(f"  Output ({data['detected_lang']} -> Hindi): {data['translated_text']}")

def test_explain():
    payload = {
        "text": "The repository is a collection of resources that can be accessed by multiple processes simultaneously.",
        "persona": "child",
        "target_lang": "Hindi"
    }
    response = client.post("/api/explain", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "explanation" in data
    assert "original_summary" in data
    print("[OK] Explain Agent working (Child persona)")
    print(f"  Input: {payload['text']}")
    print(f"  Explanation: {data['explanation']}")

def test_career():
    payload = {
        "query": "Renewable Energy jobs in 2030",
        "target_lang": "Hindi"
    }
    response = client.post("/api/career", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "careers" in data
    assert len(data["careers"]) > 0
    career = data["careers"][0]
    assert "title" in career
    assert "description" in career
    assert "roadmap" in career
    print("[OK] Career Guide Agent working")
    print(f"  Career Recommendation: {career['title']}")

if __name__ == "__main__":
    print("Starting backend integration tests...")
    test_root()
    try:
        test_translation()
    except Exception as e:
        print(f"[ERROR] Translation test failed: {e}")
        
    try:
        test_explain()
    except Exception as e:
        print(f"[ERROR] Explain test failed: {e}")
        
    try:
        test_career()
    except Exception as e:
        print(f"[ERROR] Career test failed: {e}")
