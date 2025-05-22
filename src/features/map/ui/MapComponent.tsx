import React from 'react';

interface MapComponentProps {
  className?: string;
  center?: { lat: number; lng: number };
  zoom?: number;
}

export function MapComponent({
  className = '',
  center = { lat: 51.505, lng: -0.09 },
  zoom = 13,
}: MapComponentProps) {
  return (
    <div
      className={`relative h-[400px] w-full bg-subtle dark:bg-card rounded-lg overflow-hidden ${className}`}
      data-testid="map-component"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">
          Map Component (latitude: {center.lat}, longitude: {center.lng}, zoom: {zoom})
        </p>
      </div>

      {/* Это заглушка. В реальном приложении здесь будет интеграция с картой */}
      <div className="absolute bottom-4 right-4 bg-card dark:bg-card p-2 rounded shadow">
        <div className="flex space-x-2">
          <button className="p-1 bg-subtle dark:bg-muted rounded">+</button>
          <button className="p-1 bg-subtle dark:bg-muted rounded">-</button>
        </div>
      </div>
    </div>
  );
}

export default MapComponent;
