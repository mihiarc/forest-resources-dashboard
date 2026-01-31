from pathlib import Path
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "U.S. Forest Resources API"
    app_version: str = "1.0.0"
    debug: bool = True

    # Data file path - relative to project root
    data_file: Path = Path("data/USForestResources_2022_AppendixTables.xlsx")

    # CORS settings - allow all origins for public API
    cors_origins: list[str] = ["*"]

    class Config:
        env_prefix = "FOREST_"


settings = Settings()
