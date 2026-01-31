"""Data loading service with caching for Excel data."""

from functools import lru_cache
from pathlib import Path
from typing import Any

import pandas as pd
from rich import print

from ..config import settings


class DataLoader:
    """Loads and caches data from the U.S. Forest Resources Excel file."""

    def __init__(self, data_file: Path | None = None):
        self.data_file = data_file or settings.data_file
        self._excel_file: pd.ExcelFile | None = None
        self._cache: dict[str, pd.DataFrame] = {}

    @property
    def excel_file(self) -> pd.ExcelFile:
        """Lazy load the Excel file."""
        if self._excel_file is None:
            print(f"[blue]Loading Excel file: {self.data_file}[/blue]")
            self._excel_file = pd.ExcelFile(self.data_file)
        return self._excel_file

    def _clean_dataframe(self, df: pd.DataFrame) -> pd.DataFrame:
        """Clean DataFrame by handling missing values and converting types."""
        # Replace "--" and similar markers with NaN
        df = df.replace(["--", "-", "N/A", "n/a", ""], pd.NA)

        # Convert numeric columns
        for col in df.columns:
            if df[col].dtype == object:
                try:
                    df[col] = pd.to_numeric(df[col], errors="ignore")
                except (ValueError, TypeError):
                    pass

        return df

    def get_table(self, table_name: str, header_row: int = 1) -> pd.DataFrame:
        """Get a table by name with caching."""
        cache_key = f"{table_name}_{header_row}"
        if cache_key in self._cache:
            return self._cache[cache_key]

        df = pd.read_excel(self.excel_file, table_name, header=header_row)
        df = self._clean_dataframe(df)
        self._cache[cache_key] = df
        return df

    def get_land_area_data(self) -> pd.DataFrame:
        """Get Table A-1a: Land area by state."""
        df = self.get_table("Table A-1a")
        # Rename columns to be more consistent
        column_mapping = {
            "Region": "region",
            "Subregion": "subregion",
            "State": "state",
            "Total land area": "total_land_area",
            "Total forest land": "total_forest_land",
            "Total timberland": "total_timberland",
            "Total planted timberland": "planted_timberland",
            "Natural origin timberland": "natural_timberland",
            "Productive reserved": "productive_reserved",
            "Unproductive reserved": "unproductive_reserved",
            "Other forest": "other_forest",
            "Woodland area": "woodland_area",
            "Other land": "other_land",
        }
        df = df.rename(columns=column_mapping)
        # Filter out summary rows (where state is NaN but region is not)
        df = df[df["state"].notna()].copy()
        return df

    def get_ownership_data(self) -> pd.DataFrame:
        """Get Table A-2: Forest ownership by state."""
        df = self.get_table("Table A-2")
        column_mapping = {
            "Region": "region",
            "Subregion": "subregion",
            "State": "state",
            "All ownerships": "all_ownerships",
            "Total public": "total_public",
            "Total federal": "total_federal",
            "National forest": "national_forest",
            "Bureau of land management": "blm",
            "Bureau of Land Management": "blm",
            "Other": "other_federal",
            "State own": "state_owned",
            "State owned": "state_owned",
            "County and municipal": "county_municipal",
            "Total private": "total_private",
            "Private corporate": "private_corporate",
            "Private noncorporate": "private_noncorporate",
            "Woodland": "woodland",
        }
        df = df.rename(columns=column_mapping)
        df = df[df["state"].notna()].copy()
        return df

    def get_forest_area_trends(self) -> pd.DataFrame:
        """Get Table A-3: Forest area trends 1630-2022."""
        df = self.get_table("Table A-3")
        # This table has years as columns
        df = df.rename(columns={
            "Region": "region",
            "Subregion": "subregion",
            "State": "state",
        })
        # Convert year columns to strings for consistency
        year_cols = [col for col in df.columns if isinstance(col, (int, float)) and col > 1600]
        for col in year_cols:
            if col in df.columns:
                df = df.rename(columns={col: str(int(col))})
        df = df[df["state"].notna()].copy()
        return df

    def get_timberland_ownership_trends(self) -> pd.DataFrame:
        """Get Table A-10: Timberland by ownership 1953-2022."""
        df = self.get_table("Table A-10")
        column_mapping = {
            "Region": "region",
            "Subregion": "subregion",
            "State": "state",
            "Year": "year",
            "All ownerships": "all_ownerships",
            "Total public": "total_public",
            "Total Federal": "total_federal",
            "National forest": "national_forest",
            "Bureau of Land Management": "blm",
            "Other": "other_federal",
            "State owned": "state_owned",
            "County and municipal": "county_municipal",
            "Total private": "total_private",
            "Private corporate": "private_corporate",
            "Private noncorporate": "private_noncorporate",
        }
        df = df.rename(columns=column_mapping)
        return df

    def get_timber_volume(self) -> pd.DataFrame:
        """Get Table A-17: Timber volume by species."""
        df = self.get_table("Table A-17")
        column_mapping = {
            "Region": "region",
            "Subregion": "subregion",
            "State": "state",
            "All timber total": "all_timber_total",
            "All timber softwoods": "all_timber_softwoods",
            "All timber hardwoods": "all_timber_hardwoods",
            "Total growing stock": "growing_stock_total",
            "Softwoods growing stock": "growing_stock_softwoods",
            "Hardwoods growing stock": "growing_stock_hardwoods",
            "Total cull": "cull_total",
            "Softwoods cull": "cull_softwoods",
            "Hardwoods cull": "cull_hardwoods",
            "Total sound dead": "sound_dead_total",
            "Softwoods sound dead": "sound_dead_softwoods",
            "Hardwoods sound dead": "sound_dead_hardwoods",
        }
        df = df.rename(columns=column_mapping)
        df = df[df["state"].notna()].copy()
        return df

    def get_growing_stock_trends(self) -> pd.DataFrame:
        """Get Table A-20: Growing stock by ownership 1953-2022."""
        df = self.get_table("Table A-20")
        # This table has complex structure with year and ownership columns
        return df

    def get_mortality_data(self) -> pd.DataFrame:
        """Get Table A-33: Annual mortality 1952-2022."""
        df = self.get_table("Table A-33")
        return df

    def get_growth_data(self) -> pd.DataFrame:
        """Get Table A-34: Annual growth 1952-2022."""
        df = self.get_table("Table A-34")
        return df

    def get_removals_data(self) -> pd.DataFrame:
        """Get Table A-35: Annual removals 1952-2022."""
        df = self.get_table("Table A-35")
        return df

    def get_regions(self) -> list[dict[str, Any]]:
        """Get unique regions with their subregions."""
        df = self.get_land_area_data()
        regions = []
        for region in df["region"].unique():
            if pd.notna(region):
                subregions = df[df["region"] == region]["subregion"].unique().tolist()
                subregions = [s for s in subregions if pd.notna(s)]
                regions.append({"name": region, "subregions": subregions})
        return regions

    def get_states(self, region: str | None = None, subregion: str | None = None) -> list[str]:
        """Get states, optionally filtered by region or subregion."""
        df = self.get_land_area_data()
        if region:
            df = df[df["region"] == region]
        if subregion:
            df = df[df["subregion"] == subregion]
        states = df["state"].unique().tolist()
        return [s for s in states if pd.notna(s)]

    def preload_all(self) -> None:
        """Preload all commonly used tables into cache."""
        tables_to_load = [
            ("Table A-1a", self.get_land_area_data),
            ("Table A-2", self.get_ownership_data),
            ("Table A-3", self.get_forest_area_trends),
            ("Table A-17", self.get_timber_volume),
        ]
        for name, loader in tables_to_load:
            print(f"[blue]Preloading {name}...[/blue]")
            loader()
        print(f"[green]Preloaded {len(tables_to_load)} tables[/green]")


# Singleton instance
_data_loader: DataLoader | None = None


def get_data_loader() -> DataLoader:
    """Get the singleton DataLoader instance."""
    global _data_loader
    if _data_loader is None:
        _data_loader = DataLoader()
    return _data_loader
