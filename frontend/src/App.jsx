import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import ImageInfo from './components/ImageInfo';
import ExifData from './components/ExifData';
import MapComponent from './components/MapComponent';
import CoordinatesInput from './components/CoordinatesInput';
import KeywordsInput from './components/KeywordsInput';
import DescriptionInput from './components/DescriptionInput';
import ActionButtons from './components/ActionButtons';
import InfoPanel from './components/InfoPanel';
import Footer from './components/Footer';
import Notification from './components/Notification';

function App() {
  const { t } = useTranslation();
  
  // Main state
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  const [notification, setNotification] = useState(null);
  const [updatedFilename, setUpdatedFilename] = useState(null);
  
  // New metadata state
  const [keywords, setKeywords] = useState('');
  const [description, setDescription] = useState('');
  const [showInfoPanel, setShowInfoPanel] = useState(false);

  // Helper function to show notifications
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Handle file upload success
  const handleUploadSuccess = (data) => {
    setImageData(data);
    setSelectedCoordinates(data.coordinates);
    setUpdatedFilename(null);
    
    // Set keywords and description from EXIF if available
    setKeywords(data.exifData?.keywords || '');
    setDescription(data.exifData?.description || '');
    
    if (data.hasGPS) {
      showNotification(
        `${t('success')} GPS data found in image: ${data.coordinates.lat.toFixed(6)}, ${data.coordinates.lng.toFixed(6)}`,
        'success'
      );
    } else {
      showNotification(t('noGpsData'), 'info');
    }
  };

  // Handle coordinate selection from map
  const handleCoordinateSelect = (coordinates) => {
    setSelectedCoordinates(coordinates);
  };

  // Handle manual coordinate input
  const handleManualCoordinates = (coordinates) => {
    setSelectedCoordinates(coordinates);
    showNotification(
      `Coordinates set: ${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}`,
      'info'
    );
  };

  // Handle keywords change
  const handleKeywordsChange = (newKeywords) => {
    setKeywords(newKeywords);
  };

  // Handle description change
  const handleDescriptionChange = (newDescription) => {
    setDescription(newDescription);
  };

  // Handle GPS and metadata embedding
  const handleEmbedGPS = async () => {
    if (!imageData || !selectedCoordinates) {
      showNotification(t('invalidCoordinates'), 'error');
      return;
    }

    setProcessing(true);
    
    try {
      const response = await fetch('/api/exif/update-gps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: imageData.filename,
          latitude: selectedCoordinates.lat,
          longitude: selectedCoordinates.lng,
          altitude: selectedCoordinates.alt || null,
          keywords: keywords || null,
          description: description || null
        }),
      });

      const result = await response.json();

      if (result.success) {
        setUpdatedFilename(result.updatedFilename);
        showNotification(result.message, 'success');
        
        // Update image data with new GPS info
        setImageData(prev => ({
          ...prev,
          coordinates: result.coordinates,
          gpsData: result.gpsData,
          hasGPS: true
        }));
      } else {
        throw new Error(result.error || 'Failed to update GPS data');
      }
    } catch (error) {
      console.error('Error embedding GPS:', error);
      showNotification(t('processError'), 'error');
    } finally {
      setProcessing(false);
    }
  };

  // Handle download
  const handleDownload = () => {
    if (!updatedFilename) {
      showNotification('No updated image available for download', 'error');
      return;
    }

    const downloadUrl = `/api/exif/download/${updatedFilename}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = updatedFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification(t('downloadReady'), 'success');
  };

  // Handle reset
  const handleReset = () => {
    setImageData(null);
    setSelectedCoordinates(null);
    setUpdatedFilename(null);
    setNotification(null);
    setKeywords('');
    setDescription('');
    setShowInfoPanel(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-[1400px]">
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}

        {/* Toggle Info Panel Button */}
        <div className="mb-6 text-center">
          <button
            onClick={() => setShowInfoPanel(!showInfoPanel)}
            className="btn-secondary"
          >
            📚 {showInfoPanel ? 'Hide' : 'Show'} Complete Geotagging Guide
          </button>
        </div>

        {/* Info Panel (collapsible) */}
        {showInfoPanel && (
          <div className="mb-8">
            <InfoPanel />
          </div>
        )}

        {!imageData ? (
          <div className="max-w-3xl mx-auto">
            <FileUpload 
              onUploadSuccess={handleUploadSuccess}
              loading={loading}
              setLoading={setLoading}
              onError={(error) => showNotification(error, 'error')}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Image Info & EXIF Data */}
            <div className="space-y-6">
              <ImageInfo imageData={imageData} />
              <ExifData 
                gpsData={imageData.gpsData} 
                exifData={imageData.exifData}
                hasGPS={imageData.hasGPS}
                filename={imageData.filename}
              />
            </div>

            {/* Middle Column - Map & Controls */}
            <div className="space-y-6">
              <MapComponent
                initialCoordinates={imageData.coordinates}
                selectedCoordinates={selectedCoordinates}
                onCoordinateSelect={handleCoordinateSelect}
              />
              
              <CoordinatesInput
                coordinates={selectedCoordinates}
                onCoordinatesChange={handleManualCoordinates}
              />
            </div>

            {/* Right Column - Metadata & Actions */}
            <div className="space-y-6">
              <KeywordsInput
                keywords={keywords}
                onKeywordsChange={handleKeywordsChange}
              />
              
              <DescriptionInput
                description={description}
                onDescriptionChange={handleDescriptionChange}
              />
              
              <ActionButtons
                hasImage={!!imageData}
                hasCoordinates={!!selectedCoordinates}
                hasUpdatedImage={!!updatedFilename}
                processing={processing}
                onEmbedGPS={handleEmbedGPS}
                onDownload={handleDownload}
                onReset={handleReset}
              />
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default App; 