const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Create the directory if it doesn't exist
const publicDir = path.join(process.cwd(), 'public');
const steaksDir = path.join(publicDir, 'steaks');

if (!fs.existsSync(steaksDir)) {
  fs.mkdirSync(steaksDir, { recursive: true });
}

// List of image URLs from the console errors
const imageUrls = [
  'https://7abb86d3-111a-4c9e-a8b9-f4c1a3a8ff82.wf-app-prod.cosmic.webflow.services/brisket.webp',
  'https://7abb86d3-111a-4c9e-a8b9-f4c1a3a8ff82.wf-app-prod.cosmic.webflow.services/flanksteak.webp',
  'https://7abb86d3-111a-4c9e-a8b9-f4c1a3a8ff82.wf-app-prod.cosmic.webflow.services/picanha.webp',
  'https://7abb86d3-111a-4c9e-a8b9-f4c1a3a8ff82.wf-app-prod.cosmic.webflow.services/skirt_steak.webp',
  'https://7abb86d3-111a-4c9e-a8b9-f4c1a3a8ff82.wf-app-prod.cosmic.webflow.services/new_york_strip.webp',
  'https://7abb86d3-111a-4c9e-a8b9-f4c1a3a8ff82.wf-app-prod.cosmic.webflow.services/Tbone.webp',
  'https://7abb86d3-111a-4c9e-a8b9-f4c1a3a8ff82.wf-app-prod.cosmic.webflow.services/tri_tip.webp',
  'https://7abb86d3-111a-4c9e-a8b9-f4c1a3a8ff82.wf-app-prod.cosmic.webflow.services/chuck_steak.webp',
  'https://7abb86d3-111a-4c9e-a8b9-f4c1a3a8ff82.wf-app-prod.cosmic.webflow.services/hanger_steak.webp',
  'https://7abb86d3-111a-4c9e-a8b9-f4c1a3a8ff82.wf-app-prod.cosmic.webflow.services/denver_steak.webp',
  'https://7abb86d3-111a-4c9e-a8b9-f4c1a3a8ff82.wf-app-prod.cosmic.webflow.services/Ribeye.webp',
  'https://7abb86d3-111a-4c9e-a8b9-f4c1a3a8ff82.wf-app-prod.cosmic.webflow.services/fillet_mignon.webp',
  'https://7abb86d3-111a-4c9e-a8b9-f4c1a3a8ff82.wf-app-prod.cosmic.webflow.services/tomahawk.webp',
  'https://7abb86d3-111a-4c9e-a8b9-f4c1a3a8ff82.wf-app-prod.cosmic.webflow.services/porterhouse.webp',
  'https://7abb86d3-111a-4c9e-a8b9-f4c1a3a8ff82.wf-app-prod.cosmic.webflow.services/beef_shank.webp'
];

// Function to download an image
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    console.log(`Downloading ${url} to ${filename}...`);
    
    // Determine if we need http or https
    const client = url.startsWith('https') ? https : http;
    
    const request = client.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        console.log(`Redirecting to ${response.headers.location}`);
        downloadImage(response.headers.location, filename)
          .then(resolve)
          .catch(reject);
        return;
      }
      
      // Check if the request was successful
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      
      // Create a write stream to save the image
      const fileStream = fs.createWriteStream(filename);
      
      // Pipe the response to the file
      response.pipe(fileStream);
      
      // Handle errors
      fileStream.on('error', (err) => {
        fs.unlink(filename, () => {}); // Delete the file on error
        reject(err);
      });
      
      // Finish up when the download is complete
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded ${url} to ${filename}`);
        resolve();
      });
    });
    
    // Handle errors
    request.on('error', (err) => {
      reject(err);
    });
    
    // End the request
    request.end();
  });
}

// Download all images
async function downloadAllImages() {
  const promises = [];
  
  for (const url of imageUrls) {
    // Extract the filename from the URL
    const filename = url.split('/').pop();
    
    // Save to both the steaks directory and the root public directory
    const steaksPath = path.join(steaksDir, filename);
    const publicPath = path.join(publicDir, filename);
    
    // Download to steaks directory
    promises.push(downloadImage(url, steaksPath));
    
    // Also download to public directory
    promises.push(downloadImage(url, publicPath));
  }
  
  try {
    await Promise.all(promises);
    console.log('All images downloaded successfully!');
  } catch (error) {
    console.error('Error downloading images:', error);
  }
}

// Run the download function
downloadAllImages();
