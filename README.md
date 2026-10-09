# AI Coastal Flood Intelligence

A React and FastAPI application for exploring nearby flood predictions on an interactive map. The dashboard displays model probabilities, SHAP feature contributions, backend-generated explanations, and nearby facilities for locations predicted to flood.

> Demo mode simulates more severe rainfall and water-level inputs for demonstration purposes. Its predictions are simulated and must not be used as real-world flood warnings.

## Features

- Interactive Leaflet map with location selection and browser geolocation.
- Five nearby prediction points returned by `POST /predict/nearby`.
- Flood probabilities, estimated water levels, and SHAP values for each prediction.
- Backend-generated AI explanations through Groq.
- Emergency priority list synchronized with map selection.
- Nearby facility lookup for predictions classified as floods.
- Demo mode that sends `demo_mode: true` or `false` to the prediction API.
- Emergency contact information and an SOS action.

## Project layout

```text
.
├── backend/
│   ├── src/backend/
│   │   ├── api/routes/       # Prediction API routes
│   │   ├── ml/               # Flood model artifact
│   │   └── services/         # Model, weather, explanation, and facility services
│   └── pyproject.toml
└── frontend/
    ├── src/
    │   ├── components/       # Dashboard, map, insights, and emergency UI
    │   ├── pages/
    │   ├── services/         # Backend API client
    │   └── types/
    └── package.json
Requirements
- Node.js and npm
- Python 3.14 or newer
- uv for Python dependency management
- A Groq API key for generating prediction explanations
The backend also calls Open-Meteo for weather data and Overpass for nearby facility information.
Configuration
Create backend/.env and set the Groq API key:
GROQ_API_KEY=your_groq_api_key
Optional backend settings:
GROQ_MODEL=qwen/qwen3.8-27b
DEMO_FEATURE_MULTIPLIER=2.0
CONSTANT_WATER_LEVEL=5.0
FACILITY_SEARCH_RADIUS_METRES=5000
DEMO_FEATURE_MULTIPLIER must be a finite number greater than 1. When demo mode is enabled, the backend multiplies rainfall and water-level model inputs by this value. The API response includes demo metadata, and the generated explanation identifies the result as simulated.
The frontend uses http://localhost:8000 as its default API URL. To override it, create frontend/.env.local:
VITE_API_BASE_URL=http://localhost:8000
Keep API keys and other secrets private; do not commit them.
Run locally
Start the backend from one terminal:
cd backend
uv sync  
uv run uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
Start the frontend from another terminal:
cd frontend
npm ci
npm run dev
Open the local URL printed by Vite, usually http://localhost:5173. The backend provides interactive API documentation at http://localhost:8000/docs.
The backend CORS configuration allows the frontend origins http://localhost:5173 and http://127.0.0.1:5173.
API
POST /predict/nearby
Request body:
{
  "latitude": 12.97,
  "longitude": 77.59,
  "demo_mode": false
}
demo_mode is optional and defaults to false. The dashboard sends its current toggle state with each nearby-prediction request.
The response contains five nearby predictions. Each prediction includes latitude, longitude, estimated water level, flood prediction, flood probability, SHAP values, an explanation, and facility information. Demo responses also include demo-mode metadata.
POST /predict
Accepts a single prediction's model features and returns its prediction, probability, and SHAP values. The request uses the model's feature names, such as Latitude, Rainfall (mm), and Water Level (m). See backend/src/backend/api/routes/predict.py for the complete request schema.
Development checks
Run these commands from frontend/:
npm run lint
npm run build
The build runs the TypeScript project build before creating the Vite production bundle. The frontend currently has no test script.i
