import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Info, Eye } from 'lucide-react';

const DescriptionInput = ({ description, onDescriptionChange }) => {
  const { t } = useTranslation();
  const [descriptionText, setDescriptionText] = useState('');
  const [charCount, setCharCount] = useState(0);
  const maxLength = 1300;

  useEffect(() => {
    if (description) {
      setDescriptionText(description);
      setCharCount(description.length);
    }
  }, [description]);

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setDescriptionText(value);
      setCharCount(value.length);
      onDescriptionChange(value);
    }
  };

  const generateSampleDescription = () => {
    const samples = [
      'A scenic landscape photograph taken during golden hour, featuring rolling hills and dramatic sky formations with natural lighting.',
      'Professional business portrait captured in an office environment, showcasing corporate setting with modern architectural elements.',
      'Urban cityscape photography featuring contemporary architecture and bustling street life during daytime hours.',
      'Nature photography depicting wildlife in their natural habitat with detailed environmental context and seasonal characteristics.',
      'Travel photography showcasing cultural landmarks and historical significance with architectural details and surrounding landscape.'
    ];
    return samples[Math.floor(Math.random() * samples.length)];
  };

  const addSampleDescription = () => {
    const sample = generateSampleDescription();
    if (sample.length <= maxLength) {
      setDescriptionText(sample);
      setCharCount(sample.length);
      onDescriptionChange(sample);
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <FileText size={20} className="mr-2 text-purple-600" />
        {t('description')}
      </h3>

      <div className="space-y-4">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <div className="flex items-start">
            <Info size={16} className="text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-purple-800">
              <p className="font-medium mb-1">{t('altTextBestPractices')}</p>
              <p className="text-xs">
                {t('altTextBestPracticesText')}
              </p>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="label">
            {t('imageDescription')}
            <span className="text-sm text-gray-500 ml-2">
              ({charCount}/{maxLength} {t('charactersLeft')})
            </span>
          </label>
          <textarea
            id="description"
            value={descriptionText}
            onChange={handleDescriptionChange}
            placeholder="A detailed description of what's visible in the image, including setting, subjects, lighting, and context..."
            className={`input-field min-h-[120px] resize-y ${
              charCount > maxLength * 0.9 ? 'border-purple-300' : ''
            }`}
            rows={5}
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500">
              {t('descriptionSimilar')}
            </p>
            <div className="flex items-center space-x-2">
              <div className={`text-xs ${
                charCount > maxLength * 0.9 ? 'text-purple-600 font-medium' : 'text-gray-500'
              }`}>
                {charCount > maxLength * 0.9 && '⚠️ '}{charCount}/{maxLength}
              </div>
              <button
                type="button"
                onClick={addSampleDescription}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-gray-700 transition-colors"
              >
                {t('exampleButton')}
              </button>
            </div>
          </div>
        </div>

        {/* Description Guidelines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center mb-2">
              <Eye size={16} className="text-green-600 mr-2" />
              <span className="text-sm font-medium text-green-800">
                {t('goodDescription')}
              </span>
            </div>
            <ul className="text-xs text-green-700 space-y-1">
              <li>{t('goodDescList1')}</li>
              <li>{t('goodDescList2')}</li>
              <li>{t('goodDescList3')}</li>
              <li>{t('goodDescList4')}</li>
            </ul>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center mb-2">
              <Eye size={16} className="text-red-600 mr-2" />
              <span className="text-sm font-medium text-red-800">
                {t('avoidThese')}
              </span>
            </div>
            <ul className="text-xs text-red-700 space-y-1">
              <li>{t('avoidDescList1')}</li>
              <li>{t('avoidDescList2')}</li>
              <li>{t('avoidDescList3')}</li>
              <li>{t('avoidDescList4')}</li>
            </ul>
          </div>
        </div>

        {/* SEO & Accessibility Benefits */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center mb-2">
            <FileText size={16} className="text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-800">
              {t('describeSEOBenefits')}
            </span>
          </div>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>{t('seoAccessibilityList1')}</li>
            <li>{t('seoAccessibilityList2')}</li>
            <li>{t('seoAccessibilityList3')}</li>
            <li>{t('seoAccessibilityList4')}</li>
            <li>{t('seoAccessibilityList5')}</li>
          </ul>
        </div>

        {/* Character Count Warning */}
        {charCount > maxLength * 0.8 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center">
              <Info size={16} className="text-yellow-600 mr-2" />
              <span className="text-sm text-yellow-800">
                {charCount > maxLength * 0.9 
                  ? t('characterLimitWarning')
                  : t('characterLimitClose')
                }
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DescriptionInput; 