from pathlib import Path
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "U.S. Forest Resources API"
    app_version: str = "1.0.0"
    debug: bool = True

    # Data file path - relative to project root
    data_file: Path = Path("data/USForestResources_2022_AppendixTables.xlsx")

    # CORS settings
    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "https://forest-resources-dashboard.netlify.app",
    ]

    class Config:
        env_prefix = "FOREST_"


settings = Settings()
