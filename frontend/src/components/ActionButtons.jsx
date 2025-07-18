import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  MapPin, 
  Download, 
  RotateCcw, 
  Loader2,
  CheckCircle
} from 'lucide-react';

const ActionButtons = ({ 
  hasImage, 
  hasCoordinates, 
  hasUpdatedImage,
  processing, 
  onEmbedGPS, 
  onDownload, 
  onReset 
}) => {
  const { t } = useTranslation();

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Actions
      </h3>

      <div className="space-y-4">
        {/* Embed GPS Button */}
        <button
          onClick={onEmbedGPS}
          disabled={!hasImage || !hasCoordinates || processing}
          className={`
            w-full flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-all duration-200
            ${hasImage && hasCoordinates && !processing
              ? 'btn-primary hover:bg-primary-700 transform hover:scale-105' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {processing ? (
            <>
              <Loader2 size={20} className="mr-2 loading-spinner" />
              {t('embedding')}
            </>
          ) : (
            <>
              <MapPin size={20} className="mr-2" />
              {t('embedGPS')}
            </>
          )}
        </button>

        {/* Download Button */}
        <button
          onClick={onDownload}
          disabled={!hasUpdatedImage}
          className={`
            w-full flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-all duration-200
            ${hasUpdatedImage
              ? 'btn-success hover:bg-green-700 transform hover:scale-105' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          <Download size={20} className="mr-2" />
          {t('download')}
        </button>

        {/* Reset Button */}
        <button
          onClick={onReset}
          disabled={!hasImage}
          className={`
            w-full flex items-center justify-center py-2 px-4 rounded-lg font-medium transition-all duration-200
            ${hasImage
              ? 'btn-secondary hover:bg-gray-400' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          <RotateCcw size={18} className="mr-2" />
          {t('reset')}
        </button>
      </div>

      {/* Status Indicators */}
      <div className="mt-6 space-y-3">
        <div className="text-sm font-medium text-gray-700 mb-2">
          Progress Status:
        </div>
        
        {/* Step 1: Image Upload */}
        <div className="flex items-center">
          <div className={`w-4 h-4 rounded-full mr-3 flex items-center justify-center ${
            hasImage ? 'bg-green-500' : 'bg-gray-300'
          }`}>
            {hasImage && <CheckCircle size={12} className="text-white" />}
          </div>
          <span className={`text-sm ${hasImage ? 'text-green-700 font-medium' : 'text-gray-500'}`}>
            1. Image uploaded and EXIF data read
          </span>
        </div>

        {/* Step 2: Coordinates Selected */}
        <div className="flex items-center">
          <div className={`w-4 h-4 rounded-full mr-3 flex items-center justify-center ${
            hasCoordinates ? 'bg-green-500' : 'bg-gray-300'
          }`}>
            {hasCoordinates && <CheckCircle size={12} className="text-white" />}
          </div>
          <span className={`text-sm ${hasCoordinates ? 'text-green-700 font-medium' : 'text-gray-500'}`}>
            2. GPS coordinates selected
          </span>
        </div>

        {/* Step 3: GPS Embedded */}
        <div className="flex items-center">
          <div className={`w-4 h-4 rounded-full mr-3 flex items-center justify-center ${
            hasUpdatedImage ? 'bg-green-500' : processing ? 'bg-blue-500' : 'bg-gray-300'
          }`}>
            {hasUpdatedImage && <CheckCircle size={12} className="text-white" />}
            {processing && <Loader2 size={12} className="text-white loading-spinner" />}
          </div>
          <span className={`text-sm ${
            hasUpdatedImage ? 'text-green-700 font-medium' : 
            processing ? 'text-blue-700 font-medium' : 'text-gray-500'
          }`}>
            3. GPS data embedded into image
          </span>
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          <strong>How it works:</strong> Upload a JPEG image, select GPS coordinates 
          on the map or enter them manually, then embed the GPS data into the image's 
          EXIF metadata. The updated image will be ready for download.
        </p>
      </div>

      {/* Warning for No GPS */}
      {hasImage && !hasCoordinates && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800">
            <strong>Next step:</strong> Select GPS coordinates by clicking on the map 
            or entering them manually in the coordinates input above.
          </p>
        </div>
      )}

      {/* Success Message */}
      {hasUpdatedImage && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-xs text-green-800">
            <strong>Success!</strong> GPS data has been embedded into your image. 
            Click the download button to save the updated image.
          </p>
        </div>
      )}
    </div>
  );
};

export default ActionButtons; 