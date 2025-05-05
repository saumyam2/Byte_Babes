import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from gender_bias import gender_bias_router
from ingest import ingest_controller
from rag import rag_controller, rag_service
from continuous_learning import continuous_learning_router
from referral import referral_content_router
from webscrape import web_scrape, webscrape_router
from skill_gap_analysis import skill_gap_router
from fallback_mechanism.fallback_router import router as fallback_router
from content_moderation.moderation_router import router as moderation_router
from linkedin_template.template_router import router as template_router
from career_pathway.career_router import router as career_router
from resume_builder.resume_router import router as builder_router
from intent_classifier.intent_router import router as intent_router
from cover_letter_generator.cover_letter_router import router as cover_letter_router


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
app.include_router(referral_content_router.router)
app.include_router(webscrape_router.router)
app.include_router(skill_gap_router.router)
app.include_router(fallback_router)
app.include_router(moderation_router)
app.include_router(template_router)
app.include_router(career_router)
app.include_router(builder_router)
app.include_router(intent_router)
app.include_router(cover_letter_router)

# Initial ingest
print("Initial ingesting data...")
rag_service.ingest()
web_scrape.setup()
