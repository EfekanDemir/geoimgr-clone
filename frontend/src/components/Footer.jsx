import React from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Map } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-800 text-gray-300 py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Heart size={16} className="text-red-400" />
            <p className="text-sm">
              {t('footerText')}
            </p>
          </div>
          
          <div className="flex items-center justify-center space-x-2">
            <Map size={16} className="text-blue-400" />
            <p className="text-xs text-gray-400">
              {t('poweredBy')}
            </p>
          </div>
          
          <div className="border-t border-gray-700 pt-4">
            <p className="text-xs text-gray-500">
              © 2024 GeoImgr. Open source GPS EXIF editor for photographers.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 