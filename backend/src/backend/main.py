from fastapi import FastAPI

from backend.api.routes.nearby_predict import router as nearby_predict_router
from backend.api.routes.predict import router as predict_router

app = FastAPI(title="Flood Prediction API")
app.include_router(predict_router)
app.include_router(nearby_predict_router)


def main() -> None:
	import uvicorn

	uvicorn.run("backend.main:app", host="0.0.0.0", port=8000)
