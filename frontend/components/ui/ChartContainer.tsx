'use client';

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  isLoading?: boolean;
  error?: Error | null;
  className?: string;
}

export default function ChartContainer({
  title,
  subtitle,
  children,
  isLoading = false,
  error = null,
  className = '',
}: ChartContainerProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-100 ${className}`}>
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest-600" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-red-500">Error loading data: {error.message}</p>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
