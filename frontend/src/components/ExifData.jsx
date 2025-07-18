import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  MapPin, 
  Camera, 
  ChevronDown, 
  ChevronUp,
  Clock,
  Mountain,
  Compass,
  Zap,
  Settings
} from 'lucide-react';

const ExifData = ({ gpsData, exifData, hasGPS }) => {
  const { t } = useTranslation();
  const [showFullExif, setShowFullExif] = useState(false);

  const formatValue = (value, unit = '') => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'number') {
      return `${value.toFixed(2)}${unit}`;
    }
    return `${value}${unit}`;
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return 'N/A';
    try {
      return new Date(dateTime).toLocaleDateString() + ' ' + new Date(dateTime).toLocaleTimeString();
    } catch {
      return dateTime;
    }
  };

  const ExifItem = ({ icon, label, value, className = '' }) => (
    <div className={`flex items-center justify-between py-2 border-b border-gray-100 ${className}`}>
      <span className="text-sm font-medium text-gray-600 flex items-center">
        {icon && React.cloneElement(icon, { size: 16, className: 'mr-1' })}
        {label}
      </span>
      <span className="text-sm text-gray-900 text-right">
        {value}
      </span>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* GPS Data Section */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <MapPin size={20} className="mr-2 text-green-600" />
          {t('gpsData')}
        </h3>

        {hasGPS && gpsData ? (
          <div className="space-y-2">
            <ExifItem
              icon={<MapPin />}
              label={t('latitude')}
              value={formatValue(gpsData.latitude, '°')}
            />
            <ExifItem
              icon={<MapPin />}
              label={t('longitude')}
              value={formatValue(gpsData.longitude, '°')}
            />
            {gpsData.altitude && (
              <ExifItem
                icon={<Mountain />}
                label={t('altitude')}
                value={formatValue(gpsData.altitude, ' m')}
              />
            )}
            {gpsData.timestamp && (
              <ExifItem
                icon={<Clock />}
                label={t('timestamp')}
                value={formatValue(gpsData.timestamp)}
              />
            )}
            {gpsData.imgDirection && (
              <ExifItem
                icon={<Compass />}
                label={t('direction')}
                value={formatValue(gpsData.imgDirection, '°')}
              />
            )}
            {gpsData.speed && (
              <ExifItem
                icon={<Zap />}
                label={t('speed')}
                value={formatValue(gpsData.speed, ' km/h')}
              />
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <MapPin size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">
              {t('noGpsData')}
            </p>
          </div>
        )}
      </div>

      {/* EXIF Data Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Camera size={20} className="mr-2 text-blue-600" />
            {t('exifData')}
          </h3>
          <button
            onClick={() => setShowFullExif(!showFullExif)}
            className="flex items-center text-sm text-primary-600 hover:text-primary-700 transition-colors"
          >
            {showFullExif ? 'Show Less' : 'Show More'}
            {showFullExif ? (
              <ChevronUp size={16} className="ml-1" />
            ) : (
              <ChevronDown size={16} className="ml-1" />
            )}
          </button>
        </div>

        <div className="space-y-2">
          {/* Basic Camera Info */}
          {(exifData.make || exifData.model) && (
            <ExifItem
              icon={<Camera />}
              label={t('camera')}
              value={`${exifData.make || ''} ${exifData.model || ''}`.trim() || 'N/A'}
            />
          )}
          
          {exifData.dateTimeOriginal && (
            <ExifItem
              icon={<Clock />}
              label={t('dateTime')}
              value={formatDateTime(exifData.dateTimeOriginal)}
            />
          )}

          {/* Basic Camera Settings */}
          {exifData.exposureTime && (
            <ExifItem
              label={t('exposureTime')}
              value={formatValue(exifData.exposureTime, 's')}
            />
          )}

          {exifData.fNumber && (
            <ExifItem
              label={t('aperture')}
              value={`f/${formatValue(exifData.fNumber)}`}
            />
          )}

          {exifData.iso && (
            <ExifItem
              label={t('iso')}
              value={formatValue(exifData.iso)}
            />
          )}

          {/* Extended EXIF (collapsible) */}
          {showFullExif && (
            <>
              {exifData.focalLength && (
                <ExifItem
                  label={t('focalLength')}
                  value={formatValue(exifData.focalLength, 'mm')}
                />
              )}

              {exifData.flash !== null && (
                <ExifItem
                  label={t('flash')}
                  value={formatValue(exifData.flash)}
                />
              )}

              {exifData.whiteBalance !== null && (
                <ExifItem
                  label={t('whiteBalance')}
                  value={formatValue(exifData.whiteBalance)}
                />
              )}

              {exifData.orientation && (
                <ExifItem
                  label={t('orientation')}
                  value={formatValue(exifData.orientation)}
                />
              )}

              {(exifData.xResolution || exifData.yResolution) && (
                <ExifItem
                  label={t('resolution')}
                  value={`${formatValue(exifData.xResolution)} x ${formatValue(exifData.yResolution)} DPI`}
                />
              )}

              {exifData.software && (
                <ExifItem
                  icon={<Settings />}
                  label={t('software')}
                  value={formatValue(exifData.software)}
                />
              )}

              {exifData.artist && (
                <ExifItem
                  label={t('artist')}
                  value={formatValue(exifData.artist)}
                />
              )}

              {exifData.copyright && (
                <ExifItem
                  label={t('copyright')}
                  value={formatValue(exifData.copyright)}
                />
              )}
            </>
          )}
        </div>

        {/* Summary Card */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <Camera size={18} className="text-blue-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-blue-800">
                EXIF Data Available
              </p>
              <p className="text-xs text-blue-600">
                {Object.values(exifData).filter(v => v !== null && v !== undefined).length} fields found
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExifData; 