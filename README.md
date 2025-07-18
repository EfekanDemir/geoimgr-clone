# GeoImgr Clone - GPS EXIF Editor

A modern web application for reading, editing, and embedding GPS EXIF data in JPEG images. Built with React.js frontend and Node.js backend.

![GeoImgr Screenshot](https://via.placeholder.com/800x400/667eea/ffffff?text=GeoImgr+-+GPS+EXIF+Editor)

## 🌟 Features

- **📸 Image Upload**: Support for JPG/JPEG files up to 10MB
- **🗺️ EXIF GPS Reading**: Automatically reads existing GPS metadata from images
- **🌍 Interactive Map**: Leaflet-powered map with OpenStreetMap tiles
- **📍 Location Selection**: Click on map or manually enter coordinates
- **💾 GPS Embedding**: Write GPS coordinates into image EXIF data
- **⬇️ Download**: Get updated images with embedded GPS data
- **🌐 Multi-language**: English and Turkish language support
- **📱 Responsive Design**: Works on desktop, tablet, and mobile
- **🎨 Modern UI**: Clean, professional interface with Tailwind CSS

## 🛠️ Technologies Used

### Frontend
- **React.js** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Leaflet & React Leaflet** - Interactive maps
- **React i18next** - Internationalization
- **React Dropzone** - File upload
- **Lucide React** - Icons

### Backend
- **Node.js & Express** - Server framework
- **Multer** - File upload handling
- **exifr** - EXIF data reading
- **piexifjs** - EXIF data writing
- **Sharp** - Image processing (optional)

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd geoimgr-clone
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5000`
   - Frontend server on `http://localhost:3000`

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📖 Usage Guide

### 1. Upload an Image
- Drag and drop a JPEG file or click to select
- The app will automatically read any existing GPS EXIF data
- View image information and EXIF metadata

### 2. Select GPS Coordinates
**Option A: Use the Map**
- Click anywhere on the interactive map to set coordinates
- The map shows both original and new locations

**Option B: Manual Entry**
- Enter latitude (-90 to 90) and longitude (-180 to 180)
- Optionally add altitude in meters
- Click "Set Coordinates" to apply

### 3. Embed GPS Data
- Click "Embed GPS Info" to write coordinates to the image
- The process preserves original image quality
- View updated GPS data in the EXIF panel

### 4. Download Updated Image
- Click "Download Image" to save the file with embedded GPS data
- The filename will include "updated-" prefix

### 5. Reset and Start Over
- Click "Reset" to clear all data and upload a new image

## 🔧 API Endpoints

### POST `/api/exif/upload`
Upload image and extract EXIF data
- **Body**: FormData with 'image' field
- **Response**: Image info, GPS data, and EXIF metadata

### POST `/api/exif/update-gps`
Embed GPS coordinates into image
- **Body**: `{ filename, latitude, longitude, altitude? }`
- **Response**: Updated filename and GPS data

### GET `/api/exif/download/:filename`
Download image with embedded GPS data
- **Response**: Image file stream

### GET `/api/exif/preview/:filename`
Get base64 image preview
- **Response**: `{ image: "data:image/jpeg;base64,..." }`

## 🌍 Language Support

The application supports:
- **English** (default)
- **Turkish** (Türkçe)

Switch languages using the dropdown in the top navigation bar.

## 📱 Responsive Design

- **Desktop**: Full-featured layout with side-by-side panels
- **Tablet**: Stacked layout with optimized spacing
- **Mobile**: Single-column layout with touch-friendly controls

## 🔒 Security Features

- File type validation (JPEG only)
- File size limits (10MB maximum)
- Rate limiting (100 requests per 15 minutes)
- Automatic cleanup of old uploaded files
- Input validation and sanitization

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend:
   ```bash
   cd frontend && npm run build
   ```
2. Deploy the `frontend/dist` folder

### Backend (Railway/Render/Heroku)
1. Set environment variables:
   ```bash
   PORT=5000
   NODE_ENV=production
   ```
2. Deploy the `backend` folder

### Environment Variables
```bash
# Backend
PORT=5000
NODE_ENV=production

# Frontend (optional)
VITE_API_URL=https://your-backend-url.com
```

## 📂 Project Structure

```
geoimgr-clone/
├── backend/
│   ├── routes/
│   │   └── exif.js          # EXIF processing routes
│   ├── uploads/             # Temporary file storage
│   ├── package.json
│   └── server.js            # Express server
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── i18n.js         # Internationalization
│   │   ├── index.css       # Tailwind styles
│   │   ├── main.jsx        # React entry point
│   │   └── App.jsx         # Main app component
│   ├── public/
│   ├── package.json
│   └── vite.config.js      # Vite configuration
├── package.json            # Root package.json
└── README.md
```

## 🧪 Testing

Test the application with sample images:
1. Images with existing GPS data (from phones/cameras)
2. Images without GPS data
3. Various JPEG formats and sizes
4. Different coordinate ranges (worldwide locations)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📋 To-Do / Future Enhancements

- [ ] Support for additional image formats (PNG, TIFF)
- [ ] Batch processing for multiple images
- [ ] Image preview with GPS overlay
- [ ] Export coordinates to various formats (KML, GPX)
- [ ] Integration with GPS tracking apps
- [ ] Image compression options
- [ ] Metadata editing for other EXIF fields

## ⚠️ Known Limitations

- Only JPEG/JPG files are supported
- Maximum file size is 10MB
- Temporary files are stored on server (cleaned automatically)
- GPS altitude is optional and may not be preserved by all devices

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙋‍♂️ Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Check existing documentation
- Review the code comments for implementation details

---

**Built with ❤️ for photographers and location enthusiasts** 