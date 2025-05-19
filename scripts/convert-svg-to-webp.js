// Script to convert SVG files to WebP format
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Check if ImageMagick is installed
exec('which convert', (error, stdout, stderr) => {
  if (error) {
    console.error('ImageMagick is not installed. Please install it first.');
    console.error('On macOS: brew install imagemagick');
    console.error('On Ubuntu/Debian: sudo apt-get install imagemagick');
    console.error('On Windows: Download from https://imagemagick.org/script/download.php');
    process.exit(1);
  }
  
  // If ImageMagick is installed, proceed with conversion
  convertSvgToWebp();
});

function convertSvgToWebp() {
  // Create the directory if it doesn't exist
  const publicDir = path.join(process.cwd(), 'public');
  const steaksDir = path.join(publicDir, 'steaks');
  const webpDir = path.join(publicDir, 'webp');

  if (!fs.existsSync(steaksDir)) {
    fs.mkdirSync(steaksDir, { recursive: true });
    console.log(`Created steaks directory: ${steaksDir}`);
  }

  if (!fs.existsSync(webpDir)) {
    fs.mkdirSync(webpDir, { recursive: true });
    console.log(`Created webp directory: ${webpDir}`);
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

  // Create a temporary SVG file
  const createSvgFile = (steakName, color) => {
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
      <rect width="400" height="300" fill="${color}" />
      <text x="200" y="150" font-family="Arial, sans-serif" font-size="32" fill="white" text-anchor="middle" dominant-baseline="middle">${steakName}</text>
    </svg>`;
    
    const tempSvgPath = path.join(publicDir, 'temp.svg');
    fs.writeFileSync(tempSvgPath, svgContent);
    return tempSvgPath;
  };

  // Map steak names to colors
  const colorMap = {
    'Ribeye': '#E74C3C',
    'Filet Mignon': '#C0392B',
    'New York Strip': '#9B59B6',
    'T-Bone': '#8E44AD',
    'Porterhouse': '#2980B9',
    'Flank Steak': '#3498DB',
    'Skirt Steak': '#1ABC9C',
    'Top Sirloin': '#16A085',
    'Flat Iron': '#27AE60',
    'Hanger Steak': '#2ECC71',
    'Tri-Tip': '#F1C40F',
    'Chuck Steak': '#8E44AD',
    'Tomahawk': '#D35400',
    'Denver Steak': '#E67E22',
    'Picanha': '#F39C12',
    'Beef Shanks': '#BDC3C7',
    'Brisket': '#95A5A6',
  };

  // Convert SVG to WebP using ImageMagick
  const convertToWebp = (svgPath, webpPath) => {
    return new Promise((resolve, reject) => {
      exec(`convert ${svgPath} ${webpPath}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error converting ${svgPath} to ${webpPath}:`, error);
          reject(error);
          return;
        }
        resolve();
      });
    });
  };

  // Process each steak type
  const processAllSteaks = async () => {
    console.log('Starting to convert SVG to WebP...');
    
    const tempSvgPath = path.join(publicDir, 'temp.svg');
    
    for (const steak of steakTypes) {
      try {
        // Get color for this steak
        const color = colorMap[steak.name] || '#666666';
        
        // Create SVG file
        createSvgFile(steak.name, color);
        
        // Convert to WebP
        const webpPath = path.join(webpDir, steak.filename);
        const publicWebpPath = path.join(publicDir, steak.filename);
        
        console.log(`Converting ${steak.name} to WebP...`);
        await convertToWebp(tempSvgPath, webpPath);
        
        // Copy to public root
        fs.copyFileSync(webpPath, publicWebpPath);
        console.log(`Created WebP for ${steak.name} at ${publicWebpPath}`);
      } catch (error) {
        console.error(`Error processing ${steak.name}:`, error);
      }
    }
    
    // Clean up temp file
    if (fs.existsSync(tempSvgPath)) {
      fs.unlinkSync(tempSvgPath);
    }
    
    console.log('Finished converting SVG to WebP!');
  };

  // Run the conversion
  processAllSteaks();
}
