from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.routes.nearby_predict import router as nearby_predict_router
from backend.api.routes.predict import router as predict_router

app = FastAPI(title="Flood Prediction API")
app.add_middleware(
	CORSMiddleware,
	allow_origins=[
		"http://localhost:5173",
		"http://127.0.0.1:5173",
	],
	allow_credentials=False,
	allow_methods=["POST"],
	allow_headers=["Content-Type"],
)
app.include_router(predict_router)
app.include_router(nearby_predict_router)


def main() -> None:
	import uvicorn

	uvicorn.run("backend.main:app", host="0.0.0.0", port=8000)
