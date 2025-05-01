# SteakFlow 🥩

A modern next.js  web application for ranking and comparing different types of steaks in a tier list format. Built with Next.js and React.

## Features

- **Interactive Tier List**: Drag and drop steaks into S, A, B, C, or D ranks
- **17 Premium Steak Types**: Including Ribeye, Filet Mignon, New York Strip, and more
- **Image Generation**: Create and download a shareable image of your steak rankings
- **Responsive Design**: Works on both desktop and mobile devices
- **Modern UI**: Dark theme with smooth animations and intuitive drag-and-drop interface

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd steakflow
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

1. **Ranking Steaks**:
   - Drag steaks from the "Unranked Steaks" section into your preferred rank
   - S rank is the highest, D rank is the lowest
   - You can place multiple steaks in each rank
   - Rearrange steaks between ranks by dragging them to different tiers

2. **Generating Images**:
   - Click the "Generate Top 5 Image" button to create a shareable image
   - The image will include all your ranked steaks in their respective tiers
   - The image will automatically download as "steak-rankings.png"

## Available Steak Types

- Ribeye
- Filet Mignon
- New York Strip
- T-Bone
- Porterhouse
- Flank Steak
- Skirt Steak
- Top Sirloin
- Flat Iron
- Hanger Steak
- Tri-Tip
- Chuck Steak
- Tomahawk
- Denver Steak
- Picanha
- Beef Shanks
- Brisket

## Technologies Used

- Next.js
- React
- TypeScript
- CSS Modules
- html2canvas (for image generation)

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

This project is licensed under the MIT License - see the LICENSE file for details.
