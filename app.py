from fastapi import FastAPI, File, UploadFile, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uvicorn, uuid, json, time

app = FastAPI(title="MediX Prototype API")

# In-memory stores (replace with DB in production)
PRESCRIPTIONS = {}
REMINDERS = {}
COMPLIANCE = {}

# --- Models
class Medication(BaseModel):
    name: str
    dose: Optional[str] = None
    frequency: Optional[str] = None
    instructions: Optional[str] = None

class ScheduleRequest(BaseModel):
    prescription_id: str
    reminders: List[str]  # ISO timestamps or simple strings for demo

class ConfirmRequest(BaseModel):
    reminder_id: str
    patient_id: str
    action: str  # 'taken' | 'skipped'

# --- Mock OCR parser (very naive)
def mock_ocr_parse(image_bytes):
    # This returns a deterministic sample for demo purposes
    return {
        "medications": [
            {"name": "Metformin", "dose": "500 mg", "frequency": "twice a day", "instructions": "after food"},
            {"name": "Amlodipine", "dose": "5 mg", "frequency": "once a day", "instructions": "morning"}
        ]
    }

@app.post("/api/upload-prescription")
async def upload_prescription(file: UploadFile = File(...)):
    contents = await file.read()
    parsed = mock_ocr_parse(contents)
    prescription_id = str(uuid.uuid4())
    PRESCRIPTIONS[prescription_id] = {
        "id": prescription_id,
        "uploaded_at": time.time(),
        "parsed": parsed
    }
    return {"prescription_id": prescription_id, "parsed": parsed}

@app.get("/api/prescription/{prescription_id}")
def get_prescription(prescription_id: str):
    p = PRESCRIPTIONS.get(prescription_id)
    if not p:
        raise HTTPException(status_code=404, detail="Not found")
    return p

@app.post("/api/schedule-reminder")
def schedule_reminder(req: ScheduleRequest):
    if req.prescription_id not in PRESCRIPTIONS:
        raise HTTPException(status_code=404, detail="Prescription not found")
    created = []
    for r in req.reminders:
        rid = str(uuid.uuid4())
        REMINDERS[rid] = {"id": rid, "prescription_id": req.prescription_id, "scheduled_at": r, "status": "scheduled"}
        created.append(REMINDERS[rid])
    return {"created": created}

@app.post("/api/confirm-dose")
def confirm_dose(req: ConfirmRequest):
    if req.reminder_id not in REMINDERS:
        raise HTTPException(status_code=404, detail="Reminder not found")
    ev_id = str(uuid.uuid4())
    COMPLIANCE[ev_id] = {"id": ev_id, "reminder_id": req.reminder_id, "patient_id": req.patient_id, "action": req.action, "ts": time.time()}
    # mark reminder as done for demo
    REMINDERS[req.reminder_id]["status"] = "completed" if req.action == "taken" else "missed"
    return {"event": COMPLIANCE[ev_id]}

# Simple chat endpoint (mock RAG)
@app.post("/api/chat")
def chat(message: dict):
    # message: {"patient_id": "...", "text": "..."}
    text = message.get("text","").lower()
    if "when" in text and "metformin" in text:
        return {"answer": "Take Metformin with meals, twice a day. (Demo answer - consult your doctor for personalized advice.)", "sources": ["prescription"]}
    return {"answer": "I'm a demo Care-Companion. For safety-critical advice, please consult a licensed clinician.", "sources": []}

# Manual trigger to list reminders (for demo)
@app.get("/api/reminders")
def list_reminders():
    return {"reminders": list(REMINDERS.values())}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)