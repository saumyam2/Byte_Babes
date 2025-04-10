import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from gender_bias import gender_bias_router
from ingest import ingest_controller
from rag import rag_controller, rag_service
from continuous_learning import continuous_learning_router


from databases import initialize_db

initialize_db()


app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure the _data/data_images directory exists
data_images_path = "_data/data_images"
os.makedirs(data_images_path, exist_ok=True)

# Mount static files directory
app.mount(
    "/data_images", StaticFiles(directory="_data/data_images"), name="data_images"
)

# Include only RAG and ingest routers
app.include_router(gender_bias_router.router)
app.include_router(rag_controller.router)
app.include_router(ingest_controller.router, tags=["knowledge-sources"])
app.include_router(continuous_learning_router.router)

# Initial ingest
print("Initial ingesting data...")
rag_service.ingest()
