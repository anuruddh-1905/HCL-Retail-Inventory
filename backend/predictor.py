import os
import joblib
import pandas as pd

# 1. Define paths and load artifacts into memory globally
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")

model = joblib.load(os.path.join(MODEL_DIR, "rf_inventory_model.pkl"))
scaler = joblib.load(os.path.join(MODEL_DIR, "scaler.pkl"))
model_columns = joblib.load(os.path.join(MODEL_DIR, "model_columns.pkl"))

def predict_delay(data: dict) -> dict:
    df = pd.DataFrame([data])
    
    # 2. Feature Engineering: Match training setup
    order_dt = pd.to_datetime(df['Order_Date'])
    df['Order Month'] = order_dt.dt.month
    df['Order DayOfWeek'] = order_dt.dt.dayofweek
    
    # Map API schema names to original CSV column names
    rename_map = {
        'Origin_Port': 'Origin Port',
        'Service_Level': 'Service Level',
        'Ship_ahead_day_count': 'Ship ahead day count',
        'Product_ID': 'Product ID',
        'Plant_Code': 'Plant Code',
        'Destination_Port': 'Destination Port',
        'Unit_quantity': 'Unit quantity'
    }
    df = df.rename(columns=rename_map)
    df = df.drop(columns=['Order_Date'])
    
    # 3. Encoding & Alignment
    df_encoded = pd.get_dummies(df, drop_first=True)
    df_aligned = df_encoded.reindex(columns=model_columns, fill_value=0)
    
    # 4. Scaling
    scaled_data = scaler.transform(df_aligned)
    
    # 5. Inference
    prediction = float(model.predict(scaled_data)[0])
    prediction = max(0.0, round(prediction, 4))
    
    # 6. Business Logic: Risk Categorization
    if prediction < 0.5:
        risk = "LOW"
    elif prediction <= 1.5:
        risk = "MODERATE"
    else:
        risk = "HIGH"
        
    return {
        "predicted_late_days": prediction,
        "risk_level": risk,
        "status": "success"
    }