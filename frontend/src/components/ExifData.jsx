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
  Settings,
  Download,
  FileText,
  Database,
  Hash,
  FileImage
} from 'lucide-react';

const ExifData = ({ gpsData, exifData, hasGPS, filename }) => {
  const { t } = useTranslation();
  const [exportLoading, setExportLoading] = useState('');



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

  const exportData = async (format) => {
    if (!filename) return;
    
    setExportLoading(format);
    try {
      const response = await fetch('/api/exif/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename,
          format,
          gpsData: gpsData || {},
          exifData: exifData || {}
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename.split('.')[0]}_exif_data.${format === 'markdown' ? 'md' : format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Export failed');
      }
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setExportLoading('');
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
      {/* EXIF Data Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Camera size={20} className="mr-2 text-blue-600" />
            {t('exifData')}
          </h3>
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
          
          {/* GPS Data in EXIF Section */}
          {hasGPS && gpsData && (
            <>
              <div style={{background: '#f0fdf4', padding: '8px', borderRadius: '8px', marginBottom: '8px'}}>
                <strong style={{color: '#166534'}}>GPS Koordinatları</strong>
              </div>
              <ExifItem
                icon={<MapPin />}
                label={t('latitude')}
                value={formatValue(gpsData.latitude, '°')}
                className="bg-green-50"
              />
              <ExifItem
                icon={<MapPin />}
                label={t('longitude')}
                value={formatValue(gpsData.longitude, '°')}
                className="bg-green-50"
              />
              {gpsData.altitude && (
                <ExifItem
                  icon={<Mountain />}
                  label={t('altitude')}
                  value={formatValue(gpsData.altitude, ' m')}
                  className="bg-green-50"
                />
              )}
              {gpsData.timestamp && (
                <ExifItem
                  icon={<Clock />}
                  label={t('gpsTimestamp')}
                  value={formatValue(gpsData.timestamp)}
                  className="bg-green-50"
                />
              )}
              {gpsData.imgDirection && (
                <ExifItem
                  icon={<Compass />}
                  label={t('direction')}
                  value={formatValue(gpsData.imgDirection, '°')}
                  className="bg-green-50"
                />
              )}
              {gpsData.speed && (
                <ExifItem
                  icon={<Zap />}
                  label={t('speed')}
                  value={formatValue(gpsData.speed, ' km/h')}
                  className="bg-green-50"
                />
              )}
            </>
          )}

          {/* Keywords and Description */}
          {exifData.keywords && (
            <ExifItem
              label={t('keywords')}
              value={formatValue(exifData.keywords)}
              className="bg-blue-50"
            />
          )}
          {exifData.description && (
            <ExifItem
              label={t('description')}
              value={formatValue(exifData.description)}
              className="bg-blue-50"
            />
          )}
          
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
          {(exifData.imageWidth || exifData.imageHeight) && (
            <ExifItem
              label={t('imageSize')}
              value={`${formatValue(exifData.imageWidth)} x ${formatValue(exifData.imageHeight)}`}
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
          {(exifData.lensMake || exifData.lensModel) && (
            <ExifItem
              label={t('lens')}
              value={`${exifData.lensMake || ''} ${exifData.lensModel || ''}`.trim() || 'N/A'}
            />
          )}
          {exifData.exposureProgram && (
            <ExifItem
              label={t('exposureProgram')}
              value={formatValue(exifData.exposureProgram)}
            />
          )}
          {exifData.meteringMode && (
            <ExifItem
              label={t('meteringMode')}
              value={formatValue(exifData.meteringMode)}
            />
          )}
          {exifData.digitalZoomRatio && (
            <ExifItem
              label={t('digitalZoom')}
              value={formatValue(exifData.digitalZoomRatio, 'x')}
            />
          )}
          {exifData.contrast && (
            <ExifItem
              label={t('contrast')}
              value={formatValue(exifData.contrast)}
            />
          )}
          {exifData.saturation && (
            <ExifItem
              label={t('saturation')}
              value={formatValue(exifData.saturation)}
            />
          )}
          {exifData.sharpness && (
            <ExifItem
              label={t('sharpness')}
              value={formatValue(exifData.sharpness)}
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

          {/* Show all other EXIF fields not already shown above */}
          {Object.entries(exifData)
            .filter(([key, value]) => {
              // List of keys already shown above
              const shownKeys = [
                'make','model','dateTime','dateTimeOriginal','exposureTime','fNumber','iso','focalLength','flash','whiteBalance','orientation','imageWidth','imageHeight','xResolution','yResolution','software','lensMake','lensModel','exposureProgram','meteringMode','digitalZoomRatio','contrast','saturation','sharpness','artist','copyright','latitude','longitude','altitude','timestamp','direction','speed','keywords','description'
              ];
              return value !== null && value !== undefined && value !== '' && !shownKeys.includes(key);
            })
            .map(([key, value]) => (
              <ExifItem
                key={key}
                label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                value={typeof value === 'object' ? JSON.stringify(value) : String(value)}
              />
            ))}
        </div>

        {/* Summary Card */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <Camera size={18} className="text-blue-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-blue-800">
                {t('exifDataAvailable')}
              </p>
              <p className="text-xs text-blue-600">
                {Object.values(exifData).filter(v => v !== null && v !== undefined).length} {t('fieldsFound')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Export EXIF Data Section */}
      {filename && (Object.keys(exifData).length > 0 || Object.keys(gpsData || {}).length > 0) && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Download size={20} className="mr-2 text-purple-600" />
            {t('exportExifData')}
          </h3>
          
          <p className="text-sm text-gray-600 mb-4">
            {t('exportDescription')}
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            {/* TXT Export */}
            <button
              onClick={() => exportData('txt')}
              disabled={exportLoading === 'txt'}
              className="flex items-center justify-center py-3 px-4 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:transform-none"
            >
              {exportLoading === 'txt' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('exporting')}
                </>
              ) : (
                <>
                  <FileText size={18} className="mr-2" />
                  TXT
                </>
              )}
            </button>

            {/* CSV Export */}
            <button
              onClick={() => exportData('csv')}
              disabled={exportLoading === 'csv'}
              className="flex items-center justify-center py-3 px-4 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:transform-none"
            >
              {exportLoading === 'csv' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('exporting')}
                </>
              ) : (
                <>
                  <Database size={18} className="mr-2" />
                  CSV
                </>
              )}
            </button>

            {/* JSON Export */}
            <button
              onClick={() => exportData('json')}
              disabled={exportLoading === 'json'}
              className="flex items-center justify-center py-3 px-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:transform-none"
            >
              {exportLoading === 'json' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('exporting')}
                </>
              ) : (
                <>
                  <Hash size={18} className="mr-2" />
                  JSON
                </>
              )}
            </button>

            {/* Markdown Export */}
            <button
              onClick={() => exportData('markdown')}
              disabled={exportLoading === 'markdown'}
              className="flex items-center justify-center py-3 px-4 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:transform-none"
            >
              {exportLoading === 'markdown' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('exporting')}
                </>
              ) : (
                <>
                  <FileImage size={18} className="mr-2" />
                  MD
                </>
              )}
            </button>
          </div>

          <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-xs text-purple-800">
              <strong>{t('exportInfo')}:</strong> {t('exportInfoDescription')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExifData; 