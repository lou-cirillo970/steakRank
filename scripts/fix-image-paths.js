// Script to ensure steak images are copied to the correct locations for Cloudflare Workers
const fs = require('fs');
const path = require('path');

function copyImagesToAllPossibleLocations() {
  try {
    console.log('Starting to copy steak images to all possible locations...');
    
    const publicDir = path.join(process.cwd(), 'public');
    const steaksDir = path.join(publicDir, 'steaks');
    
    // Define all possible output directories
    const outputDirs = [
      path.join(process.cwd(), '.next/static/media'),
      path.join(process.cwd(), '.next/static/images'),
      path.join(process.cwd(), '.next/static'),
      path.join(process.cwd(), '.next/server/static'),
      path.join(process.cwd(), '.next/server/chunks'),
      path.join(process.cwd(), '.next/server/pages'),
      path.join(process.cwd(), '.next/server'),
      path.join(process.cwd(), '.next'),
      path.join(process.cwd(), 'out'),
      path.join(process.cwd(), 'out/static'),
      path.join(process.cwd(), '.open-next/assets'),
      path.join(process.cwd(), '.open-next/server-function'),
      path.join(process.cwd(), '.open-next'),
    ];
    
    console.log(`Source directory: ${steaksDir}`);
    
    if (fs.existsSync(steaksDir)) {
      // Get all steak images
      const steakImages = fs.readdirSync(steaksDir);
      console.log(`Found ${steakImages.length} steak images to copy`);
      
      // Copy to each output directory
      outputDirs.forEach(outputDir => {
        if (!fs.existsSync(outputDir)) {
          try {
            fs.mkdirSync(outputDir, { recursive: true });
            console.log(`Created output directory: ${outputDir}`);
          } catch (err) {
            console.error(`Failed to create directory ${outputDir}:`, err);
          }
        }
        
        if (fs.existsSync(outputDir)) {
          // Copy all steak images to the root of the output directory
          steakImages.forEach(image => {
            try {
              const sourcePath = path.join(steaksDir, image);
              const destPath = path.join(outputDir, image);
              fs.copyFileSync(sourcePath, destPath);
              console.log(`Copied ${sourcePath} to ${destPath}`);
            } catch (err) {
              console.error(`Failed to copy ${image} to ${outputDir}:`, err);
            }
          });
        }
      });
      
      console.log('All steak images copied successfully!');
    } else {
      console.error(`Steaks directory not found: ${steaksDir}`);
    }
  } catch (error) {
    console.error('Error copying steak images:', error);
  }
}

// Run the function
copyImagesToAllPossibleLocations();
