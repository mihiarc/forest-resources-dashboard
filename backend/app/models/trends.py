"""Trends Pydantic models."""

from pydantic import BaseModel


class ForestAreaTrendRecord(BaseModel):
    """Forest area for a specific year."""
    region: str
    subregion: str
    state: str
    year: int
    area: float | None = None


class ForestAreaTrendResponse(BaseModel):
    """Response containing forest area trend data."""
    data: list[ForestAreaTrendRecord]
    years: list[int]
    total_records: int


class GrowingStockTrendRecord(BaseModel):
    """Growing stock volume for a specific year."""
    region: str
    subregion: str | None = None
    species_group: str
    year: int
    volume: float | None = None
    ownership: str | None = None


class TimeSeriesPoint(BaseModel):
    """Single point in a time series."""
    year: int
    value: float | None = None


class RegionalTrend(BaseModel):
    """Trend data for a region."""
    name: str
    data: list[TimeSeriesPoint]
