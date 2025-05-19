// Script to copy steak images to the root of the output directory
const fs = require('fs');
const path = require('path');

function copyImagesToRoot() {
  try {
    console.log('Starting to copy steak images to root...');
    
    const publicDir = path.join(process.cwd(), 'public');
    const steaksDir = path.join(publicDir, 'steaks');
    const outputDir = path.join(process.cwd(), '.open-next/assets');
    
    console.log(`Source directory: ${steaksDir}`);
    console.log(`Destination directory: ${outputDir}`);
    
    if (fs.existsSync(steaksDir)) {
      // Create the output directory if it doesn't exist
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
        console.log(`Created output directory: ${outputDir}`);
      }
      
      // Copy all steak images to the root of the output directory
      const steakImages = fs.readdirSync(steaksDir);
      console.log(`Found ${steakImages.length} steak images to copy`);
      
      steakImages.forEach(image => {
        const sourcePath = path.join(steaksDir, image);
        const destPath = path.join(outputDir, image);
        fs.copyFileSync(sourcePath, destPath);
        console.log(`Copied ${sourcePath} to ${destPath}`);
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
copyImagesToRoot();
