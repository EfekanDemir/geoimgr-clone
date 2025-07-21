import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Tag, Info } from 'lucide-react';

const KeywordsInput = ({ keywords, onKeywordsChange }) => {
  const { t } = useTranslation();
  const [keywordsText, setKeywordsText] = useState('');
  const [charCount, setCharCount] = useState(0);
  const maxLength = 6600;

  useEffect(() => {
    if (keywords) {
      setKeywordsText(keywords);
      setCharCount(keywords.length);
    }
  }, [keywords]);

  const handleKeywordsChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setKeywordsText(value);
      setCharCount(value.length);
      onKeywordsChange(value);
    }
  };

  const suggestKeywords = () => {
    const suggestions = [
      'photography, landscape, travel',
      'business, office, professional',
      'nature, outdoor, scenic',
      'urban, city, architecture',
      'portrait, people, lifestyle'
    ];
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  };

  const addSuggestedKeywords = () => {
    const suggested = suggestKeywords();
    const newKeywords = keywordsText ? `${keywordsText}, ${suggested}` : suggested;
    if (newKeywords.length <= maxLength) {
      setKeywordsText(newKeywords);
      setCharCount(newKeywords.length);
      onKeywordsChange(newKeywords);
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Tag size={20} className="mr-2 text-orange-600" />
        {t('keywords')}
      </h3>

      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start">
            <Info size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">{t('keywordsTips')}</p>
              <p className="text-xs">
                {t('keywordsTipsText')}
              </p>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="keywords" className="label">
            {t('keywordsLabel')}
            <span className="text-sm text-gray-500 ml-2">
              ({charCount}/{maxLength} {t('charactersLeft')})
            </span>
          </label>
          <textarea
            id="keywords"
            value={keywordsText}
            onChange={handleKeywordsChange}
            placeholder="travel, landscape, photography, scenic, nature, outdoor"
            className={`input-field min-h-[100px] resize-y ${
              charCount > maxLength * 0.9 ? 'border-orange-300' : ''
            }`}
            rows={4}
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500">
              {t('separateKeywords')}
            </p>
            <div className="flex items-center space-x-2">
              <div className={`text-xs ${
                charCount > maxLength * 0.9 ? 'text-orange-600 font-medium' : 'text-gray-500'
              }`}>
                {charCount > maxLength * 0.9 && '⚠️ '}{charCount}/{maxLength}
              </div>
              <button
                type="button"
                onClick={addSuggestedKeywords}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-gray-700 transition-colors"
              >
                {t('suggestButton')}
              </button>
            </div>
          </div>
        </div>

        {/* Keywords Preview */}
        {keywordsText && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="text-sm font-medium text-gray-700 mb-2">
              {t('keywordsPreview')}
            </div>
            <div className="flex flex-wrap gap-1">
              {keywordsText.split(',').map((keyword, index) => (
                <span
                  key={index}
                  className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full border"
                >
                  {keyword.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* SEO Benefits */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center mb-2">
            <Tag size={16} className="text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-800">
              {t('seoKeywordBenefits')}
            </span>
          </div>
          <ul className="text-xs text-green-700 space-y-1">
            <li>{t('seoLocalImprovement')}</li>
            <li>{t('seoLocalSpecific')}</li>
            <li>{t('seoGoogleBusiness')}</li>
            <li>{t('seoImageSearch')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default KeywordsInput; 