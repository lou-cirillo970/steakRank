const fs = require('fs');
const path = require('path');

// Create the directory if it doesn't exist
const publicDir = path.join(process.cwd(), 'public');
const steaksDir = path.join(publicDir, 'steaks');

if (!fs.existsSync(steaksDir)) {
  fs.mkdirSync(steaksDir, { recursive: true });
}

// List of steak types
const steakImages = [
  { name: 'Ribeye.webp', displayName: 'Ribeye' },
  { name: 'Fillet_mignon.webp', displayName: 'Fillet Mignon' },
  { name: 'new_york_strip.webp', displayName: 'New York Strip' },
  { name: 'Tbone.webp', displayName: 'T-Bone' },
  { name: 'porterhouse.webp', displayName: 'Porterhouse' },
  { name: 'flanksteak.webp', displayName: 'Flank Steak' },
  { name: 'skirt_steak.webp', displayName: 'Skirt Steak' },
  { name: 'top_sirloin.webp', displayName: 'Top Sirloin' },
  { name: 'flatiron.webp', displayName: 'Flat Iron' },
  { name: 'hanger_steak.webp', displayName: 'Hanger Steak' },
  { name: 'tri_tip.webp', displayName: 'Tri-Tip' },
  { name: 'chuck_steak.webp', displayName: 'Chuck Steak' },
  { name: 'tomahawk.webp', displayName: 'Tomahawk' },
  { name: 'denver_steak.webp', displayName: 'Denver Steak' },
  { name: 'picanha.webp', displayName: 'Picanha' },
  { name: 'beef_shank.webp', displayName: 'Beef Shank' },
  { name: 'brisket.webp', displayName: 'Brisket' }
];

// Colors for the placeholder images
const colors = [
  '#E74C3C', '#C0392B', '#D35400', '#E67E22',
  '#F39C12', '#F1C40F', '#2ECC71', '#27AE60',
  '#3498DB', '#2980B9', '#9B59B6', '#8E44AD',
  '#34495E', '#2C3E50', '#1ABC9C', '#16A085'
];

// Function to create a colored SVG placeholder with the steak name
function createPlaceholderSVG(steakName, displayName, index) {
  const color = colors[index % colors.length];

  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
    <rect width="400" height="300" fill="${color}" />
    <text x="200" y="150" font-family="Arial, sans-serif" font-size="32" fill="white" text-anchor="middle" dominant-baseline="middle">${displayName}</text>
  </svg>`;
}

// Function to create a placeholder image
function createPlaceholderImage(steakImage, index) {
  return new Promise((resolve, reject) => {
    try {
      const { name, displayName } = steakImage;
      console.log(`Creating placeholder for ${name}...`);

      // Create SVG content
      const svgContent = createPlaceholderSVG(name, displayName, index);

      // Save to steaks directory
      const steaksPath = path.join(steaksDir, name);
      fs.writeFileSync(steaksPath, svgContent);
      console.log(`Created ${steaksPath}`);

      // Save to public directory
      const publicPath = path.join(publicDir, name);
      fs.writeFileSync(publicPath, svgContent);
      console.log(`Created ${publicPath}`);

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

// Create all placeholder images
async function createAllPlaceholders() {
  const promises = [];

  steakImages.forEach((steakImage, index) => {
    promises.push(createPlaceholderImage(steakImage, index));
  });

  try {
    await Promise.all(promises);
    console.log('All placeholder images created successfully!');
  } catch (error) {
    console.error('Error creating placeholder images:', error);
  }
}

// Run the function
createAllPlaceholders();
