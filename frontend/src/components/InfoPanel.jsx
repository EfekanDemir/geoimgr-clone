import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp, MapPin, Search, Shield, Camera } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const InfoPanel = () => {
  const { t } = useTranslation();
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    benefits: false,
    seo: false,
    formats: false,
    metadata: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const InfoSection = ({ id, title, icon, children, defaultExpanded = false }) => {
    const isExpanded = expandedSections[id];
    
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center">
            {icon}
            <h3 className="text-lg font-semibold text-gray-900 ml-2">{title}</h3>
          </div>
          {isExpanded ? (
            <ChevronUp size={20} className="text-gray-600" />
          ) : (
            <ChevronDown size={20} className="text-gray-600" />
          )}
        </button>
        {isExpanded && (
          <div className="p-4 bg-white border-t border-gray-200">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="card">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('geotaggingGuide')}
        </h2>
        <p className="text-gray-600">
          {t('infoPanelDescription')}
        </p>
      </div>

      <div className="space-y-4">
        <InfoSection
          id="overview"
          title={t('whatIsGeotagging')}
          icon={<Info size={20} className="text-blue-600" />}
          defaultExpanded={true}
        >
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 mb-4">
              {t('geotaggingExplanation1')}
            </p>
            <p className="text-gray-700">
              {t('geotaggingExplanation2')}
            </p>
          </div>
        </InfoSection>

        <InfoSection
          id="benefits"
          title="Key Benefits"
          icon={<MapPin size={20} className="text-green-600" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">📁 Organization & Sorting</h4>
              <p className="text-sm text-blue-800">
                Geotagged images can be easily sorted, filtered, and organized based on location, 
                allowing users to find specific images more easily or create location-based albums.
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">🔍 Enhanced Searchability</h4>
              <p className="text-sm text-green-800">
                Location-based context helps search engines understand your content better, 
                improving discoverability in both regular and local search results.
              </p>
            </div>
          </div>
        </InfoSection>

        <InfoSection
          id="seo"
          title="SEO & Google Business Profile"
          icon={<Search size={20} className="text-orange-600" />}
        >
          <div className="space-y-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-semibold text-orange-900 mb-2">🚀 SEO Benefits</h4>
              <ul className="text-sm text-orange-800 space-y-1">
                <li>• Improves image search results and local SEO ranking</li>
                <li>• Helps images appear in localized searches</li>
                <li>• Contributes to overall website SEO performance</li>
                <li>• Enhances Google Business Profile optimization</li>
              </ul>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">📊 Google's Approach</h4>
              <p className="text-sm text-yellow-800">
                When you upload images to Google Business Profile or your website, Google stores the original 
                image with its geotags and metadata. While displayed images are optimized and stripped of metadata 
                for privacy and performance, Google retains access to the original data for ranking purposes.
              </p>
            </div>
          </div>
        </InfoSection>

        <InfoSection
          id="formats"
          title={t('supportedFormats')}
          icon={<Camera size={20} className="text-purple-600" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">✅</div>
              <h4 className="font-semibold text-green-900 mb-2">JPG/JPEG</h4>
              <p className="text-sm text-green-800">
                <strong>{t('recommendedFormat')}</strong> {t('jpegCompatibility')}
              </p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">⚠️</div>
              <h4 className="font-semibold text-yellow-900 mb-2">PNG</h4>
              <p className="text-sm text-yellow-800">
                {t('limitedSupport')} {t('pngLimitation')}
              </p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">⚠️</div>
              <h4 className="font-semibold text-yellow-900 mb-2">WebP</h4>
              <p className="text-sm text-yellow-800">
                {t('limitedSupport')} {t('webpLimitation')}
              </p>
            </div>
          </div>
        </InfoSection>

        <InfoSection
          id="metadata"
          title={t('metadataKeywords')}
          icon={<Shield size={20} className="text-indigo-600" />}
        >
          <div className="space-y-4">
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <h4 className="font-semibold text-indigo-900 mb-2">{t('keywordsBestPractices')}</h4>
              <ul className="text-sm text-indigo-800 space-y-1">
                <li>{t('separateCommas')}</li>
                <li>{t('relevantTerms')}</li>
                <li>{t('maxLength')}</li>
                <li>{t('accuracyOverQuantity')}</li>
              </ul>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 mb-2">{t('descriptionGuidelines')}</h4>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>{t('clearDescriptions')}</li>
                <li>{t('htmlAltSimilar')}</li>
                <li>{t('maxLengthDesc')}</li>
                <li>{t('improvesAccessibility')}</li>
              </ul>
            </div>
          </div>
        </InfoSection>
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
        <div className="flex items-center mb-2">
          <Info size={18} className="text-blue-600 mr-2" />
          <h4 className="font-semibold text-blue-900">{t('proTip')}</h4>
        </div>
        <p className="text-sm text-blue-800">
          {t('proTipText')}
        </p>
      </div>
    </div>
  );
};

export default InfoPanel; 