'use client';

import { useState, useMemo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
} from 'react-simple-maps';
import { scaleQuantile } from 'd3-scale';
import { schemeGreens } from 'd3-scale-chromatic';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

// State name to abbreviation mapping
const STATE_ABBREVIATIONS: Record<string, string> = {
  Alabama: 'AL', Alaska: 'AK', Arizona: 'AZ', Arkansas: 'AR', California: 'CA',
  Colorado: 'CO', Connecticut: 'CT', Delaware: 'DE', Florida: 'FL', Georgia: 'GA',
  Hawaii: 'HI', Idaho: 'ID', Illinois: 'IL', Indiana: 'IN', Iowa: 'IA',
  Kansas: 'KS', Kentucky: 'KY', Louisiana: 'LA', Maine: 'ME', Maryland: 'MD',
  Massachusetts: 'MA', Michigan: 'MI', Minnesota: 'MN', Mississippi: 'MS',
  Missouri: 'MO', Montana: 'MT', Nebraska: 'NE', Nevada: 'NV', 'New Hampshire': 'NH',
  'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC',
  'North Dakota': 'ND', Ohio: 'OH', Oklahoma: 'OK', Oregon: 'OR', Pennsylvania: 'PA',
  'Rhode Island': 'RI', 'South Carolina': 'SC', 'South Dakota': 'SD', Tennessee: 'TN',
  Texas: 'TX', Utah: 'UT', Vermont: 'VT', Virginia: 'VA', Washington: 'WA',
  'West Virginia': 'WV', Wisconsin: 'WI', Wyoming: 'WY',
};

interface StateData {
  state: string;
  value: number;
}

interface USChoroplethProps {
  data: StateData[];
  metric: string;
  onStateClick?: (state: string) => void;
  selectedState?: string;
}

export default function USChoropleth({
  data,
  metric,
  onStateClick,
  selectedState,
}: USChoroplethProps) {
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const dataByState = useMemo(() => {
    const map = new Map<string, number>();
    data.forEach((item) => {
      map.set(item.state, item.value);
    });
    return map;
  }, [data]);

  const colorScale = useMemo(() => {
    const values = data.map((d) => d.value).filter((v) => v > 0);
    return scaleQuantile<string>()
      .domain(values)
      .range(schemeGreens[9] as unknown as string[]);
  }, [data]);

  const handleMouseMove = (
    event: React.MouseEvent,
    stateName: string,
    value: number | undefined
  ) => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltipPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top - 10,
    });
    setTooltipContent(
      `${stateName}: ${
        value !== undefined
          ? value.toLocaleString(undefined, { maximumFractionDigits: 1 })
          : 'N/A'
      } ${metric}`
    );
  };

  const handleMouseLeave = () => {
    setTooltipContent('');
  };

  return (
    <div className="relative">
      <ComposableMap
        projection="geoAlbersUsa"
        projectionConfig={{
          scale: 1000,
        }}
        style={{ width: '100%', height: 'auto' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const stateName = geo.properties.name;
              const value = dataByState.get(stateName);
              const isSelected = selectedState === stateName;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={value ? colorScale(value) : '#e5e7eb'}
                  stroke={isSelected ? '#166534' : '#fff'}
                  strokeWidth={isSelected ? 2 : 0.5}
                  style={{
                    default: {
                      outline: 'none',
                    },
                    hover: {
                      fill: '#15803d',
                      outline: 'none',
                      cursor: 'pointer',
                    },
                    pressed: {
                      outline: 'none',
                    },
                  }}
                  onMouseMove={(e) => handleMouseMove(e, stateName, value)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => onStateClick?.(stateName)}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Tooltip */}
      {tooltipContent && (
        <div
          className="absolute bg-gray-900 text-white text-sm px-2 py-1 rounded pointer-events-none z-10 whitespace-nowrap"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: 'translate(-50%, -100%)',
          }}
        >
          {tooltipContent}
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <span className="text-xs text-gray-500">Low</span>
        <div className="flex">
          {(schemeGreens[9] as unknown as string[]).map((color, i) => (
            <div
              key={i}
              className="w-6 h-4"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <span className="text-xs text-gray-500">High</span>
      </div>
    </div>
  );
}
