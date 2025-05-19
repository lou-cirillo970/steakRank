// Script to prepare the application for deployment to Cloudflare Workers
const fs = require('fs');
const path = require('path');

// Create the directory if it doesn't exist
const publicDir = path.join(process.cwd(), 'public');
const steaksDir = path.join(publicDir, 'steaks');

console.log('Starting deployment preparation...');

// Function to copy all steak images to the root public directory
function copyImagesToPublicRoot() {
  console.log('Copying steak images to public root...');
  
  if (fs.existsSync(steaksDir)) {
    const steakImages = fs.readdirSync(steaksDir);
    console.log(`Found ${steakImages.length} steak images to copy`);
    
    steakImages.forEach(image => {
      const sourcePath = path.join(steaksDir, image);
      const destPath = path.join(publicDir, image);
      
      try {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`Copied ${sourcePath} to ${destPath}`);
      } catch (error) {
        console.error(`Error copying ${sourcePath} to ${destPath}:`, error);
      }
    });
    
    console.log('All steak images copied to public root successfully!');
  } else {
    console.error(`Steaks directory not found: ${steaksDir}`);
  }
}

// Function to create placeholder images for any missing steak images
function createPlaceholders() {
  console.log('Creating placeholder images for any missing steak images...');
  
  // List of expected steak images
  const expectedImages = [
    'brisket.webp',
    'flanksteak.webp',
    'picanha.webp',
    'skirt_steak.webp',
    'new_york_strip.webp',
    'Tbone.webp',
    'tri_tip.webp',
    'chuck_steak.webp',
    'hanger_steak.webp',
    'denver_steak.webp',
    'Ribeye.webp',
    'Fillet_mignon.webp',
    'tomahawk.webp',
    'porterhouse.webp',
    'beef_shank.webp',
    'top_sirloin.webp',
    'flatiron.webp'
  ];
  
  // Create a simple SVG placeholder image with the steak name
  function createPlaceholderSVG(steakName) {
    // Remove file extension and replace underscores with spaces
    const displayName = steakName
      .replace('.webp', '')
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="#1B4D3E" />
      <text x="100" y="100" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle" dominant-baseline="middle">${displayName}</text>
    </svg>`;
  }
  
  // Check for missing images in both directories
  expectedImages.forEach(imageName => {
    const steaksPath = path.join(steaksDir, imageName);
    const publicPath = path.join(publicDir, imageName);
    
    // Create steaks directory if it doesn't exist
    if (!fs.existsSync(steaksDir)) {
      fs.mkdirSync(steaksDir, { recursive: true });
      console.log(`Created steaks directory: ${steaksDir}`);
    }
    
    // Check if the image is missing in the steaks directory
    if (!fs.existsSync(steaksPath)) {
      console.log(`Creating placeholder for ${imageName} in steaks directory`);
      const svg = createPlaceholderSVG(imageName);
      fs.writeFileSync(steaksPath, svg);
    }
    
    // Check if the image is missing in the public directory
    if (!fs.existsSync(publicPath)) {
      console.log(`Creating placeholder for ${imageName} in public directory`);
      
      // If the image exists in steaks directory, copy it
      if (fs.existsSync(steaksPath)) {
        fs.copyFileSync(steaksPath, publicPath);
      } else {
        // Otherwise create a placeholder
        const svg = createPlaceholderSVG(imageName);
        fs.writeFileSync(publicPath, svg);
      }
    }
  });
  
  console.log('All placeholder images created successfully!');
}

// Run the functions
createPlaceholders();
copyImagesToPublicRoot();

console.log('Deployment preparation completed successfully!');
