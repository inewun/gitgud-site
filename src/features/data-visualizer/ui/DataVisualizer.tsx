import React from 'react';

interface DataVisualizerProps {
  data?: string[];
  className?: string;
}

export function DataVisualizer({ data = [], className = '' }: DataVisualizerProps) {
  return (
    <div className={`p-4 bg-card dark:bg-card rounded-lg shadow ${className}`}>
      <h2 className="text-xl font-semibold mb-4 text-foreground dark:text-foreground">
        Data Visualizer
      </h2>

      {data.length === 0 ? (
        <div className="text-muted-foreground dark:text-muted-foreground text-center py-8">
          No data available to visualize
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border dark:divide-border">
            <thead className="bg-subtle dark:bg-card">
              <tr>
                {Object.keys(data[0] || {}).map(key => (
                  <th
                    key={key}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground dark:text-muted-foreground uppercase tracking-wider"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-card dark:bg-card divide-y divide-border dark:divide-border">
              {data.map((item, index) => (
                <tr key={index}>
                  {Object.values(item).map((value: unknown, valueIndex) => (
                    <td
                      key={valueIndex}
                      className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground dark:text-muted-foreground"
                    >
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DataVisualizer;
