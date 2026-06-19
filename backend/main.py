from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Imports
from api.routes import router
from api.geo_routes import geo_router

load_dotenv()

app = FastAPI(title="Dzuka Agri API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. The team's LangGraph orchestrator route
app.include_router(router, prefix="/api")

# 2. YOUR new geospatial routes (This is the line that was missing!)
app.include_router(geo_router, prefix="/api/geo", tags=["Geospatial Data"])

@app.get("/")
def root():
    return {"message": "Dzuka Agri API is running"}