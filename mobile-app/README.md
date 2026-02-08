# Field Sales Pro

A mobile-first Sales Officer application built with React Native. This app provides field sales representatives with intelligent lead management, real-time insights, and offline-first capabilities.

## Features

### 📱 Six Main Screens

1. **Login/Sign Up** - Secure authentication with user credentials
2. **Lead Feed** - Browse and filter leads with priority indicators and match percentages
3. **Lead Intelligence** - Detailed company insights, tender information, and business intelligence
4. **Detailed Lead Entry** - Record call outcomes, quality ratings, and visit notes
5. **Action History** - Timeline view of all sales activities with performance metrics
6. **Sync Dashboard** - Offline mode support with manual sync capabilities

### 🎯 Key Capabilities

- **Smart Lead Prioritization** - HOT, WARM, and NURTURE lead categories
- **Match Scoring** - AI-powered lead matching percentages
- **Business Intelligence** - Company revenue, employee count, fleet information
- **Activity Tracking** - Comprehensive call and meeting history
- **Offline Support** - Queue changes for sync when connection returns
- **Daily Goals** - Track progress toward call targets

## Installation

```bash
# Install dependencies
npm install

# iOS only - Install CocoaPods dependencies
cd ios && pod install && cd ..
```

## Running the App

```bash
# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## Project Structure

```
FieldSalesPro/
├── src/
│   ├── screens/              # All screen components
│   │   ├── LoginScreen.js
│   │   ├── LeadFeedScreen.js
│   │   ├── LeadIntelligenceScreen.js
│   │   ├── DetailedLeadEntryScreen.js
│   │   ├── ActionHistoryScreen.js
│   │   └── SyncDashboardScreen.js
│   ├── components/           # Reusable UI components
│   │   └── BottomTabBar.js
│   ├── navigation/           # Navigation configuration
│   │   └── AppNavigator.js
│   └── styles/              # Theme and global styles
│       ├── theme.js
│       └── globalStyles.js
├── App.js                   # Main app entry point
└── package.json
```

## Technologies Used

- **React Native 0.76.5** - Mobile framework
- **React Navigation** - Screen navigation and routing
- **React Native Vector Icons** - Icon library
- **React Native Gesture Handler** - Touch interactions

## Design System

### Color Palette
- **Primary**: #0066FF (Blue)
- **Background**: #F5F7FA (Light Gray)
- **Card**: #FFFFFF (White)
- **Text Primary**: #1A1A1A (Dark Gray)
- **Text Secondary**: #6B7280 (Medium Gray)

### Priority Colors
- **Hot Lead**: #FF4444 (Red)
- **Warm**: #FF8C00 (Orange)
- **Nurture**: #6B7280 (Gray)

## Screen Flow

```
Login Screen
    ↓
Lead Feed (Main Tab Navigation)
    ├── Lead Intelligence Screen
    │       ↓
    │   Detailed Lead Entry
    │       ↓
    │   Action History
    ├── Map (Placeholder)
    ├── History
    ├── Sync Dashboard
    └── Setup (Placeholder)
```

## Development Notes

This is a **UI/UX reproduction** focused on pixel-accurate replication of reference designs. The app currently includes:
- ✅ Complete UI implementation for all 6 screens
- ✅ Navigation flow between screens
- ✅ Interactive elements (buttons, tabs, filters)
- ✅ Responsive mobile layouts
- ⚠️ Mock data (no backend integration)
- ⚠️ Placeholder screens for Map and Setup tabs

## License

Private - Field Sales Pro Application
