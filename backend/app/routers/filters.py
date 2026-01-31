"""Filter options API endpoints."""

from fastapi import APIRouter, Depends

from ..models.common import RegionInfo, FilterOptions
from ..services import DataLoader, get_data_loader

router = APIRouter()


@router.get("/regions", response_model=list[RegionInfo])
async def get_regions(
    loader: DataLoader = Depends(get_data_loader),
) -> list[RegionInfo]:
    """Get available regions with their subregions."""
    regions_data = loader.get_regions()
    return [RegionInfo(**r) for r in regions_data]


@router.get("/states")
async def get_states(
    region: str | None = None,
    subregion: str | None = None,
    loader: DataLoader = Depends(get_data_loader),
) -> list[str]:
    """Get states, optionally filtered by region or subregion."""
    return loader.get_states(region=region, subregion=subregion)


@router.get("/years")
async def get_years() -> list[int]:
    """Get available years for trend data."""
    # Forest area trends go back to 1630
    trend_years = [1630, 1907, 1920, 1938, 1953, 1963, 1977, 1987, 1997, 2007, 2012, 2017, 2022]
    return trend_years


@router.get("/ownership-years")
async def get_ownership_years() -> list[int]:
    """Get available years for ownership trend data."""
    return [1953, 1977, 1987, 1997, 2007, 2012, 2017, 2022]


@router.get("/dynamics-years")
async def get_dynamics_years() -> list[int]:
    """Get available years for growth/mortality/removals data."""
    return [1952, 1976, 1996, 2006, 2011, 2016, 2022]
