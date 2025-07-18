import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Check } from 'lucide-react';

const CoordinatesInput = ({ coordinates, onCoordinatesChange }) => {
  const { t } = useTranslation();
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [altitude, setAltitude] = useState('');
  const [errors, setErrors] = useState({});

  // Update inputs when coordinates prop changes
  useEffect(() => {
    if (coordinates) {
      setLatitude(coordinates.lat.toString());
      setLongitude(coordinates.lng.toString());
      setAltitude(coordinates.alt ? coordinates.alt.toString() : '');
    }
  }, [coordinates]);

  const validateCoordinates = (lat, lng, alt) => {
    const newErrors = {};

    // Validate latitude
    if (!lat || lat === '') {
      newErrors.latitude = 'Latitude is required';
    } else {
      const latNum = parseFloat(lat);
      if (isNaN(latNum) || latNum < -90 || latNum > 90) {
        newErrors.latitude = 'Latitude must be between -90 and 90';
      }
    }

    // Validate longitude
    if (!lng || lng === '') {
      newErrors.longitude = 'Longitude is required';
    } else {
      const lngNum = parseFloat(lng);
      if (isNaN(lngNum) || lngNum < -180 || lngNum > 180) {
        newErrors.longitude = 'Longitude must be between -180 and 180';
      }
    }

    // Validate altitude (optional)
    if (alt && alt !== '') {
      const altNum = parseFloat(alt);
      if (isNaN(altNum)) {
        newErrors.altitude = 'Altitude must be a valid number';
      }
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validateCoordinates(latitude, longitude, altitude);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const coords = {
        lat: parseFloat(latitude),
        lng: parseFloat(longitude),
        alt: altitude ? parseFloat(altitude) : null
      };
      onCoordinatesChange(coords);
    }
  };

  const handleLatitudeChange = (e) => {
    const value = e.target.value;
    setLatitude(value);
    
    // Clear error when user starts typing
    if (errors.latitude) {
      setErrors(prev => ({ ...prev, latitude: undefined }));
    }
  };

  const handleLongitudeChange = (e) => {
    const value = e.target.value;
    setLongitude(value);
    
    // Clear error when user starts typing
    if (errors.longitude) {
      setErrors(prev => ({ ...prev, longitude: undefined }));
    }
  };

  const handleAltitudeChange = (e) => {
    const value = e.target.value;
    setAltitude(value);
    
    // Clear error when user starts typing
    if (errors.altitude) {
      setErrors(prev => ({ ...prev, altitude: undefined }));
    }
  };

  const formatCoordinate = (value, precision = 6) => {
    const num = parseFloat(value);
    return isNaN(num) ? '' : num.toFixed(precision);
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <MapPin size={20} className="mr-2 text-purple-600" />
        {t('coordinatesInput')}
      </h3>

      <p className="text-sm text-gray-600 mb-4">
        {t('enterCoordinates')}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Latitude Input */}
        <div>
          <label htmlFor="latitude" className="label">
            {t('latitudeLabel')}
          </label>
          <input
            type="number"
            id="latitude"
            step="any"
            value={latitude}
            onChange={handleLatitudeChange}
            placeholder="41.008238"
            className={`input-field ${errors.latitude ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
          />
          {errors.latitude && (
            <p className="mt-1 text-sm text-red-600">{errors.latitude}</p>
          )}
        </div>

        {/* Longitude Input */}
        <div>
          <label htmlFor="longitude" className="label">
            {t('longitudeLabel')}
          </label>
          <input
            type="number"
            id="longitude"
            step="any"
            value={longitude}
            onChange={handleLongitudeChange}
            placeholder="28.978359"
            className={`input-field ${errors.longitude ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
          />
          {errors.longitude && (
            <p className="mt-1 text-sm text-red-600">{errors.longitude}</p>
          )}
        </div>

        {/* Altitude Input */}
        <div>
          <label htmlFor="altitude" className="label">
            {t('altitudeLabel')} <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="number"
            id="altitude"
            step="any"
            value={altitude}
            onChange={handleAltitudeChange}
            placeholder="100"
            className={`input-field ${errors.altitude ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
          />
          {errors.altitude && (
            <p className="mt-1 text-sm text-red-600">{errors.altitude}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn-primary w-full flex items-center justify-center"
        >
          <Check size={18} className="mr-2" />
          {t('setCoordinates')}
        </button>
      </form>

      {/* Current Coordinates Display */}
      {coordinates && (
        <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center mb-2">
            <MapPin size={16} className="text-purple-600 mr-2" />
            <span className="text-sm font-medium text-purple-800">
              Current Coordinates
            </span>
          </div>
          <div className="text-xs text-purple-600 space-y-1">
            <div className="font-mono">
              <strong>Lat:</strong> {formatCoordinate(coordinates.lat)}°
            </div>
            <div className="font-mono">
              <strong>Lng:</strong> {formatCoordinate(coordinates.lng)}°
            </div>
            {coordinates.alt && (
              <div className="font-mono">
                <strong>Alt:</strong> {formatCoordinate(coordinates.alt, 1)}m
              </div>
            )}
          </div>
        </div>
      )}

      {/* Helper Text */}
      <div className="mt-4 text-xs text-gray-500">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <strong>Latitude:</strong> North (+) / South (-)
          </div>
          <div>
            <strong>Longitude:</strong> East (+) / West (-)
          </div>
        </div>
        <div className="mt-2">
          <strong>Examples:</strong> Istanbul (41.008238, 28.978359), 
          New York (40.712776, -74.005974)
        </div>
      </div>
    </div>
  );
};

export default CoordinatesInput; 