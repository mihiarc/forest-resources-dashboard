"""Forest dynamics API endpoints (growth, mortality, removals)."""

from fastapi import APIRouter, Depends, Query

from ..models.dynamics import DynamicsRecord, DynamicsResponse, DynamicsSummary, RegionalDynamics
from ..services import DataLoader, get_data_loader

router = APIRouter()


def parse_dynamics_table(df, metric_name: str) -> list[dict]:
    """Parse the complex dynamics table structure."""
    # These tables have: Region, Subregion, Species class, then year columns for different ownerships
    # For now, we'll extract the "All owners" columns
    records = []

    for _, row in df.iterrows():
        region = row.get("Region")
        subregion = row.get("Subregion")
        species = row.get("Species class")

        if region is None:
            continue

        # Look for "All owners: YEAR" columns
        for col in df.columns:
            if "All owners:" in str(col):
                try:
                    year = int(col.split(":")[1].strip())
                    value = row.get(col)
                    if value is not None and not (isinstance(value, float) and value != value):
                        records.append({
                            "region": region,
                            "subregion": subregion if subregion and str(subregion) != "nan" else None,
                            "species_group": species,
                            "year": year,
                            metric_name: float(value),
                        })
                except (ValueError, IndexError):
                    continue

    return records


@router.get("", response_model=DynamicsResponse)
async def get_dynamics(
    region: str | None = Query(None, description="Filter by region"),
    year: int | None = Query(None, description="Filter by year"),
    species: str | None = Query(None, description="Filter by species group (Softwood, Hardwood, Total)"),
    loader: DataLoader = Depends(get_data_loader),
) -> DynamicsResponse:
    """Get forest dynamics data (growth, mortality, removals)."""
    # Get all three datasets
    mortality_df = loader.get_mortality_data()
    growth_df = loader.get_growth_data()
    removals_df = loader.get_removals_data()

    # Parse each table
    mortality_data = parse_dynamics_table(mortality_df, "mortality")
    growth_data = parse_dynamics_table(growth_df, "growth")
    removals_data = parse_dynamics_table(removals_df, "removals")

    # Combine data by region, year, species
    combined = {}
    for item in mortality_data:
        key = (item["region"], item.get("subregion"), item["species_group"], item["year"])
        if key not in combined:
            combined[key] = {
                "region": item["region"],
                "subregion": item.get("subregion"),
                "species_group": item["species_group"],
                "year": item["year"],
                "growth": None,
                "mortality": None,
                "removals": None,
            }
        combined[key]["mortality"] = item.get("mortality")

    for item in growth_data:
        key = (item["region"], item.get("subregion"), item["species_group"], item["year"])
        if key not in combined:
            combined[key] = {
                "region": item["region"],
                "subregion": item.get("subregion"),
                "species_group": item["species_group"],
                "year": item["year"],
                "growth": None,
                "mortality": None,
                "removals": None,
            }
        combined[key]["growth"] = item.get("growth")

    for item in removals_data:
        key = (item["region"], item.get("subregion"), item["species_group"], item["year"])
        if key not in combined:
            combined[key] = {
                "region": item["region"],
                "subregion": item.get("subregion"),
                "species_group": item["species_group"],
                "year": item["year"],
                "growth": None,
                "mortality": None,
                "removals": None,
            }
        combined[key]["removals"] = item.get("removals")

    # Convert to records
    records = []
    for data in combined.values():
        # Calculate net change
        growth = data.get("growth") or 0
        mortality = data.get("mortality") or 0
        removals = data.get("removals") or 0
        net_change = growth - mortality - removals if growth else None

        record = DynamicsRecord(
            region=data["region"],
            subregion=data.get("subregion"),
            species_group=data["species_group"],
            year=data["year"],
            growth=data.get("growth"),
            mortality=data.get("mortality"),
            removals=data.get("removals"),
            net_change=net_change,
        )

        # Apply filters
        if region and record.region != region:
            continue
        if year and record.year != year:
            continue
        if species and record.species_group != species:
            continue

        records.append(record)

    # Get unique years
    years = sorted(set(r.year for r in records))

    return DynamicsResponse(
        data=records,
        years=years,
        total_records=len(records),
    )


@router.get("/summary")
async def get_dynamics_summary(
    year: int = Query(2022, description="Year for summary"),
    loader: DataLoader = Depends(get_data_loader),
) -> DynamicsSummary:
    """Get dynamics summary for a specific year."""
    response = await get_dynamics(year=year, species="Total", loader=loader)

    total_growth = sum(r.growth or 0 for r in response.data if r.subregion is None)
    total_mortality = sum(r.mortality or 0 for r in response.data if r.subregion is None)
    total_removals = sum(r.removals or 0 for r in response.data if r.subregion is None)
    net_change = total_growth - total_mortality - total_removals

    drain = total_mortality + total_removals
    sustainability_ratio = (total_growth / drain) if drain > 0 else 0

    return DynamicsSummary(
        year=year,
        total_growth=total_growth,
        total_mortality=total_mortality,
        total_removals=total_removals,
        net_change=net_change,
        sustainability_ratio=round(sustainability_ratio, 2),
    )


@router.get("/by-region")
async def get_dynamics_by_region(
    year: int = Query(2022, description="Year for data"),
    species: str = Query("Total", description="Species group"),
    loader: DataLoader = Depends(get_data_loader),
) -> list[RegionalDynamics]:
    """Get dynamics summary by region."""
    response = await get_dynamics(year=year, species=species, loader=loader)

    # Group by region (only top-level, where subregion is None)
    regional_data = {}
    for record in response.data:
        if record.subregion is not None:
            continue

        region = record.region
        if region not in regional_data:
            regional_data[region] = {
                "growth": 0,
                "mortality": 0,
                "removals": 0,
            }

        regional_data[region]["growth"] += record.growth or 0
        regional_data[region]["mortality"] += record.mortality or 0
        regional_data[region]["removals"] += record.removals or 0

    results = []
    for region, data in regional_data.items():
        net_change = data["growth"] - data["mortality"] - data["removals"]
        results.append(RegionalDynamics(
            region=region,
            growth=data["growth"],
            mortality=data["mortality"],
            removals=data["removals"],
            net_change=net_change,
        ))

    return results
