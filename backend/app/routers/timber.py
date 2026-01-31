"""Timber volume API endpoints."""

from fastapi import APIRouter, Depends, Query
import pandas as pd

from ..models.timber import TimberVolumeRecord, TimberVolumeResponse, TimberBreakdown
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


@router.get("", response_model=TimberVolumeResponse)
async def get_timber_volume(
    region: str | None = Query(None, description="Filter by region"),
    subregion: str | None = Query(None, description="Filter by subregion"),
    state: str | None = Query(None, description="Filter by state"),
    loader: DataLoader = Depends(get_data_loader),
) -> TimberVolumeResponse:
    """Get timber volume data with optional filters."""
    df = loader.get_timber_volume()

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
        records.append(TimberVolumeRecord(
            region=row["region"],
            subregion=row["subregion"],
            state=row["state"],
            all_timber_total=to_float_or_none(row.get("all_timber_total")),
            all_timber_softwoods=to_float_or_none(row.get("all_timber_softwoods")),
            all_timber_hardwoods=to_float_or_none(row.get("all_timber_hardwoods")),
            growing_stock_total=to_float_or_none(row.get("growing_stock_total")),
            growing_stock_softwoods=to_float_or_none(row.get("growing_stock_softwoods")),
            growing_stock_hardwoods=to_float_or_none(row.get("growing_stock_hardwoods")),
            cull_total=to_float_or_none(row.get("cull_total")),
            cull_softwoods=to_float_or_none(row.get("cull_softwoods")),
            cull_hardwoods=to_float_or_none(row.get("cull_hardwoods")),
            sound_dead_total=to_float_or_none(row.get("sound_dead_total")),
            sound_dead_softwoods=to_float_or_none(row.get("sound_dead_softwoods")),
            sound_dead_hardwoods=to_float_or_none(row.get("sound_dead_hardwoods")),
        ))

    # Calculate summaries
    total_volume = df["all_timber_total"].sum()
    softwood_volume = df["all_timber_softwoods"].sum()
    hardwood_volume = df["all_timber_hardwoods"].sum()
    softwood_percent = (softwood_volume / total_volume * 100) if total_volume > 0 else 0
    hardwood_percent = (hardwood_volume / total_volume * 100) if total_volume > 0 else 0

    return TimberVolumeResponse(
        data=records,
        total_records=len(records),
        total_volume=total_volume,
        softwood_volume=softwood_volume,
        hardwood_volume=hardwood_volume,
        softwood_percent=round(softwood_percent, 2),
        hardwood_percent=round(hardwood_percent, 2),
    )


@router.get("/breakdown", response_model=list[TimberBreakdown])
async def get_timber_breakdown(
    region: str | None = Query(None, description="Filter by region"),
    loader: DataLoader = Depends(get_data_loader),
) -> list[TimberBreakdown]:
    """Get timber volume breakdown for visualization."""
    df = loader.get_timber_volume()

    if region:
        df = df[df["region"] == region]

    # Calculate totals
    softwood = df["all_timber_softwoods"].sum()
    hardwood = df["all_timber_hardwoods"].sum()
    total = softwood + hardwood

    return [
        TimberBreakdown(
            category="Softwood",
            volume=softwood,
            percentage=round((softwood / total) * 100, 2) if total > 0 else 0,
        ),
        TimberBreakdown(
            category="Hardwood",
            volume=hardwood,
            percentage=round((hardwood / total) * 100, 2) if total > 0 else 0,
        ),
    ]


@router.get("/by-region")
async def get_timber_by_region(
    loader: DataLoader = Depends(get_data_loader),
) -> list[dict]:
    """Get timber volume summary by region."""
    df = loader.get_timber_volume()

    results = []
    for region in df["region"].unique():
        region_df = df[df["region"] == region]
        total = region_df["all_timber_total"].sum()
        softwood = region_df["all_timber_softwoods"].sum()
        hardwood = region_df["all_timber_hardwoods"].sum()

        results.append({
            "region": region,
            "total": total,
            "softwood": softwood,
            "hardwood": hardwood,
            "softwood_percent": round((softwood / total) * 100, 2) if total > 0 else 0,
            "hardwood_percent": round((hardwood / total) * 100, 2) if total > 0 else 0,
        })

    return results


@router.get("/by-state")
async def get_timber_by_state(
    region: str | None = Query(None, description="Filter by region"),
    loader: DataLoader = Depends(get_data_loader),
) -> list[dict]:
    """Get timber volume by state."""
    df = loader.get_timber_volume()

    if region:
        df = df[df["region"] == region]

    results = []
    for _, row in df.iterrows():
        total = row["all_timber_total"] or 0
        softwood = row["all_timber_softwoods"] or 0
        hardwood = row["all_timber_hardwoods"] or 0

        results.append({
            "state": row["state"],
            "region": row["region"],
            "subregion": row["subregion"],
            "total": total,
            "softwood": softwood,
            "hardwood": hardwood,
        })

    # Sort by total descending
    results.sort(key=lambda x: x["total"], reverse=True)
    return results
