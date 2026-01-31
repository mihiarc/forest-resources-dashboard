"""Ownership API endpoints."""

from fastapi import APIRouter, Depends, Query
import pandas as pd

from ..models.ownership import OwnershipRecord, OwnershipResponse, OwnershipBreakdown
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


@router.get("", response_model=OwnershipResponse)
async def get_ownership(
    region: str | None = Query(None, description="Filter by region"),
    subregion: str | None = Query(None, description="Filter by subregion"),
    state: str | None = Query(None, description="Filter by state"),
    loader: DataLoader = Depends(get_data_loader),
) -> OwnershipResponse:
    """Get ownership data with optional filters."""
    df = loader.get_ownership_data()

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
        records.append(OwnershipRecord(
            region=row["region"],
            subregion=row["subregion"],
            state=row["state"],
            all_ownerships=to_float_or_none(row.get("all_ownerships")),
            total_public=to_float_or_none(row.get("total_public")),
            total_federal=to_float_or_none(row.get("total_federal")),
            national_forest=to_float_or_none(row.get("national_forest")),
            blm=to_float_or_none(row.get("blm")),
            other_federal=to_float_or_none(row.get("other_federal")),
            state_owned=to_float_or_none(row.get("state_owned")),
            county_municipal=to_float_or_none(row.get("county_municipal")),
            total_private=to_float_or_none(row.get("total_private")),
            private_corporate=to_float_or_none(row.get("private_corporate")),
            private_noncorporate=to_float_or_none(row.get("private_noncorporate")),
        ))

    # Calculate summaries
    total_public = df["total_public"].sum()
    total_private = df["total_private"].sum()
    total_federal = df["total_federal"].sum()

    return OwnershipResponse(
        data=records,
        total_records=len(records),
        total_public=total_public,
        total_private=total_private,
        total_federal=total_federal,
    )


@router.get("/breakdown", response_model=list[OwnershipBreakdown])
async def get_ownership_breakdown(
    region: str | None = Query(None, description="Filter by region"),
    loader: DataLoader = Depends(get_data_loader),
) -> list[OwnershipBreakdown]:
    """Get ownership breakdown for visualization."""
    df = loader.get_ownership_data()

    if region:
        df = df[df["region"] == region]

    # Calculate totals for each category
    categories = {
        "National Forest": df["national_forest"].sum(),
        "BLM": df["blm"].sum(),
        "Other Federal": df["other_federal"].sum(),
        "State": df["state_owned"].sum(),
        "County & Municipal": df["county_municipal"].sum(),
        "Private Corporate": df["private_corporate"].sum(),
        "Private Noncorporate": df["private_noncorporate"].sum(),
    }

    total = sum(categories.values())
    breakdown = []
    for category, area in categories.items():
        if area > 0:
            breakdown.append(OwnershipBreakdown(
                category=category,
                area=area,
                percentage=round((area / total) * 100, 2) if total > 0 else 0,
            ))

    # Sort by area descending
    breakdown.sort(key=lambda x: x.area, reverse=True)
    return breakdown


@router.get("/by-region")
async def get_ownership_by_region(
    loader: DataLoader = Depends(get_data_loader),
) -> list[dict]:
    """Get ownership summary by region."""
    df = loader.get_ownership_data()

    results = []
    for region in df["region"].unique():
        region_df = df[df["region"] == region]
        total = region_df["all_ownerships"].sum()
        public = region_df["total_public"].sum()
        private = region_df["total_private"].sum()

        results.append({
            "region": region,
            "total": total,
            "public": public,
            "private": private,
            "public_percent": round((public / total) * 100, 2) if total > 0 else 0,
            "private_percent": round((private / total) * 100, 2) if total > 0 else 0,
        })

    return results
