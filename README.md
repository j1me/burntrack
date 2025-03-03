# BurnTrack PWA

BurnTrack is a Progressive Web Application designed to help users track their daily calorie intake and manage their health goals. With an intuitive interface and offline capabilities, BurnTrack makes it easy to monitor your nutrition and stay on track with your fitness objectives.

![BurnTrack Logo](public/logo192.png)

## Features

### User Profile Management
- Input and store height (cm/ft) and weight (kg/lbs)
- Calculate BMI and display health category
- Calculate daily calorie needs based on:
  * Basal Metabolic Rate (BMR)
  * Activity level
  * Weight goals (maintain/lose/gain)

### Food Tracking Interface
- Search functionality for common foods
- Display calorie content per serving
- Allow custom food entry with:
  * Food name
  * Serving size
  * Calories per serving
- Daily food log with:
  * Meals categorization (Breakfast/Lunch/Dinner/Snacks)
  * Running total of daily calories
  * Progress visualization towards daily goal

### Dashboard
- Daily calorie goal vs. actual intake
- Simple progress charts
- BMI status
- Weight trend

## Technical Details

### Frontend
- React.js for UI
- TypeScript for type safety
- Local Storage for data persistence
- Material-UI for styling
- PWA features:
  * Manifest.json
  * Service Worker for offline functionality
  * Install prompt

### Data Structure
- User profile object
- Food items array
- Daily logs object
- Local storage management

### Core Functions
- BMI calculation
- BMR calculation
- Daily calorie needs calculator
- Food search and filtering
- Daily log management
- Progress tracking

## Project Structure

```
burntrack/
├── public/                  # Static assets
│   ├── data/                # Food database CSV files
│   │   └── foodDatabase.ts  # Food database management
│   ├── favicon.ico          # App icon
│   ├── index.html           # HTML template
│   ├── logo192.png          # App icon (192x192)
│   ├── logo512.png          # App icon (512x512)
│   ├── manifest.json        # PWA manifest
│   └── robots.txt           # SEO configuration
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Layout/          # Layout components
│   │   └── PWAInstallPrompt.tsx # PWA install prompt
│   ├── context/             # React Context providers
│   │   └── AppContext.tsx   # Global state management
│   ├── pages/               # Page components
│   │   ├── Dashboard.tsx    # Dashboard page
│   │   ├── FoodTracker.tsx  # Food tracking page
│   │   ├── Profile.tsx      # User profile page
│   │   └── ProfileSetup.tsx # Initial setup page
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts         # Type definitions
│   ├── utils/               # Utility functions
│   │   ├── calculations.ts  # Health calculations
│   │   ├── foodDatabase.ts  # Food database management
│   │   ├── helpers.ts       # Helper functions
│   │   └── localStorage.ts  # Local storage management
│   ├── App.tsx              # Main App component
│   ├── index.css            # Global styles
│   ├── index.tsx            # Entry point
│   ├── service-worker.ts    # Service worker configuration
│   ├── serviceWorkerRegistration.ts # Service worker registration
│   └── theme.ts             # Material-UI theme
├── docs/                    # Documentation
│   ├── architecture.md      # Architecture diagrams
│   └── cursor_rules.md      # Coding standards
├── package.json             # Dependencies and scripts
└── tsconfig.json            # TypeScript configuration
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation
1. Clone the repository
```bash
git clone https://github.com/yourusername/burntrack.git
```

2. Install dependencies
```bash
cd burntrack
npm install
```

3. Start the development server
```bash
npm start
```

4. Build for production
```bash
npm run build
```

## Development Workflow

### Adding a New Feature
1. Create a new branch from main
2. Implement the feature
3. Write tests
4. Submit a pull request

### Code Style
- Follow the coding standards in [cursor_rules.md](docs/cursor_rules.md)
- Run linting before committing: `npm run lint`

### Testing
- Run tests: `npm test`
- Add tests for new features

## PWA Features

This app is designed as a Progressive Web App, which means it can be installed on your device and used offline. To install:

1. Open the app in a supported browser (Chrome, Edge, Safari, etc.)
2. Look for the install prompt or use the browser's menu to "Add to Home Screen"
3. Once installed, the app will work offline and provide a native-like experience

## Deployment

The app can be deployed to any static hosting service:

1. Build the app: `npm run build`
2. Deploy the contents of the `build` folder

Recommended hosting options:
- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

Please follow the coding standards in [cursor_rules.md](docs/cursor_rules.md).

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Create React App](https://create-react-app.dev/) for the initial project setup
- [Material-UI](https://mui.com/) for the UI components
- [Workbox](https://developers.google.com/web/tools/workbox) for PWA support

- testing
