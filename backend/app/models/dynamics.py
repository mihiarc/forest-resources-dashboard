"""Forest dynamics Pydantic models (growth, mortality, removals)."""

from pydantic import BaseModel


class DynamicsRecord(BaseModel):
    """Forest dynamics for a region/year."""
    region: str
    subregion: str | None = None
    species_group: str
    year: int
    growth: float | None = None
    mortality: float | None = None
    removals: float | None = None
    net_change: float | None = None


class DynamicsResponse(BaseModel):
    """Response containing forest dynamics data."""
    data: list[DynamicsRecord]
    years: list[int]
    total_records: int


class DynamicsSummary(BaseModel):
    """Summary of forest dynamics."""
    year: int
    total_growth: float
    total_mortality: float
    total_removals: float
    net_change: float
    sustainability_ratio: float  # Growth / (Mortality + Removals)


class RegionalDynamics(BaseModel):
    """Dynamics data for a specific region."""
    region: str
    growth: float
    mortality: float
    removals: float
    net_change: float
