"""Common Pydantic models."""

from pydantic import BaseModel


class RegionInfo(BaseModel):
    """Region with its subregions."""
    name: str
    subregions: list[str]


class StateInfo(BaseModel):
    """State information."""
    name: str
    abbreviation: str
    region: str
    subregion: str


class FilterOptions(BaseModel):
    """Available filter options."""
    regions: list[RegionInfo]
    years: list[int]
