import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';

const FileUpload = ({ onUploadSuccess, loading, setLoading, onError }) => {
  const { t } = useTranslation();
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file type
    if (!file.type.includes('jpeg') && !file.type.includes('jpg')) {
      onError(t('uploadError'));
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      onError('File too large. Maximum size is 10MB.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/exif/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        onUploadSuccess(result);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      onError(t('uploadError'));
    } finally {
      setLoading(false);
    }
  }, [onUploadSuccess, onError, setLoading, t]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg']
    },
    multiple: false,
    disabled: loading,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    onDropAccepted: () => setDragActive(false),
    onDropRejected: () => setDragActive(false)
  });

  return (
    <div className="card">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('uploadTitle')}
        </h2>
        <p className="text-gray-600">
          {t('uploadDescription')}
        </p>
      </div>

      <div
        {...getRootProps()}
        className={`
          file-drop-zone cursor-pointer transition-all duration-200
          ${isDragActive || dragActive ? 'active border-primary-400 bg-primary-50' : ''}
          ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary-300 hover:bg-gray-50'}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          {loading ? (
            <>
              <Loader2 size={48} className="text-primary-500 loading-spinner" />
              <p className="text-lg font-medium text-primary-600">
                {t('uploading')}
              </p>
            </>
          ) : (
            <>
              <div className={`p-4 rounded-full transition-colors ${
                isDragActive || dragActive 
                  ? 'bg-primary-100' 
                  : 'bg-gray-100'
              }`}>
                {isDragActive || dragActive ? (
                  <ImageIcon size={48} className="text-primary-600" />
                ) : (
                  <Upload size={48} className="text-gray-400" />
                )}
              </div>
              
              <div className="text-center">
                <p className="text-lg font-medium text-gray-700 mb-2">
                  {isDragActive 
                    ? 'Drop the image here...' 
                    : t('uploadButton')
                  }
                </p>
                <p className="text-sm text-gray-500">
                  {t('supportedFormats')}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-6 text-center">
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-sm text-gray-600">EXIF GPS Reading</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <span className="text-sm text-gray-600">Map Integration</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
            <span className="text-sm text-gray-600">GPS Embedding</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload; 