from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas import ShipmentPayload, PredictionResponse
from predictor import predict_delay

app = FastAPI(title="Shipment Delay Prediction API")

# Allows your future React frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict", response_model=PredictionResponse)
def predict(payload: ShipmentPayload):
    try:
        # .model_dump() converts the validated Pydantic object into a Python dictionary
        result = predict_delay(payload.model_dump())
        return result
    except Exception as e:
        # The honest reality: returning raw 500 errors is bad for production security, 
        # but highly practical for debugging a 3rd-year academic project.
        raise HTTPException(status_code=500, detail=str(e))