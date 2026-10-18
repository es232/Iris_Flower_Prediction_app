
# main.py
# FastAPI backend for our Iris flower ML model.

from pathlib import Path

import joblib
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
# Find the saved model in this project's folder.
MODEL_PATH = Path(__file__).parent / "iris_knn_pipeline.joblib"

# Load the trained pipeline once when the server starts.
model = joblib.load(MODEL_PATH)

app = FastAPI(
    title="Iris Flower Prediction API",
    description="Predict an Iris flower species using ML.",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

# Define the four required input measurements.
# The limits help reject clearly invalid measurements.
class FlowerInput(BaseModel):
    sepal_length: float = Field(gt=0, le=10)
    sepal_width: float = Field(gt=0, le=10)
    petal_length: float = Field(gt=0, le=10)
    petal_width: float = Field(gt=0, le=10)


@app.get("/")
def home():
    return {
        "message": "Iris ML API is running!",
        "docs": "/docs"
    }


@app.post("/predict")
def predict_flower(flower: FlowerInput):
    # Convert the incoming measurements into a DataFrame.
    # Column names and order must match model training.
    input_data = pd.DataFrame([{
        "sepal_length": flower.sepal_length,
        "sepal_width": flower.sepal_width,
        "petal_length": flower.petal_length,
        "petal_width": flower.petal_width
    }])

    # Run inference with our saved preprocessing + KNN pipeline.
    prediction = model.predict(input_data)[0]

    return {
        "predicted_species": str(prediction),
        "input": flower.model_dump()
    }
