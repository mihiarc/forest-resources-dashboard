"""Region and state mappings for U.S. Forest Resources data."""

REGIONS = {
    "North": ["Northeast", "North Central"],
    "South": ["Southeast", "South Central"],
    "Rocky Mountain": ["Great Plains", "Intermountain"],
    "Pacific Coast": ["Alaska", "Pacific Northwest", "Pacific Southwest"],
}

SUBREGION_STATES = {
    "Northeast": [
        "Connecticut", "Delaware", "Maine", "Maryland", "Massachusetts",
        "New Hampshire", "New Jersey", "New York", "Pennsylvania",
        "Rhode Island", "Vermont", "West Virginia"
    ],
    "North Central": [
        "Illinois", "Indiana", "Iowa", "Michigan", "Minnesota", "Missouri",
        "Ohio", "Wisconsin", "Kansas", "Nebraska", "North Dakota", "South Dakota"
    ],
    "Southeast": [
        "Florida", "Georgia", "North Carolina", "South Carolina", "Virginia"
    ],
    "South Central": [
        "Alabama", "Arkansas", "Kentucky", "Louisiana", "Mississippi",
        "Oklahoma", "Tennessee", "Texas"
    ],
    "Great Plains": [
        "Kansas", "Nebraska", "North Dakota", "South Dakota"
    ],
    "Intermountain": [
        "Arizona", "Colorado", "Idaho", "Montana", "Nevada", "New Mexico",
        "Utah", "Wyoming"
    ],
    "Alaska": ["Alaska"],
    "Pacific Northwest": ["Oregon", "Washington"],
    "Pacific Southwest": ["California", "Hawaii"],
}

STATE_ABBREVIATIONS = {
    "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR",
    "California": "CA", "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE",
    "Florida": "FL", "Georgia": "GA", "Hawaii": "HI", "Idaho": "ID",
    "Illinois": "IL", "Indiana": "IN", "Iowa": "IA", "Kansas": "KS",
    "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
    "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS",
    "Missouri": "MO", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV",
    "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY",
    "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH", "Oklahoma": "OK",
    "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC",
    "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT",
    "Vermont": "VT", "Virginia": "VA", "Washington": "WA", "West Virginia": "WV",
    "Wisconsin": "WI", "Wyoming": "WY"
}

OWNERSHIP_CATEGORIES = [
    "National forest",
    "Bureau of Land Management",
    "Other federal",
    "State",
    "County and municipal",
    "Private corporate",
    "Private noncorporate",
]

SPECIES_GROUPS = ["Softwood", "Hardwood", "Total"]

LAND_CLASSES = [
    "Total land area",
    "Total forest land",
    "Total timberland",
    "Planted timberland",
    "Natural origin timberland",
    "Productive reserved",
    "Unproductive reserved",
    "Other forest",
    "Woodland area",
    "Other land",
]
