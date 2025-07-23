# Google Maps Integration Setup

This guide explains how to set up Google Maps integration for the Blood Donation Support System.

## Prerequisites

1. A Google Cloud Console account
2. A project with billing enabled (Google Maps requires a billing account, but includes generous free usage)

## Setup Steps

### 1. Create Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API (optional, for future enhancements)

4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy the generated API key

### 2. Configure the API Key

1. Open the `.env` file in your project root
2. Replace `your_google_maps_api_key_here` with your actual API key:
   ```
   VITE_GOOGLE_MAPS_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

### 3. Secure Your API Key (Recommended)

1. In Google Cloud Console, go to "Credentials"
2. Click on your API key to edit it
3. Under "Application restrictions":
   - Select "HTTP referrers (web sites)"
   - Add your domains (e.g., `localhost:5174/*`, `yourdomain.com/*`)
4. Under "API restrictions":
   - Select "Restrict key"
   - Choose "Maps JavaScript API"

### 4. Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to the "Search Nearby Donors" page
3. Perform a search for blood donors
4. Click "Xem trên bản đồ" (View on Map) button
5. The Google Map should load with donor locations marked

## Features

- **Interactive Map**: View donor locations on Google Maps
- **Info Windows**: Click on markers to see donor details
- **Responsive Design**: Works on desktop and mobile devices
- **Fallback UI**: Shows helpful message if API key is not configured

## Troubleshooting

### Map Not Loading
- Check if your API key is correctly set in `.env`
- Ensure Maps JavaScript API is enabled in Google Cloud Console
- Check browser console for error messages
- Verify API key restrictions allow your domain

### Markers Not Showing
- Ensure donor data includes valid latitude and longitude coordinates
- Check if donors have non-null location data

### API Quota Exceeded
- Google Maps provides free usage up to certain limits
- Monitor usage in Google Cloud Console
- Consider implementing caching for production use

## Cost Considerations

Google Maps JavaScript API pricing (as of 2024):
- First 28,000 map loads per month: FREE
- Additional loads: $7 per 1,000 loads

For most applications, the free tier should be sufficient during development and early production phases.
