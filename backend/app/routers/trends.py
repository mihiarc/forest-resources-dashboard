"""Trends API endpoints."""

from fastapi import APIRouter, Depends, Query

from ..models.trends import ForestAreaTrendRecord, ForestAreaTrendResponse, TimeSeriesPoint, RegionalTrend
from ..services import DataLoader, get_data_loader

router = APIRouter()


@router.get("/forest-area", response_model=ForestAreaTrendResponse)
async def get_forest_area_trends(
    region: str | None = Query(None, description="Filter by region"),
    subregion: str | None = Query(None, description="Filter by subregion"),
    state: str | None = Query(None, description="Filter by state"),
    loader: DataLoader = Depends(get_data_loader),
) -> ForestAreaTrendResponse:
    """Get forest area trends from 1630 to 2022."""
    df = loader.get_forest_area_trends()

    # Apply filters
    if region:
        df = df[df["region"] == region]
    if subregion:
        df = df[df["subregion"] == subregion]
    if state:
        df = df[df["state"] == state]

    # Get year columns (they should be strings like "2022", "2017", etc.)
    year_columns = [col for col in df.columns if col not in ["region", "subregion", "state"]]

    # Convert to records
    records = []
    for _, row in df.iterrows():
        for year_col in year_columns:
            try:
                year = int(float(year_col))
                area = row.get(year_col)
                if area is not None and not (isinstance(area, float) and area != area):  # check for NaN
                    records.append(ForestAreaTrendRecord(
                        region=row["region"],
                        subregion=row["subregion"],
                        state=row["state"],
                        year=year,
                        area=float(area) if area else None,
                    ))
            except (ValueError, TypeError):
                continue

    # Get unique years
    years = sorted(set(r.year for r in records))

    return ForestAreaTrendResponse(
        data=records,
        years=years,
        total_records=len(records),
    )


@router.get("/forest-area/national")
async def get_national_forest_area_trend(
    loader: DataLoader = Depends(get_data_loader),
) -> list[TimeSeriesPoint]:
    """Get national total forest area trend."""
    df = loader.get_forest_area_trends()

    # Get year columns
    year_columns = [col for col in df.columns if col not in ["region", "subregion", "state"]]

    points = []
    for year_col in year_columns:
        try:
            year = int(float(year_col))
            total = df[year_col].sum()
            points.append(TimeSeriesPoint(year=year, value=total))
        except (ValueError, TypeError):
            continue

    # Sort by year
    points.sort(key=lambda x: x.year)
    return points


@router.get("/forest-area/by-region")
async def get_forest_area_by_region(
    loader: DataLoader = Depends(get_data_loader),
) -> list[RegionalTrend]:
    """Get forest area trends by region."""
    df = loader.get_forest_area_trends()

    # Get year columns
    year_columns = [col for col in df.columns if col not in ["region", "subregion", "state"]]

    regional_trends = []
    for region in df["region"].unique():
        region_df = df[df["region"] == region]
        points = []
        for year_col in year_columns:
            try:
                year = int(float(year_col))
                total = region_df[year_col].sum()
                points.append(TimeSeriesPoint(year=year, value=total))
            except (ValueError, TypeError):
                continue

        points.sort(key=lambda x: x.year)
        regional_trends.append(RegionalTrend(name=region, data=points))

    return regional_trends


@router.get("/growing-stock")
async def get_growing_stock_trends(
    region: str | None = Query(None, description="Filter by region"),
    loader: DataLoader = Depends(get_data_loader),
) -> list[dict]:
    """Get growing stock volume trends."""
    # This would use Table A-20, which has a complex structure
    # For now, return sample data structure
    years = [1953, 1963, 1977, 1987, 1997, 2007, 2012, 2017, 2022]

    # Return placeholder data - would need to parse A-20 properly
    return [
        {"year": year, "softwood": None, "hardwood": None, "total": None}
        for year in years
    ]
