import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, HardDrive, Maximize, MapPin, CheckCircle, XCircle } from 'lucide-react';

const ImageInfo = ({ imageData }) => {
  const { t } = useTranslation();

  if (!imageData) return null;

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatCoordinates = (coordinates) => {
    if (!coordinates) return 'N/A';
    return `${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}`;
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <FileText size={20} className="mr-2 text-primary-600" />
        {t('imageInfo')}
      </h3>

      <div className="space-y-4">
        {/* File Name */}
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-600">
            {t('fileName')}
          </span>
          <span className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">
            {imageData.originalName}
          </span>
        </div>

        {/* File Size */}
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-600 flex items-center">
            <HardDrive size={16} className="mr-1" />
            {t('fileSize')}
          </span>
          <span className="text-sm text-gray-900">
            {formatFileSize(imageData.size)}
          </span>
        </div>

        {/* GPS Status */}
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-600 flex items-center">
            <MapPin size={16} className="mr-1" />
            {t('hasGPS')}
          </span>
          <div className="flex items-center">
            {imageData.hasGPS ? (
              <>
                <CheckCircle size={16} className="text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">
                  {t('yes')}
                </span>
              </>
            ) : (
              <>
                <XCircle size={16} className="text-red-500 mr-1" />
                <span className="text-sm text-red-600 font-medium">
                  {t('no')}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Coordinates */}
        {imageData.coordinates && (
          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-medium text-gray-600">
              Current GPS
            </span>
            <span className="text-sm text-gray-900 font-mono bg-green-50 px-2 py-1 rounded border border-green-200">
              {formatCoordinates(imageData.coordinates)}
            </span>
          </div>
        )}
      </div>

      {/* GPS Status Card */}
      <div className={`mt-4 p-3 rounded-lg border ${
        imageData.hasGPS 
          ? 'bg-green-50 border-green-200' 
          : 'bg-yellow-50 border-yellow-200'
      }`}>
        <div className="flex items-center">
          {imageData.hasGPS ? (
            <>
              <CheckCircle size={18} className="text-green-500 mr-2" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  GPS data found
                </p>
                <p className="text-xs text-green-600">
                  Location: {formatCoordinates(imageData.coordinates)}
                </p>
              </div>
            </>
          ) : (
            <>
              <MapPin size={18} className="text-yellow-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  No GPS data
                </p>
                <p className="text-xs text-yellow-600">
                  Select a location on the map to add GPS coordinates
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageInfo; 