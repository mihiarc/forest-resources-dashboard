"""Ownership Pydantic models."""

from pydantic import BaseModel


class OwnershipRecord(BaseModel):
    """Single ownership record for a state."""
    region: str
    subregion: str
    state: str
    all_ownerships: float | None = None
    total_public: float | None = None
    total_federal: float | None = None
    national_forest: float | None = None
    blm: float | None = None
    other_federal: float | None = None
    state_owned: float | None = None
    county_municipal: float | None = None
    total_private: float | None = None
    private_corporate: float | None = None
    private_noncorporate: float | None = None


class OwnershipResponse(BaseModel):
    """Response containing ownership data."""
    data: list[OwnershipRecord]
    total_records: int

    # Summary statistics
    total_public: float
    total_private: float
    total_federal: float


class OwnershipBreakdown(BaseModel):
    """Ownership breakdown for visualization."""
    category: str
    area: float
    percentage: float


class OwnershipTrendRecord(BaseModel):
    """Ownership data for a specific year."""
    region: str
    subregion: str
    state: str
    year: int
    all_ownerships: float | None = None
    total_public: float | None = None
    total_federal: float | None = None
    national_forest: float | None = None
    total_private: float | None = None
    private_corporate: float | None = None
    private_noncorporate: float | None = None
