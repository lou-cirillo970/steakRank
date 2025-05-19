// Script to download real steak images from Unsplash
const fs = require('fs');
const path = require('path');
const https = require('https');

// Create the directory if it doesn't exist
const publicDir = path.join(process.cwd(), 'public');
const steaksDir = path.join(publicDir, 'steaks');
const realSteaksDir = path.join(publicDir, 'real-steaks');

if (!fs.existsSync(steaksDir)) {
  fs.mkdirSync(steaksDir, { recursive: true });
  console.log(`Created steaks directory: ${steaksDir}`);
}

if (!fs.existsSync(realSteaksDir)) {
  fs.mkdirSync(realSteaksDir, { recursive: true });
  console.log(`Created real-steaks directory: ${realSteaksDir}`);
}

// List of steak types
const steakTypes = [
  { name: 'Ribeye', filename: 'Ribeye.webp' },
  { name: 'Filet Mignon', filename: 'Fillet_mignon.webp' },
  { name: 'New York Strip', filename: 'new_york_strip.webp' },
  { name: 'T-Bone', filename: 'Tbone.webp' },
  { name: 'Porterhouse', filename: 'porterhouse.webp' },
  { name: 'Flank Steak', filename: 'flanksteak.webp' },
  { name: 'Skirt Steak', filename: 'skirt_steak.webp' },
  { name: 'Top Sirloin', filename: 'top_sirloin.webp' },
  { name: 'Flat Iron', filename: 'flatiron.webp' },
  { name: 'Hanger Steak', filename: 'hanger_steak.webp' },
  { name: 'Tri-Tip', filename: 'tri_tip.webp' },
  { name: 'Chuck Steak', filename: 'chuck_steak.webp' },
  { name: 'Tomahawk', filename: 'tomahawk.webp' },
  { name: 'Denver Steak', filename: 'denver_steak.webp' },
  { name: 'Picanha', filename: 'picanha.webp' },
  { name: 'Beef Shanks', filename: 'beef_shank.webp' },
  { name: 'Brisket', filename: 'brisket.webp' },
];

// Function to download an image from a URL
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      // Check if the response is an image
      const contentType = response.headers['content-type'];
      if (!contentType || !contentType.startsWith('image/')) {
        reject(new Error(`Invalid content type: ${contentType}`));
        return;
      }

      // Create a write stream to save the image
      const fileStream = fs.createWriteStream(filename);
      
      // Pipe the response to the file
      response.pipe(fileStream);
      
      // Handle errors
      fileStream.on('error', (err) => {
        fs.unlink(filename, () => {}); // Delete the file if there's an error
        reject(err);
      });
      
      // Resolve the promise when the file is saved
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Function to download all steak images
async function downloadAllSteakImages() {
  console.log('Starting to download real steak images...');
  
  for (const steak of steakTypes) {
    const searchTerm = steak.name.toLowerCase().replace(/\s+/g, '-');
    const unsplashUrl = `https://source.unsplash.com/featured/?steak,${searchTerm},meat`;
    const outputPath = path.join(realSteaksDir, steak.filename);
    const publicPath = path.join(publicDir, steak.filename);
    
    try {
      console.log(`Downloading ${steak.name} image...`);
      await downloadImage(unsplashUrl, outputPath);
      console.log(`Downloaded ${steak.name} image to ${outputPath}`);
      
      // Also copy to the public root
      fs.copyFileSync(outputPath, publicPath);
      console.log(`Copied to ${publicPath}`);
    } catch (error) {
      console.error(`Error downloading ${steak.name} image:`, error);
    }
  }
  
  console.log('Finished downloading real steak images!');
}

// Run the function
downloadAllSteakImages();
