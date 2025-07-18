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
      "poweredBy": "Powered by Leaflet & OpenStreetMap"
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
      "poweredBy": "Leaflet & OpenStreetMap tarafından desteklenmektedir"
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