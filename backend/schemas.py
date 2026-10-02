from pydantic import BaseModel, Field

class ShipmentPayload(BaseModel):
    Origin_Port: str = Field(..., description="Origin port code, e.g., PORT09")
    Carrier: str = Field(..., description="Carrier code, e.g., V44_3")
    TPT: int = Field(..., ge=0, description="Transportation Processing Time in days")
    Service_Level: str = Field(..., description="Service level, e.g., CRF")
    Ship_ahead_day_count: int = Field(0, ge=0, description="Ship ahead day count")
    Customer: str = Field(..., description="Customer ID/code, e.g., V55_1")
    Product_ID: int = Field(..., description="Product ID number")
    Plant_Code: str = Field(..., description="Plant code, e.g., PLANT16")
    Destination_Port: str = Field(..., description="Destination port code, e.g., PORT09")
    Unit_quantity: int = Field(..., gt=0, description="Quantity of units")
    Weight: float = Field(..., gt=0.0, description="Shipment weight")
    Order_Date: str = Field(..., description="Order date formatted as YYYY-MM-DD")

class PredictionResponse(BaseModel):
    predicted_late_days: float
    risk_level: str
    status: str