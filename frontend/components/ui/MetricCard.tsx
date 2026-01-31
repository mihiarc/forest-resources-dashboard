'use client';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export default function MetricCard({
  title,
  value,
  unit,
  subtitle,
  trend,
  icon,
  isLoading = false,
}: MetricCardProps) {
  const formattedValue =
    typeof value === 'number'
      ? value.toLocaleString(undefined, { maximumFractionDigits: 1 })
      : value;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            {title}
          </p>
          {isLoading ? (
            <div className="mt-2 h-9 w-24 bg-gray-200 rounded animate-pulse" />
          ) : (
            <div className="mt-2 flex items-baseline">
              <p className="text-3xl font-bold text-gray-900">{formattedValue}</p>
              {unit && <span className="ml-2 text-sm text-gray-500">{unit}</span>}
            </div>
          )}
          {!isLoading && subtitle && (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          )}
          {!isLoading && trend && (
            <div className="mt-2 flex items-center">
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.isPositive ? '+' : ''}
                {trend.value.toFixed(1)}%
              </span>
              <span className="text-xs text-gray-500 ml-1">vs previous</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 ml-4">
            <div className="w-12 h-12 bg-forest-100 rounded-full flex items-center justify-center text-forest-600">
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
