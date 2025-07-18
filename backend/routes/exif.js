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

  // Upload and read EXIF data
  router.post('/upload', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const filePath = req.file.path;
      console.log('Processing file:', req.file.originalname, 'at path:', filePath);
      
      // Read EXIF data using exifr with error handling
      let exifData = null;
      try {
        exifData = await exifr.parse(filePath, {
          gps: true,
          ifd0: true,
          exif: true,
          iptc: false,
          icc: false,
          tiff: true,
          mergeOutput: false,
          sanitize: false,
          translateValues: false,
          translateKeys: false,
          reviveValues: false
        });
        
        // Also get raw GPS data separately
        const rawGpsData = await exifr.gps(filePath);
        if (rawGpsData) {
          console.log('Raw GPS data from exifr.gps:', rawGpsData);
          // Merge the raw GPS data
          exifData = { ...exifData, ...rawGpsData };
        }
        console.log('EXIF data parsed successfully');
        
        // Debug: Log all GPS-related fields found
        const gpsFields = Object.keys(exifData).filter(key => 
          key.toLowerCase().includes('gps') || 
          key.toLowerCase().includes('latitude') || 
          key.toLowerCase().includes('longitude')
        );
        if (gpsFields.length > 0) {
          console.log('Found GPS-related fields:', gpsFields);
          gpsFields.forEach(field => {
            console.log(`${field}:`, exifData[field]);
          });
        }
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

      // Get other EXIF data
      const otherExifData = {
        make: exifData?.Make || null,
        model: exifData?.Model || null,
        dateTime: exifData?.DateTime || null,
        dateTimeOriginal: exifData?.DateTimeOriginal || null,
        orientation: exifData?.Orientation || null,
        xResolution: exifData?.XResolution || null,
        yResolution: exifData?.YResolution || null,
        resolutionUnit: exifData?.ResolutionUnit || null,
        software: exifData?.Software || null,
        artist: exifData?.Artist || null,
        copyright: exifData?.Copyright || null,
        colorSpace: exifData?.ColorSpace || null,
        whiteBalance: exifData?.WhiteBalance || null,
        flash: exifData?.Flash || null,
        focalLength: exifData?.FocalLength || null,
        exposureTime: exifData?.ExposureTime || null,
        fNumber: exifData?.FNumber || null,
        iso: exifData?.ISO || null,
        exposureProgram: exifData?.ExposureProgram || null,
        meteringMode: exifData?.MeteringMode || null
      };

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
      const { filename, latitude, longitude, altitude } = req.body;

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

      res.json({
        success: true,
        updatedFilename: updatedFilename,
        coordinates: {
          lat: latitude,
          lng: longitude
        },
        gpsData: updatedGpsData,
        message: 'GPS data updated successfully'
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

  return router;
}; 