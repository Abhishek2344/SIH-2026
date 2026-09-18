from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

from app.config import settings
from app.database import Base, engine
from app.routes import (
    auth_router,
    centres_router,
    slots_router,
    bookings_router,
    queue_router,
    procurement_router,
    payments_router,
    notifications_router,
    staff_router,
    admin_router,
    websocket_router
)
from app.utils.seed_data import seed_database

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("smart_farmer")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Smart Farmer Procurement & Real-Time Queue Management Platform API",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local dev and network devices
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global unhandled error at {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred. Please try again later."}
    )

# Register routes
app.include_router(auth_router)
app.include_router(centres_router)
app.include_router(slots_router)
app.include_router(bookings_router)
app.include_router(queue_router)
app.include_router(procurement_router)
app.include_router(payments_router)
app.include_router(notifications_router)
app.include_router(staff_router)
app.include_router(admin_router)
app.include_router(websocket_router)

@app.on_event("startup")
def on_startup():
    logger.info("Initializing database schema...")
    Base.metadata.create_all(bind=engine)
    logger.info("Seeding initial demo data if needed...")
    try:
        seed_database()
    except Exception as e:
        logger.error(f"Error during initial seed: {e}")

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "database": settings.DATABASE_URL.split("://")[0]
    }

@app.get("/")
def root():
    return {
        "message": "Welcome to Smart Farmer Procurement & Queue Management Platform API",
        "docs": "/api/docs",
        "health": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
