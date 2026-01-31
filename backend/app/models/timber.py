"""Timber volume Pydantic models."""

from pydantic import BaseModel


class TimberVolumeRecord(BaseModel):
    """Timber volume for a state."""
    region: str
    subregion: str
    state: str
    all_timber_total: float | None = None
    all_timber_softwoods: float | None = None
    all_timber_hardwoods: float | None = None
    growing_stock_total: float | None = None
    growing_stock_softwoods: float | None = None
    growing_stock_hardwoods: float | None = None
    cull_total: float | None = None
    cull_softwoods: float | None = None
    cull_hardwoods: float | None = None
    sound_dead_total: float | None = None
    sound_dead_softwoods: float | None = None
    sound_dead_hardwoods: float | None = None


class TimberVolumeResponse(BaseModel):
    """Response containing timber volume data."""
    data: list[TimberVolumeRecord]
    total_records: int

    # Summary statistics
    total_volume: float
    softwood_volume: float
    hardwood_volume: float
    softwood_percent: float
    hardwood_percent: float


class TimberBreakdown(BaseModel):
    """Timber breakdown for visualization."""
    category: str
    volume: float
    percentage: float
