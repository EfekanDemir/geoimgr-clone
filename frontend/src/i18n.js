import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Header
      "appTitle": "GeoImgr",
      "appSubtitle": "GPS EXIF Editor",
      "language": "Language",
      
      // File Upload
      "uploadTitle": "Upload Image",
      "uploadDescription": "Drag & drop a JPEG image here, or click to select",
      "uploadButton": "Select Image",
      "supportedFormats": "Supported formats: JPG, JPEG (max 10MB)",
      "uploading": "Uploading...",
      
      // Image Info
      "imageInfo": "Image Information",
      "fileName": "File Name",
      "fileSize": "File Size",
      "dimensions": "Dimensions",
      "hasGPS": "Has GPS Data",
      "yes": "Yes",
      "no": "No",
      
      // GPS Data
      "gpsData": "GPS Data",
      "latitude": "Latitude",
      "longitude": "Longitude",
      "altitude": "Altitude",
      "timestamp": "Timestamp",
      "gpsTimestamp": "GPS Timestamp",
      "direction": "Direction",
      "speed": "Speed",
      "noGpsData": "No GPS data found in this image",
      
      // EXIF Data
      "exifData": "EXIF Data",
      "camera": "Camera",
      "dateTime": "Date & Time",
      "orientation": "Orientation",
      "resolution": "Resolution",
      "software": "Software",
      "artist": "Artist",
      "copyright": "Copyright",
      "exposureTime": "Exposure Time",
      "aperture": "Aperture",
      "iso": "ISO",
      "focalLength": "Focal Length",
      "flash": "Flash",
      "whiteBalance": "White Balance",
      "imageSize": "Image Size",
      "lens": "Lens",
      "exposureProgram": "Exposure Program",
      "meteringMode": "Metering Mode",
      "digitalZoom": "Digital Zoom",
      "contrast": "Contrast",
      "saturation": "Saturation",
      "sharpness": "Sharpness",
      
      // Map
      "mapTitle": "Select Location on Map",
      "mapDescription": "Click on the map to set new GPS coordinates",
      "currentLocation": "Current Location",
      "newLocation": "New Location",
      "clickToSelect": "Click on the map to select a location",
      
      // Coordinates Input
      "coordinatesInput": "Manual Coordinates",
      "enterCoordinates": "Enter coordinates manually",
      "latitudeLabel": "Latitude (-90 to 90)",
      "longitudeLabel": "Longitude (-180 to 180)",
      "altitudeLabel": "Altitude (meters)",
      "setCoordinates": "Set Coordinates",
      
      // Actions
      "embedGPS": "Embed GPS Info",
      "download": "Download Image",
      "reset": "Reset",
      "processing": "Processing...",
      "embedding": "Embedding GPS data...",
      
      // Messages
      "success": "Success!",
      "error": "Error",
      "gpsUpdated": "GPS data has been successfully embedded into the image",
      "downloadReady": "Your image with updated GPS data is ready for download",
      "invalidCoordinates": "Please enter valid coordinates",
      "uploadError": "Error uploading file. Please try again.",
      "processError": "Error processing image. Please try again.",
      "networkError": "Network error. Please check your connection.",
      
      // Footer
      "footerText": "Built with ❤️ for photographers and location enthusiasts",
      "poweredBy": "Powered by Leaflet & OpenStreetMap",
      
      // EXIF Additional
      "showMore": "Show More",
      "showLess": "Show Less",
      "exifDataAvailable": "EXIF Data Available",
      "fieldsFound": "fields found",
      
      // Keywords
      "keywords": "Keywords",
      "keywordsPlaceholder": "Enter keywords separated by commas (e.g., photography, landscape, travel)",
      "keywordsDescription": "Add relevant keywords to improve SEO and searchability",
      "charactersLeft": "characters left",
      "suggestedKeywords": "Suggested Keywords",
      "seoKeywords": "SEO",
      "photographyKeywords": "Photography",
      "locationKeywords": "Location",
      "previewTags": "Preview Tags",
      "keywordsTips": "SEO Keywords Tips:",
      "keywordsTipsText": "Add relevant keywords separated by commas. Include terms people might search for to find this image. This improves searchability and SEO performance.",
      "keywordsLabel": "Keywords & Tags",
      "separateKeywords": "Separate keywords with commas for better search optimization",
      "suggestButton": "+ Suggest",
      "keywordsPreview": "Keywords Preview:",
      
      // Description
      "description": "Description",
      "descriptionPlaceholder": "Enter a detailed description of your image...",
      "descriptionDescription": "Write a compelling description for better SEO and accessibility",
      "altTextTip": "This will also be used as alt text for better accessibility",
      "descriptionAltText": "Description / Alternative Text",
      "altTextBestPractices": "Alt Text Best Practices:",
      "altTextBestPracticesText": "Write a clear, concise description of what's visible in the image. This helps with accessibility, SEO, and provides context when images can't be displayed.",
      "imageDescription": "Image Description",
      "descriptionSimilar": "Similar to HTML alt attribute - be descriptive and accurate",
      "exampleButton": "💡 Example",
      "goodDescription": "Good Description",
      "avoidThese": "Avoid These",
      "describeSEOBenefits": "SEO & Accessibility Benefits",
      "goodDescList1": "• Describes what's actually visible",
      "goodDescList2": "• Includes relevant context",
      "goodDescList3": "• Mentions lighting and setting",
      "goodDescList4": "• Concise but informative",
      "avoidDescList1": "• Generic descriptions",
      "avoidDescList2": "• Keyword stuffing",
      "avoidDescList3": "• Subjective opinions",
      "avoidDescList4": "• Redundant information",
      "seoAccessibilityList1": "• Improves accessibility for screen readers",
      "seoAccessibilityList2": "• Enhances image SEO and search rankings",
      "seoAccessibilityList3": "• Provides context when images fail to load",
      "seoAccessibilityList4": "• Helps with Google Image Search optimization",
      "seoAccessibilityList5": "• Supports better user experience overall",
      "characterLimitWarning": "Approaching character limit - consider shortening your description",
      "characterLimitClose": "Getting close to character limit - keep descriptions concise",
      
      // Info Panel
      "infoPanel": "Geotagging Information",
      "hideInfo": "Hide Info",
      "showInfo": "Show Info",
      "geotaggingGuide": "What is Geotagging?",
      "infoPanelDescription": "Learn everything about adding GPS data and metadata to your images for better SEO and organization",
      
      // Info Panel Sections
      "whatIsGeotagging": "What is Geotagging?",
      "geotaggingBenefits": "Benefits for SEO & Business",
      "seoOptimization": "Search Engine Optimization",
      "supportedFormats": "Supported File Formats",
      "metadataKeywords": "Keywords & Descriptions",
      "proTip": "Pro Tip",
      
      // Geotagging explanation
      "geotaggingExplanation1": "Geotagging of images refers to the process of adding geographical information, such as latitude, longitude, or other location-related metadata, to an image file. This information is usually stored in the image's EXIF (Exchangeable Image File Format) metadata, which is a standard for storing additional data within image files.",
      "geotaggingExplanation2": "The geographical information embedded in the image helps provide context about where the image was taken or what it represents, making it easier to organize, search, and optimize your images.",
      
      // SEO Benefits
      "seoKeywordBenefits": "SEO Benefits",
      "seoLocalImprovement": "• Improves image discoverability in search engines",
      "seoLocalSpecific": "• Enhances local SEO when location-specific keywords are used",
      "seoGoogleBusiness": "• Helps with Google Business Profile image optimization",
      "seoImageSearch": "• Increases visibility in image search results",
      
      // File formats
      "recommendedFormat": "Recommended format",
      "jpegCompatibility": "with standardized geotagging support. Compatible with all tools and platforms.",
      "limitedSupport": "Limited support.",
      "pngLimitation": "Uses non-standardized EXIF extensions. May not work with all tools.",
      "webpLimitation": "Non-standardized geotagging method. Check compatibility before use.",
      
      // Keywords best practices
      "keywordsBestPractices": "🏷️ Keywords Best Practices",
      "separateCommas": "• Separate keywords with commas",
      "relevantTerms": "• Include relevant search terms people might use",
      "maxLength": "• Maximum length: 6,600 characters",
      "accuracyOverQuantity": "• Focus on accuracy and relevance over quantity",
      
      // Description guidelines
      "descriptionGuidelines": "📝 Description Guidelines",
      "clearDescriptions": "• Write clear, concise descriptions of image content",
      "htmlAltSimilar": "• Similar to HTML alt attribute functionality",
      "maxLengthDesc": "• Maximum length: 1,300 characters",
      "improvesAccessibility": "• Improves accessibility and SEO performance",
      
      // Pro tip
      "proTipText": "For best results, use JPG format with both GPS coordinates and descriptive metadata. This combination provides maximum compatibility and SEO benefits across all platforms and search engines.",
      
      // Export EXIF Data
      "exportExifData": "Export EXIF Data",
      "exportDescription": "Download EXIF and GPS data in different formats",
      "exporting": "Exporting...",
      "exportInfo": "Export Information",
      "exportInfoDescription": "Download all EXIF and GPS metadata in your preferred format for analysis, documentation, or integration with other tools.",
      
      // Actions
      "actions": "Actions"
    }
  },
  tr: {
    translation: {
      // Header
      "appTitle": "GeoImgr",
      "appSubtitle": "GPS EXIF Editörü",
      "language": "Dil",
      
      // File Upload
      "uploadTitle": "Görsel Yükle",
      "uploadDescription": "JPEG görselini buraya sürükle bırak veya seçmek için tıkla",
      "uploadButton": "Görsel Seç",
      "supportedFormats": "Desteklenen formatlar: JPG, JPEG (maks 10MB)",
      "uploading": "Yükleniyor...",
      
      // Image Info
      "imageInfo": "Görsel Bilgileri",
      "fileName": "Dosya Adı",
      "fileSize": "Dosya Boyutu",
      "dimensions": "Boyutlar",
      "hasGPS": "GPS Verisi Var",
      "yes": "Evet",
      "no": "Hayır",
      
      // GPS Data
      "gpsData": "GPS Verileri",
      "latitude": "Enlem",
      "longitude": "Boylam",
      "altitude": "Yükseklik",
      "timestamp": "Zaman Damgası",
      "gpsTimestamp": "GPS Zaman Damgası",
      "direction": "Yön",
      "speed": "Hız",
      "noGpsData": "Bu görselde GPS verisi bulunamadı",
      
      // EXIF Data
      "exifData": "EXIF Verileri",
      "camera": "Kamera",
      "dateTime": "Tarih & Saat",
      "orientation": "Yönelim",
      "resolution": "Çözünürlük",
      "software": "Yazılım",
      "artist": "Sanatçı",
      "copyright": "Telif Hakkı",
      "exposureTime": "Pozlama Süresi",
      "aperture": "Diyafram",
      "iso": "ISO",
      "focalLength": "Odak Uzaklığı",
      "flash": "Flaş",
      "whiteBalance": "Beyaz Dengesi",
      "imageSize": "Görsel Boyutu",
      "lens": "Lens",
      "exposureProgram": "Pozlama Programı",
      "meteringMode": "Ölçüm Modu",
      "digitalZoom": "Dijital Zoom",
      "contrast": "Kontrast",
      "saturation": "Doygunluk",
      "sharpness": "Keskinlik",
      
      // Map
      "mapTitle": "Harita Üzerinden Konum Seç",
      "mapDescription": "Yeni GPS koordinatları ayarlamak için haritaya tıklayın",
      "currentLocation": "Mevcut Konum",
      "newLocation": "Yeni Konum",
      "clickToSelect": "Konum seçmek için haritaya tıklayın",
      
      // Coordinates Input
      "coordinatesInput": "Manuel Koordinatlar",
      "enterCoordinates": "Koordinatları manuel olarak girin",
      "latitudeLabel": "Enlem (-90 ile 90 arası)",
      "longitudeLabel": "Boylam (-180 ile 180 arası)",
      "altitudeLabel": "Yükseklik (metre)",
      "setCoordinates": "Koordinatları Ayarla",
      
      // Actions
      "embedGPS": "GPS Bilgisini Göm",
      "download": "Görseli İndir",
      "reset": "Sıfırla",
      "processing": "İşleniyor...",
      "embedding": "GPS verisi gömülüyor...",
      
      // Messages
      "success": "Başarılı!",
      "error": "Hata",
      "gpsUpdated": "GPS verisi başarıyla görsele gömüldü",
      "downloadReady": "Güncellenmiş GPS verisine sahip görseliniz indirmeye hazır",
      "invalidCoordinates": "Lütfen geçerli koordinatlar girin",
      "uploadError": "Dosya yükleme hatası. Lütfen tekrar deneyin.",
      "processError": "Görsel işleme hatası. Lütfen tekrar deneyin.",
      "networkError": "Ağ hatası. Lütfen bağlantınızı kontrol edin.",
      
      // Footer
      "footerText": "Fotoğrafçılar ve konum meraklıları için ❤️ ile yapıldı",
      "poweredBy": "Leaflet & OpenStreetMap tarafından desteklenmektedir",
      
      // EXIF Additional
      "showMore": "Daha Fazla Göster",
      "showLess": "Daha Az Göster",
      "exifDataAvailable": "EXIF Verisi Mevcut",
      "fieldsFound": "alan bulundu",
      
      // Keywords
      "keywords": "Anahtar Kelimeler",
      "keywordsPlaceholder": "Virgülle ayrılmış anahtar kelimeler girin (örn: fotoğrafçılık, manzara, seyahat)",
      "keywordsDescription": "SEO ve aranabilirliği geliştirmek için ilgili anahtar kelimeler ekleyin",
      "charactersLeft": "karakter kaldı",
      "suggestedKeywords": "Önerilen Anahtar Kelimeler",
      "seoKeywords": "SEO",
      "photographyKeywords": "Fotoğrafçılık",
      "locationKeywords": "Konum",
      "previewTags": "Etiket Önizlemesi",
      "keywordsTips": "SEO Anahtar Kelime İpuçları:",
      "keywordsTipsText": "Virgülle ayrılmış ilgili anahtar kelimeler ekleyin. Bu görseli bulmak için insanların arayabileceği terimleri dahil edin. Bu aranabilirlik ve SEO performansını artırır.",
      "keywordsLabel": "Anahtar Kelimeler ve Etiketler",
      "separateKeywords": "Daha iyi arama optimizasyonu için anahtar kelimeleri virgülle ayırın",
      "suggestButton": "+ Öner",
      "keywordsPreview": "Anahtar Kelime Önizlemesi:",
      
      // Description
      "description": "Açıklama",
      "descriptionPlaceholder": "Görselinizin detaylı açıklamasını girin...",
      "descriptionDescription": "Daha iyi SEO ve erişilebilirlik için etkileyici bir açıklama yazın",
      "altTextTip": "Bu aynı zamanda daha iyi erişilebilirlik için alt metin olarak da kullanılacak",
      "descriptionAltText": "Açıklama / Alternatif Metin",
      "altTextBestPractices": "Alt Metin En İyi Uygulamaları:",
      "altTextBestPracticesText": "Görselde neyin görünür olduğunu net ve kısa bir şekilde açıklayın. Bu erişilebilirlik, SEO'ya yardımcı olur ve görseller görüntülenemediğinde bağlam sağlar.",
      "imageDescription": "Görsel Açıklaması",
      "descriptionSimilar": "HTML alt özelliğine benzer - açıklayıcı ve doğru olun",
      "exampleButton": "💡 Örnek",
      "goodDescription": "İyi Açıklama",
      "avoidThese": "Bunlardan Kaçının",
      "describeSEOBenefits": "SEO ve Erişilebilirlik Faydaları",
      "goodDescList1": "• Gerçekte görüneni açıklar",
      "goodDescList2": "• İlgili bağlamı dahil eder",
      "goodDescList3": "• Işık ve ortamdan bahseder",
      "goodDescList4": "• Kısa ama bilgilendirici",
      "avoidDescList1": "• Genel açıklamalar",
      "avoidDescList2": "• Anahtar kelime yığını",
      "avoidDescList3": "• Öznel görüşler",
      "avoidDescList4": "• Gereksiz bilgi",
      "seoAccessibilityList1": "• Ekran okuyucular için erişilebilirliği artırır",
      "seoAccessibilityList2": "• Görsel SEO ve arama sıralamasını geliştirir",
      "seoAccessibilityList3": "• Görseller yüklenemediğinde bağlam sağlar",
      "seoAccessibilityList4": "• Google Görsel Arama optimizasyonuna yardımcı olur",
      "seoAccessibilityList5": "• Genel kullanıcı deneyimini destekler",
      "characterLimitWarning": "Karakter sınırına yaklaşıyor - açıklamanızı kısaltmayı düşünün",
      "characterLimitClose": "Karakter sınırına yaklaşıyor - açıklamaları kısa tutun",
      
      // Info Panel
      "infoPanel": "Coğrafi Etiketleme Bilgileri",
      "hideInfo": "Bilgileri Gizle",
      "showInfo": "Bilgileri Göster",
      "geotaggingGuide": "Coğrafi Etiketleme Rehberi",
      "infoPanelDescription": "Görsellerinize GPS verisi ve metadata ekleme hakkında bilmeniz gereken her şeyi öğrenin",
      
      // Info Panel Sections
      "whatIsGeotagging": "Coğrafi Etiketleme Nedir?",
      "geotaggingBenefits": "SEO ve İş Faydaları",
      "seoOptimization": "Arama Motoru Optimizasyonu",
      "supportedFormats": "Desteklenen Dosya Formatları",
      "metadataKeywords": "Anahtar Kelimeler ve Açıklamalar",
      "proTip": "Profesyonel İpucu",
      
      // Geotagging explanation
      "geotaggingExplanation1": "Görsellerin coğrafi etiketlenmesi, enlem, boylam veya diğer konum bilgilerini görsel dosyasına ekleme işlemidir. Bu bilgiler genellikle görselin EXIF (Değiştirilebilir Görsel Dosya Formatı) metadata'sında saklanır ve dosyalar içinde ek veri depolamak için standart bir yöntemdir.",
      "geotaggingExplanation2": "Görsele gömülen coğrafi bilgiler, görselin nerede çekildiği veya neyi temsil ettiği hakkında bağlam sağlayarak görsellerinizi organize etmeyi, aramayı ve optimize etmeyi kolaylaştırır.",
      
      // SEO Benefits
      "seoKeywordBenefits": "SEO Faydaları",
      "seoLocalImprovement": "• Arama motorlarında görsel keşfedilebilirliğini artırır",
      "seoLocalSpecific": "• Konum-spesifik anahtar kelimeler kullanıldığında yerel SEO'yu geliştirir",
      "seoGoogleBusiness": "• Google İşletme Profili görsel optimizasyonuna yardımcı olur",
      "seoImageSearch": "• Görsel arama sonuçlarında görünürlüğü artırır",
      
      // File formats
      "recommendedFormat": "Önerilen format",
      "jpegCompatibility": "standartlaştırılmış coğrafi etiketleme desteği ile. Tüm araçlar ve platformlarla uyumludur.",
      "limitedSupport": "Sınırlı destek.",
      "pngLimitation": "Standart olmayan EXIF uzantıları kullanır. Tüm araçlarla çalışmayabilir.",
      "webpLimitation": "Standart olmayan coğrafi etiketleme yöntemi. Kullanmadan önce uyumluluğu kontrol edin.",
      
      // Keywords best practices
      "keywordsBestPractices": "🏷️ Anahtar Kelime En İyi Uygulamaları",
      "separateCommas": "• Anahtar kelimeleri virgülle ayırın",
      "relevantTerms": "• İnsanların arayabileceği ilgili terimleri dahil edin",
      "maxLength": "• Maksimum uzunluk: 6.600 karakter",
      "accuracyOverQuantity": "• Miktardan çok doğruluk ve ilgiye odaklanın",
      
      // Description guidelines
      "descriptionGuidelines": "📝 Açıklama Yönergeleri",
      "clearDescriptions": "• Görsel içeriğinin net, kısa açıklamalarını yazın",
      "htmlAltSimilar": "• HTML alt özelliği işlevine benzer",
      "maxLengthDesc": "• Maksimum uzunluk: 1.300 karakter",
      "improvesAccessibility": "• Erişilebilirlik ve SEO performansını artırır",
      
      // Pro tip
      "proTipText": "En iyi sonuçlar için, hem GPS koordinatları hem de açıklayıcı metadata ile JPG formatını kullanın. Bu kombinasyon tüm platformlar ve arama motorlarında maksimum uyumluluk ve SEO faydaları sağlar.",
      
      // Export EXIF Data
      "exportExifData": "EXIF Verilerini Dışa Aktar",
      "exportDescription": "EXIF ve GPS verilerini farklı formatlarda indirin",
      "exporting": "Dışa aktarılıyor...",
      "exportInfo": "Dışa Aktarma Bilgisi",
      "exportInfoDescription": "Analiz, dokümantasyon veya diğer araçlarla entegrasyon için tercih ettiğiniz formatta tüm EXIF ve GPS metadata'larını indirin.",
      
      // Actions
      "actions": "İşlemler"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 