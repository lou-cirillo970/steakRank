import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

type DebugResponse = {
  success: boolean;
  message: string;
  imageExists?: boolean;
  imagePath?: string;
  availableImages?: string[];
  error?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<DebugResponse>
) {
  try {
    // Get the image name from the query
    const { image } = req.query;
    
    if (!image || typeof image !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Image parameter is required',
      });
    }
    
    // Check if the image exists in various locations
    const publicDir = path.join(process.cwd(), 'public');
    const steaksDir = path.join(publicDir, 'steaks');
    
    // List of possible locations to check
    const possibleLocations = [
      path.join(steaksDir, image),
      path.join(publicDir, image),
      path.join(process.cwd(), '.next', image),
      path.join(process.cwd(), '.next', 'static', image),
      path.join(process.cwd(), '.open-next', 'assets', image),
    ];
    
    // Check each location
    let imageFound = false;
    let foundPath = '';
    
    for (const location of possibleLocations) {
      if (fs.existsSync(location)) {
        imageFound = true;
        foundPath = location;
        break;
      }
    }
    
    // Get a list of available images in the steaks directory
    let availableImages: string[] = [];
    if (fs.existsSync(steaksDir)) {
      availableImages = fs.readdirSync(steaksDir);
    }
    
    return res.status(200).json({
      success: true,
      message: imageFound ? `Image found at ${foundPath}` : 'Image not found',
      imageExists: imageFound,
      imagePath: foundPath,
      availableImages,
    });
  } catch (error) {
    console.error('Error in debug-image API:', error);
    return res.status(500).json({
      success: false,
      message: 'Error checking image',
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
