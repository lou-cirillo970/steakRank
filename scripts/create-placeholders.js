const fs = require('fs');
const path = require('path');

// Create the directory if it doesn't exist
const publicDir = path.join(process.cwd(), 'public');
const steaksDir = path.join(publicDir, 'steaks');

if (!fs.existsSync(steaksDir)) {
  fs.mkdirSync(steaksDir, { recursive: true });
}

// List of image filenames from the console errors
const imageFilenames = [
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
  'fillet_mignon.webp',
  'tomahawk.webp',
  'porterhouse.webp',
  'beef_shank.webp'
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

// Function to create a placeholder image
function createPlaceholder(filename) {
  const steaksPath = path.join(steaksDir, filename);
  const publicPath = path.join(publicDir, filename);
  
  // Check if the file already exists in the public directory
  if (!fs.existsSync(publicPath)) {
    console.log(`Creating placeholder for ${filename} in public directory`);
    const svg = createPlaceholderSVG(filename);
    fs.writeFileSync(publicPath, svg);
  }
  
  // Check if the file already exists in the steaks directory
  if (!fs.existsSync(steaksPath)) {
    console.log(`Creating placeholder for ${filename} in steaks directory`);
    const svg = createPlaceholderSVG(filename);
    fs.writeFileSync(steaksPath, svg);
  }
}

// Create placeholders for all images
function createAllPlaceholders() {
  for (const filename of imageFilenames) {
    createPlaceholder(filename);
  }
  console.log('All placeholders created successfully!');
}

// Run the function
createAllPlaceholders();
