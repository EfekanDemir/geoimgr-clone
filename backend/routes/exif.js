const express = require('express');
const path = require('path');
const fs = require('fs');
const exifr = require('exifr');
const piexif = require('piexifjs');

module.exports = (upload) => {
  const router = express.Router();

  // Helper function to convert decimal degrees to DMS (Degrees, Minutes, Seconds)
  const decimalToDMS = (decimal) => {
    const degrees = Math.floor(Math.abs(decimal));
    const minutes = Math.floor((Math.abs(decimal) - degrees) * 60);
    const seconds = ((Math.abs(decimal) - degrees) * 60 - minutes) * 60;
    
    return [
      [degrees, 1],
      [minutes, 1], 
      [Math.round(seconds * 100) / 100, 1]
    ];
  };

  // Helper function to convert DMS to decimal degrees
  const dmsToDecimal = (dms, ref) => {
    if (!dms || !Array.isArray(dms) || dms.length !== 3) return null;
    
    const degrees = dms[0][0] / dms[0][1];
    const minutes = dms[1][0] / dms[1][1];
    const seconds = dms[2][0] / dms[2][1];
    
    let decimal = degrees + minutes / 60 + seconds / 3600;
    
    if (ref === 'S' || ref === 'W') {
      decimal = -decimal;
    }
    
    return decimal;
  };

  // Helper function for XP fields (UTF-16LE encoding)
  function toUTF16LE(str) {
    // XP fields expect a Uint8Array of UTF-16LE bytes, null-terminated
    const buf = Buffer.from(str + '\0', 'utf16le');
    return Array.from(buf);
  }

  // Upload and read EXIF data
  router.post('/upload', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const filePath = req.file.path;
      console.log('Processing file:', req.file.originalname, 'at path:', filePath);
      
      // Read EXIF data using exifr with better parsing options
      let exifData = null;
      let fullExifData = {};
      
      try {
        // First try to get all EXIF data with proper parsing
        exifData = await exifr.parse(filePath, {
          gps: true,
          ifd0: true,
          exif: true,
          iptc: false,
          icc: false,
          tiff: true,
          mergeOutput: true,
          sanitize: true,
          translateValues: true,
          translateKeys: true,
          reviveValues: true
        });
        
        // Also try with raw data for backup
        const rawExifData = await exifr.parse(filePath, {
          mergeOutput: false,
          sanitize: false,
          translateValues: false,
          translateKeys: false
        });
        
        // Merge both results
        fullExifData = { ...rawExifData, ...exifData };
        
        // Try GPS extraction separately for better results
        const gpsData = await exifr.gps(filePath);
        if (gpsData) {
          console.log('GPS data from exifr.gps:', gpsData);
          fullExifData = { ...fullExifData, ...gpsData };
        }
        
        console.log('EXIF data parsed successfully');
        console.log('Available EXIF keys:', Object.keys(fullExifData));
        
        // Debug: Log all fields found
        const allFields = Object.keys(fullExifData);
        console.log('Total EXIF fields found:', allFields.length);
        
        // Find GPS-related fields
        const gpsFields = allFields.filter(key => 
          key.toLowerCase().includes('gps') || 
          key.toLowerCase().includes('latitude') || 
          key.toLowerCase().includes('longitude')
        );
        
        if (gpsFields.length > 0) {
          console.log('Found GPS-related fields:', gpsFields);
          gpsFields.forEach(field => {
            console.log(`${field}:`, fullExifData[field]);
          });
        }
        
        // Set the final data
        exifData = fullExifData;
      } catch (exifError) {
        console.log('EXIF parsing failed:', exifError.message);
        // Continue with empty EXIF data
        exifData = {};
      }

      let gpsData = null;
      let coordinates = null;

      // First try direct latitude/longitude (from some cameras)
      if (exifData && exifData.latitude && exifData.longitude) {
        coordinates = {
          lat: exifData.latitude,
          lng: exifData.longitude
        };
      }
      // If direct coordinates not found, try raw GPS fields
      else if (exifData && (exifData.GPSLatitude || exifData.GPSLongitude)) {
        console.log('Found raw GPS fields:', {
          GPSLatitude: exifData.GPSLatitude,
          GPSLatitudeRef: exifData.GPSLatitudeRef,
          GPSLongitude: exifData.GPSLongitude,
          GPSLongitudeRef: exifData.GPSLongitudeRef
        });

        const lat = dmsToDecimal(exifData.GPSLatitude, exifData.GPSLatitudeRef);
        const lng = dmsToDecimal(exifData.GPSLongitude, exifData.GPSLongitudeRef);

        if (lat !== null && lng !== null) {
          coordinates = { lat, lng };
          console.log('Converted GPS coordinates:', coordinates);
        }
      }

      // If we have coordinates, create GPS data object
      if (coordinates) {
        gpsData = {
          latitude: coordinates.lat,
          longitude: coordinates.lng,
          altitude: exifData.GPSAltitude ? 
            (Array.isArray(exifData.GPSAltitude) ? exifData.GPSAltitude[0] / exifData.GPSAltitude[1] : exifData.GPSAltitude) : null,
          altitudeRef: exifData.GPSAltitudeRef || null,
          timestamp: exifData.GPSTimeStamp || null,
          datestamp: exifData.GPSDateStamp || null,
          imgDirection: exifData.GPSImgDirection || null,
          imgDirectionRef: exifData.GPSImgDirectionRef || null,
          speed: exifData.GPSSpeed || null,
          speedRef: exifData.GPSSpeedRef || null
        };
      }

      // Get other EXIF data - check multiple possible field names
      const otherExifData = {
        make: exifData?.Make || exifData?.make || null,
        model: exifData?.Model || exifData?.model || null,
        dateTime: exifData?.DateTime || exifData?.dateTime || null,
        dateTimeOriginal: exifData?.DateTimeOriginal || exifData?.dateTimeOriginal || null,
        orientation: exifData?.Orientation || exifData?.orientation || null,
        xResolution: exifData?.XResolution || exifData?.xResolution || null,
        yResolution: exifData?.YResolution || exifData?.yResolution || null,
        resolutionUnit: exifData?.ResolutionUnit || exifData?.resolutionUnit || null,
        software: exifData?.Software || exifData?.software || null,
        artist: exifData?.Artist || exifData?.artist || null,
        copyright: exifData?.Copyright || exifData?.copyright || null,
        colorSpace: exifData?.ColorSpace || exifData?.colorSpace || null,
        whiteBalance: exifData?.WhiteBalance || exifData?.whiteBalance || null,
        flash: exifData?.Flash || exifData?.flash || null,
        focalLength: exifData?.FocalLength || exifData?.focalLength || null,
        exposureTime: exifData?.ExposureTime || exifData?.exposureTime || null,
        fNumber: exifData?.FNumber || exifData?.fNumber || null,
        iso: exifData?.ISO || exifData?.iso || exifData?.ISOSpeedRatings || null,
        exposureProgram: exifData?.ExposureProgram || exifData?.exposureProgram || null,
        meteringMode: exifData?.MeteringMode || exifData?.meteringMode || null,
        // Additional camera info
        lensMake: exifData?.LensMake || exifData?.lensMake || null,
        lensModel: exifData?.LensModel || exifData?.lensModel || null,
        digitalZoomRatio: exifData?.DigitalZoomRatio || exifData?.digitalZoomRatio || null,
        sceneCaptureType: exifData?.SceneCaptureType || exifData?.sceneCaptureType || null,
        gainControl: exifData?.GainControl || exifData?.gainControl || null,
        contrast: exifData?.Contrast || exifData?.contrast || null,
        saturation: exifData?.Saturation || exifData?.saturation || null,
        sharpness: exifData?.Sharpness || exifData?.sharpness || null,
        // Image dimensions
        imageWidth: exifData?.ImageWidth || exifData?.imageWidth || exifData?.ExifImageWidth || null,
        imageHeight: exifData?.ImageHeight || exifData?.imageHeight || exifData?.ExifImageHeight || null,
        // Color info
        colorSpace: exifData?.ColorSpace || exifData?.colorSpace || null,
        photometricInterpretation: exifData?.PhotometricInterpretation || exifData?.photometricInterpretation || null,
        // File info
        compression: exifData?.Compression || exifData?.compression || null,
        bitsPerSample: exifData?.BitsPerSample || exifData?.bitsPerSample || null,
        samplesPerPixel: exifData?.SamplesPerPixel || exifData?.samplesPerPixel || null,
        // Metadata fields - handle XP fields properly (UTF-16LE)
        keywords: (() => {
          let keywords = exifData?.Keywords || exifData?.XPKeywords || null;
          // If XPKeywords is an array of bytes, convert from UTF-16LE
          if (Array.isArray(keywords)) {
            try {
              const buffer = Buffer.from(keywords);
              keywords = buffer.toString('utf16le').replace(/\0/g, '');
            } catch (e) {
              console.log('Failed to decode XPKeywords:', e);
            }
          }
          return keywords || null;
        })(),
        description: (() => {
          let desc = exifData?.ImageDescription || exifData?.XPComment || exifData?.UserComment || null;
          // If XPComment is an array of bytes, convert from UTF-16LE
          if (Array.isArray(desc)) {
            try {
              const buffer = Buffer.from(desc);
              desc = buffer.toString('utf16le').replace(/\0/g, '');
            } catch (e) {
              console.log('Failed to decode XPComment:', e);
            }
          }
          return desc || null;
        })()
      };
      
      console.log('Processed EXIF data:', otherExifData);

      res.json({
        success: true,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        coordinates: coordinates,
        gpsData: gpsData,
        exifData: otherExifData,
        hasGPS: !!coordinates
      });

    } catch (error) {
      console.error('Error processing file:', req.file?.originalname, error.message);
      console.error('Full error:', error);
      
      // Clean up uploaded file on error
      if (req.file && req.file.path) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
          console.error('Error deleting file:', unlinkError.message);
        }
      }
      
      res.status(500).json({ 
        error: 'Error processing image file',
        details: error.message
      });
    }
  });

  // Update GPS coordinates in image
  router.post('/update-gps', async (req, res) => {
    try {
      const { filename, latitude, longitude, altitude, keywords, description } = req.body;

      if (!filename || latitude === undefined || longitude === undefined) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }

      const filePath = path.join(__dirname, '../uploads', filename);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
      }

      // Read the original image
      const imageData = fs.readFileSync(filePath);
      const imageDataUrl = 'data:image/jpeg;base64,' + imageData.toString('base64');

      // Get existing EXIF data
      let exifDict = {};
      try {
        exifDict = piexif.load(imageDataUrl);
      } catch (e) {
        // If no EXIF data exists, create new structure
        exifDict = {
          '0th': {},
          'Exif': {},
          'GPS': {},
          '1st': {},
          'thumbnail': null
        };
      }

      // Ensure GPS dict exists
      if (!exifDict.GPS) {
        exifDict.GPS = {};
      }

      // Convert coordinates to DMS format for EXIF
      const latDMS = decimalToDMS(latitude);
      const lngDMS = decimalToDMS(longitude);
      
      // Set GPS data
      exifDict.GPS[piexif.GPSIFD.GPSLatitude] = latDMS;
      exifDict.GPS[piexif.GPSIFD.GPSLatitudeRef] = latitude >= 0 ? 'N' : 'S';
      exifDict.GPS[piexif.GPSIFD.GPSLongitude] = lngDMS;
      exifDict.GPS[piexif.GPSIFD.GPSLongitudeRef] = longitude >= 0 ? 'E' : 'W';
      
      // Set altitude if provided
      if (altitude !== undefined && altitude !== null) {
        exifDict.GPS[piexif.GPSIFD.GPSAltitude] = [Math.abs(altitude * 100), 100];
        exifDict.GPS[piexif.GPSIFD.GPSAltitudeRef] = altitude >= 0 ? 0 : 1;
      }

      // Add timestamp
      const now = new Date();
      const timeString = [
        [now.getUTCHours(), 1],
        [now.getUTCMinutes(), 1],
        [now.getUTCSeconds(), 1]
      ];
      const dateString = now.toISOString().split('T')[0].replace(/-/g, ':');
      
      exifDict.GPS[piexif.GPSIFD.GPSTimeStamp] = timeString;
      exifDict.GPS[piexif.GPSIFD.GPSDateStamp] = dateString;

      // Add keywords and description to EXIF if provided
      if (keywords && keywords.trim()) {
        // Store keywords in EXIF Keywords field (XPKeywords expects UTF-16LE)
        exifDict['0th'][piexif.ImageIFD.XPKeywords] = toUTF16LE(keywords.trim());
        // Also store in standard Keywords field if available (plain string)
        if (piexif.ImageIFD.Keywords) {
          exifDict['0th'][piexif.ImageIFD.Keywords] = keywords.trim();
        }
      }

      if (description && description.trim()) {
        // Store description in EXIF ImageDescription field (plain string)
        exifDict['0th'][piexif.ImageIFD.ImageDescription] = description.trim();
        // Also store in XPComment for Windows compatibility (UTF-16LE)
        exifDict['0th'][piexif.ImageIFD.XPComment] = toUTF16LE(description.trim());
        // Store in UserComment in Exif IFD (plain string)
        exifDict.Exif[piexif.ExifIFD.UserComment] = description.trim();
      }

      // Convert back to bytes
      const exifBytes = piexif.dump(exifDict);
      
      // Insert EXIF data into image
      const newImageDataUrl = piexif.insert(exifBytes, imageDataUrl);
      
      // Convert back to buffer and save
      const base64Data = newImageDataUrl.replace(/^data:image\/jpeg;base64,/, '');
      const newImageBuffer = Buffer.from(base64Data, 'base64');
      
      // Create new filename for updated image
      const updatedFilename = 'updated-' + filename;
      const updatedFilePath = path.join(__dirname, '../uploads', updatedFilename);
      
      fs.writeFileSync(updatedFilePath, newImageBuffer);

      // Re-read EXIF data to verify
      const verifyExifData = await exifr.parse(updatedFilePath, {
        gps: true,
        ifd0: true,
        exif: true
      });

      const updatedGpsData = {
        latitude: verifyExifData?.latitude || null,
        longitude: verifyExifData?.longitude || null,
        altitude: verifyExifData?.altitude || null,
        altitudeRef: verifyExifData?.GPSAltitudeRef || null,
        timestamp: verifyExifData?.GPSTimeStamp || null,
        datestamp: verifyExifData?.GPSDateStamp || null
      };

      // Prepare response message
      let successMessage = 'GPS data updated successfully';
      const metadataAdded = [];
      
      if (keywords && keywords.trim()) {
        metadataAdded.push('keywords');
      }
      if (description && description.trim()) {
        metadataAdded.push('description');
      }
      
      if (metadataAdded.length > 0) {
        successMessage = `GPS data and ${metadataAdded.join(' & ')} successfully embedded!`;
      }

      res.json({
        success: true,
        updatedFilename: updatedFilename,
        coordinates: {
          lat: latitude,
          lng: longitude
        },
        gpsData: updatedGpsData,
        metadata: {
          keywords: keywords || null,
          description: description || null
        },
        message: successMessage
      });

    } catch (error) {
      console.error('Error updating GPS data:', error);
      res.status(500).json({ error: 'Error updating GPS data in image' });
    }
  });

  // Download image with updated GPS data
  router.get('/download/:filename', (req, res) => {
    try {
      const filename = req.params.filename;
      const filePath = path.join(__dirname, '../uploads', filename);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
      }

      // Set headers for download
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', 'image/jpeg');

      // Stream the file
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);

    } catch (error) {
      console.error('Error downloading file:', error);
      res.status(500).json({ error: 'Error downloading file' });
    }
  });

  // Get image as base64 for preview
  router.get('/preview/:filename', (req, res) => {
    try {
      const filename = req.params.filename;
      const filePath = path.join(__dirname, '../uploads', filename);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
      }

      const imageData = fs.readFileSync(filePath);
      const base64Image = imageData.toString('base64');

      res.json({
        success: true,
        image: `data:image/jpeg;base64,${base64Image}`
      });

    } catch (error) {
      console.error('Error getting preview:', error);
      res.status(500).json({ error: 'Error getting image preview' });
    }
  });

  // Export EXIF data in different formats
  router.post('/export', async (req, res) => {
    try {
      const { filename, format, gpsData, exifData } = req.body;

      if (!filename || !format) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }

      const filePath = path.join(__dirname, '../uploads', filename);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
      }

      // Combine all data
      const allData = {
        ...exifData,
        ...gpsData
      };

      // Remove null/undefined values
      const cleanData = Object.entries(allData)
        .filter(([key, value]) => value !== null && value !== undefined && value !== '')
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});

      let exportData;
      let contentType;
      let fileExtension;

      switch (format.toLowerCase()) {
        case 'txt':
          exportData = Object.entries(cleanData)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n');
          contentType = 'text/plain';
          fileExtension = 'txt';
          break;

        case 'csv':
          const csvHeaders = Object.keys(cleanData).join(',');
          const csvValues = Object.values(cleanData)
            .map(value => `"${value}"`)
            .join(',');
          exportData = `${csvHeaders}\n${csvValues}`;
          contentType = 'text/csv';
          fileExtension = 'csv';
          break;

        case 'json':
          exportData = JSON.stringify(cleanData, null, 2);
          contentType = 'application/json';
          fileExtension = 'json';
          break;

        case 'markdown':
          let markdownData = `# EXIF Data for ${filename}\n\n`;
          
          // GPS Data Section
          if (gpsData && Object.keys(gpsData).length > 0) {
            markdownData += `## GPS Data\n\n`;
            markdownData += `| Field | Value |\n`;
            markdownData += `|-------|-------|\n`;
            Object.entries(gpsData)
              .filter(([key, value]) => value !== null && value !== undefined && value !== '')
              .forEach(([key, value]) => {
                markdownData += `| ${key} | ${value} |\n`;
              });
            markdownData += `\n`;
          }

          // EXIF Data Section
          if (exifData && Object.keys(exifData).length > 0) {
            markdownData += `## EXIF Data\n\n`;
            markdownData += `| Field | Value |\n`;
            markdownData += `|-------|-------|\n`;
            Object.entries(exifData)
              .filter(([key, value]) => value !== null && value !== undefined && value !== '')
              .forEach(([key, value]) => {
                markdownData += `| ${key} | ${value} |\n`;
              });
            markdownData += `\n`;
          }

          markdownData += `---\n*Generated on ${new Date().toLocaleString()}*`;
          exportData = markdownData;
          contentType = 'text/markdown';
          fileExtension = 'md';
          break;

        default:
          return res.status(400).json({ error: 'Unsupported format' });
      }

      // Set response headers for download
      const exportFilename = `${path.parse(filename).name}_exif_data.${fileExtension}`;
      res.setHeader('Content-Disposition', `attachment; filename="${exportFilename}"`);
      res.setHeader('Content-Type', contentType);
      res.send(exportData);

    } catch (error) {
      console.error('Error exporting EXIF data:', error);
      res.status(500).json({ error: 'Error exporting EXIF data' });
    }
  });

  return router;
}; 