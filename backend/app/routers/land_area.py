"""Land area API endpoints."""

from fastapi import APIRouter, Depends, Query
import pandas as pd

from ..models.land_area import LandAreaRecord, LandAreaResponse, LandAreaSummary
from ..services import DataLoader, get_data_loader

router = APIRouter()


def to_float_or_none(value) -> float | None:
    """Convert pandas value to float or None."""
    if pd.isna(value):
        return None
    try:
        return float(value)
    except (ValueError, TypeError):
        return None


@router.get("", response_model=LandAreaResponse)
async def get_land_area(
    region: str | None = Query(None, description="Filter by region"),
    subregion: str | None = Query(None, description="Filter by subregion"),
    state: str | None = Query(None, description="Filter by state"),
    loader: DataLoader = Depends(get_data_loader),
) -> LandAreaResponse:
    """Get land area data with optional filters."""
    df = loader.get_land_area_data()

    # Apply filters
    if region:
        df = df[df["region"] == region]
    if subregion:
        df = df[df["subregion"] == subregion]
    if state:
        df = df[df["state"] == state]

    # Convert to records
    records = []
    for _, row in df.iterrows():
        records.append(LandAreaRecord(
            region=row["region"],
            subregion=row["subregion"],
            state=row["state"],
            total_land_area=to_float_or_none(row.get("total_land_area")),
            total_forest_land=to_float_or_none(row.get("total_forest_land")),
            total_timberland=to_float_or_none(row.get("total_timberland")),
            planted_timberland=to_float_or_none(row.get("planted_timberland")),
            natural_timberland=to_float_or_none(row.get("natural_timberland")),
            productive_reserved=to_float_or_none(row.get("productive_reserved")),
            unproductive_reserved=to_float_or_none(row.get("unproductive_reserved")),
            other_forest=to_float_or_none(row.get("other_forest")),
            woodland_area=to_float_or_none(row.get("woodland_area")),
            other_land=to_float_or_none(row.get("other_land")),
        ))

    # Calculate summaries
    total_land = df["total_land_area"].sum()
    total_forest = df["total_forest_land"].sum()
    total_timber = df["total_timberland"].sum()
    forest_percent = (total_forest / total_land * 100) if total_land > 0 else 0

    return LandAreaResponse(
        data=records,
        total_records=len(records),
        total_land_area=total_land,
        total_forest_land=total_forest,
        total_timberland=total_timber,
        forest_cover_percent=round(forest_percent, 2),
    )


@router.get("/summary/by-region", response_model=list[LandAreaSummary])
async def get_land_area_by_region(
    loader: DataLoader = Depends(get_data_loader),
) -> list[LandAreaSummary]:
    """Get land area summary by region."""
    df = loader.get_land_area_data()

    summaries = []
    for region in df["region"].unique():
        region_df = df[df["region"] == region]
        total_land = region_df["total_land_area"].sum()
        total_forest = region_df["total_forest_land"].sum()
        total_timber = region_df["total_timberland"].sum()
        forest_percent = (total_forest / total_land * 100) if total_land > 0 else 0

        summaries.append(LandAreaSummary(
            name=region,
            total_land_area=total_land,
            total_forest_land=total_forest,
            total_timberland=total_timber,
            forest_cover_percent=round(forest_percent, 2),
        ))

    return summaries


@router.get("/summary/by-state", response_model=list[LandAreaSummary])
async def get_land_area_by_state(
    region: str | None = Query(None, description="Filter by region"),
    loader: DataLoader = Depends(get_data_loader),
) -> list[LandAreaSummary]:
    """Get land area summary by state."""
    df = loader.get_land_area_data()

    if region:
        df = df[df["region"] == region]

    summaries = []
    for _, row in df.iterrows():
        total_land = to_float_or_none(row["total_land_area"]) or 0
        total_forest = to_float_or_none(row["total_forest_land"]) or 0
        total_timber = to_float_or_none(row["total_timberland"]) or 0
        forest_percent = (total_forest / total_land * 100) if total_land > 0 else 0

        summaries.append(LandAreaSummary(
            name=row["state"],
            total_land_area=total_land,
            total_forest_land=total_forest,
            total_timberland=total_timber,
            forest_cover_percent=round(forest_percent, 2),
        ))

    return summaries
