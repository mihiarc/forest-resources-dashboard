"""Land area Pydantic models."""

from pydantic import BaseModel


class LandAreaRecord(BaseModel):
    """Single land area record for a state."""
    region: str
    subregion: str
    state: str
    total_land_area: float | None = None
    total_forest_land: float | None = None
    total_timberland: float | None = None
    planted_timberland: float | None = None
    natural_timberland: float | None = None
    productive_reserved: float | None = None
    unproductive_reserved: float | None = None
    other_forest: float | None = None
    woodland_area: float | None = None
    other_land: float | None = None

    @property
    def forest_cover_percent(self) -> float | None:
        """Calculate forest cover percentage."""
        if self.total_land_area and self.total_forest_land:
            return (self.total_forest_land / self.total_land_area) * 100
        return None


class LandAreaResponse(BaseModel):
    """Response containing land area data."""
    data: list[LandAreaRecord]
    total_records: int

    # Summary statistics
    total_land_area: float
    total_forest_land: float
    total_timberland: float
    forest_cover_percent: float


class LandAreaSummary(BaseModel):
    """Summary of land area for a region or the whole country."""
    name: str
    total_land_area: float
    total_forest_land: float
    total_timberland: float
    forest_cover_percent: float
