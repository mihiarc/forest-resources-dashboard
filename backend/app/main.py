from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from rich import print

from .config import settings
from .routers import (
    land_area_router,
    ownership_router,
    trends_router,
    timber_router,
    dynamics_router,
    filters_router,
)
from .services import get_data_loader


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    print("[green]Starting U.S. Forest Resources API...[/green]")
    # Pre-load data on startup
    loader = get_data_loader()
    loader.preload_all()
    print("[green]Data loaded successfully![/green]")
    yield
    print("[yellow]Shutting down...[/yellow]")


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="REST API for U.S. Forest Resources 2022 Appendix Tables data",
    lifespan=lifespan,
)

# Configure CORS - allow all origins for public API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(land_area_router, prefix="/api/land-area", tags=["Land Area"])
app.include_router(ownership_router, prefix="/api/ownership", tags=["Ownership"])
app.include_router(trends_router, prefix="/api/trends", tags=["Trends"])
app.include_router(timber_router, prefix="/api/timber", tags=["Timber"])
app.include_router(dynamics_router, prefix="/api/dynamics", tags=["Dynamics"])
app.include_router(filters_router, prefix="/api/filters", tags=["Filters"])


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "docs": "/docs",
        "endpoints": {
            "land_area": "/api/land-area",
            "ownership": "/api/ownership",
            "trends": "/api/trends",
            "timber": "/api/timber",
            "dynamics": "/api/dynamics",
            "filters": "/api/filters",
        },
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}
