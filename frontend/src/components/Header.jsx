import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, MapPin } from 'lucide-react';

const Header = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="gradient-bg text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <MapPin size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-shadow">
                {t('appTitle')}
              </h1>
              <p className="text-blue-100 text-sm md:text-base">
                {t('appSubtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Globe size={18} className="text-blue-200" />
            <select
              value={i18n.language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="bg-white bg-opacity-20 text-white border border-white border-opacity-30 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            >
              <option value="en" className="text-gray-800">English</option>
              <option value="tr" className="text-gray-800">Türkçe</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 