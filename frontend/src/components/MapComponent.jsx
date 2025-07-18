import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import { MapPin, Crosshair } from 'lucide-react';
import L from 'leaflet';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom icons
const createCustomIcon = (color) => {
  return L.divIcon({
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    className: 'custom-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

const currentLocationIcon = createCustomIcon('#10b981'); // green
const selectedLocationIcon = createCustomIcon('#3b82f6'); // blue

// Component for handling map clicks
const MapClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect({ lat, lng });
    },
  });
  return null;
};

const MapComponent = ({ initialCoordinates, selectedCoordinates, onCoordinateSelect }) => {
  const { t } = useTranslation();
  const [mapCenter, setMapCenter] = useState([41.0082, 28.9784]); // Default to Istanbul
  const [mapZoom, setMapZoom] = useState(10);

  useEffect(() => {
    if (initialCoordinates) {
      setMapCenter([initialCoordinates.lat, initialCoordinates.lng]);
      setMapZoom(15);
    } else if (selectedCoordinates) {
      setMapCenter([selectedCoordinates.lat, selectedCoordinates.lng]);
      setMapZoom(15);
    }
  }, [initialCoordinates, selectedCoordinates]);

  const formatCoordinates = (coords) => {
    if (!coords) return 'N/A';
    return `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`;
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <MapPin size={20} className="mr-2 text-blue-600" />
          {t('mapTitle')}
        </h3>
        <div className="text-sm text-gray-500">
          <Crosshair size={16} className="inline mr-1" />
          {t('clickToSelect')}
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        {t('mapDescription')}
      </p>

      {/* Coordinates Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {initialCoordinates && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center mb-1">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium text-green-800">
                {t('currentLocation')}
              </span>
            </div>
            <p className="text-xs text-green-600 font-mono">
              {formatCoordinates(initialCoordinates)}
            </p>
          </div>
        )}

        {selectedCoordinates && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center mb-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium text-blue-800">
                {t('newLocation')}
              </span>
            </div>
            <p className="text-xs text-blue-600 font-mono">
              {formatCoordinates(selectedCoordinates)}
            </p>
          </div>
        )}
      </div>

      {/* Map Container */}
      <div className="relative">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '400px', width: '100%' }}
          className="rounded-lg border border-gray-200"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapClickHandler onLocationSelect={onCoordinateSelect} />
          
          {/* Current location marker (from EXIF) */}
          {initialCoordinates && (
            <Marker
              position={[initialCoordinates.lat, initialCoordinates.lng]}
              icon={currentLocationIcon}
            >
              <Popup>
                <div className="text-center">
                  <strong className="text-green-700">
                    {t('currentLocation')}
                  </strong>
                  <br />
                  <span className="text-sm font-mono">
                    {formatCoordinates(initialCoordinates)}
                  </span>
                  <br />
                  <span className="text-xs text-gray-500">
                    From EXIF data
                  </span>
                </div>
              </Popup>
            </Marker>
          )}
          
          {/* Selected location marker */}
          {selectedCoordinates && (
            <Marker
              position={[selectedCoordinates.lat, selectedCoordinates.lng]}
              icon={selectedLocationIcon}
            >
              <Popup>
                <div className="text-center">
                  <strong className="text-blue-700">
                    {t('newLocation')}
                  </strong>
                  <br />
                  <span className="text-sm font-mono">
                    {formatCoordinates(selectedCoordinates)}
                  </span>
                  <br />
                  <span className="text-xs text-gray-500">
                    Selected on map
                  </span>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>

        {/* Map overlay instructions */}
        {!selectedCoordinates && (
          <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-3 py-2 rounded-lg shadow-md">
            <p className="text-xs text-gray-600 flex items-center">
              <Crosshair size={14} className="mr-1" />
              Click anywhere on the map to set GPS coordinates
            </p>
          </div>
        )}
      </div>

      {/* Map Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-600">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-1 border border-white shadow-sm"></div>
          <span>Original GPS location</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-1 border border-white shadow-sm"></div>
          <span>Selected location</span>
        </div>
        <div className="flex items-center">
          <Crosshair size={12} className="mr-1" />
          <span>Click to select new location</span>
        </div>
      </div>
    </div>
  );
};

export default MapComponent; 