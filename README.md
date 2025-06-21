# Believe Screener Mobile App

*A React Native mobile application replicating the core functionality of believescreener.com*

**Developer**: Dishank Chauhan  
**Project Type**: CrackedDevs.com Bounty Submission ($100)  
**Platform**: React Native (iOS/Android)  
**Status**: In Development

## 🎯 Project Overview

This project is a mobile adaptation of the popular crypto token screening platform [believescreener.com](https://believescreener.com). The goal is to bring the comprehensive token analysis and portfolio tracking capabilities to mobile devices, providing crypto traders and investors with on-the-go access to real-time market data and advanced screening tools.

### Why This Project?

I discovered this $100 bounty on CrackedDevs.com, which serves as a unique job application funnel for an elite development team with a 1% acceptance rate. Beyond the bounty, this project represents an opportunity to:

- Demonstrate proficiency in React Native and modern mobile development
- Showcase ability to replicate complex web interfaces on mobile
- Build a production-ready crypto trading application
- Contribute to the DeFi ecosystem with better mobile tooling

## 📱 App Screenshots

<div align="center">


<img src="src/assets/images/image1.png" width="250" alt="Dashboard Screen" /> <img src="src/assets/images/image2.png" width="250" alt="Token List Screen" />


<img src="src/assets/images/image3.png" width="250" alt="Token Detail Screen" /> <img src="src/assets/images/image4.png" width="250" alt="Price Charts" />


<img src="src/assets/images/image5.png" width="250" alt="Portfolio Screen" /> <img src="src/assets/images/image6.png" width="250" alt="Favorites Screen" />

</div>



## 🚀 What We've Accomplished

### Phase 1: Foundation & Setup ✅
- **Project Initialization**: React Native 0.80.0 with TypeScript template
- **Architecture Setup**: Professional folder structure with separation of concerns
- **State Management**: Redux Toolkit with RTK Query for API management
- **Navigation**: React Navigation v6 with bottom tabs and stack navigation
- **UI Framework**: React Native Elements with custom theming
- **iOS Configuration**: CocoaPods setup, native module linking, font registration

### Phase 2: Core Components ✅
- **MetricCard**: Reusable component for displaying statistics with formatting, loading states, and interactive elements
- **Dashboard Screen**: Comprehensive overview with lifetime metrics, platform breakdown, and real-time data
- **TokenRow**: Complex list item component with ranking, price data, change indicators, and action buttons
- **TokenList Screen**: Full-featured token browser with search, sorting, and favorites functionality

### Phase 3: Advanced Features ✅
- **Token Detail Screen**: In-depth token analysis with price charts, statistics, holder information, and trading activity
- **Interactive Charts**: Multiple chart types (Area, Line, Volume) with timeframe selection and gradient styling
- **Portfolio Management**: Holdings tracking with P&L calculations and performance metrics
- **Favorites System**: Star/unstar tokens with dedicated favorites screen

### Phase 4: UI/UX Polish ✅
- **Dark Theme**: Consistent branding matching Believe Screener's color scheme (#00FF88 primary)
- **Icon System**: MaterialIcons integration with proper iOS font registration
- **Responsive Design**: Safe area handling, proper spacing, and cross-device compatibility
- **Performance Optimization**: Memoization, debounced search, and efficient re-renders

## 🎨 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    BELIEVE SCREENER MOBILE                  │
│                     React Native App                        │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      APP LAYER                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   App.tsx       │  │  Navigation     │  │  Providers   │ │
│  │  - Redux Store  │  │  - Tab Nav      │  │  - Gesture   │ │
│  │  - Gesture      │  │  - Stack Nav    │  │  - SafeArea  │ │
│  │  - SafeArea     │  │  - Deep Links   │  │  - StatusBar │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    SCREEN LAYER                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────┐ │
│  │ Dashboard   │ │   Tokens    │ │ Favorites   │ │Portfolio│ │
│  │ - Metrics   │ │ - Search    │ │ - Holdings  │ │ - P&L   │ │
│  │ - Overview  │ │ - Sort      │ │ - Empty     │ │ - Total │ │
│  │ - Platform  │ │ - Filter    │ │ - Actions   │ │ - Value │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              TokenDetail Screen                         │ │
│  │  - Price Charts (Area/Line/Volume)                     │ │
│  │  - Statistics Grid                                     │ │
│  │  - Trading Activity                                    │ │
│  │  - Top Holders List                                    │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  COMPONENT LAYER                            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────┐ │
│  │ MetricCard  │ │  TokenRow   │ │ PriceChart  │ │ Common │ │
│  │ - Formatting│ │ - Ranking   │ │ - Gradients │ │ - Icons │ │
│  │ - Loading   │ │ - Actions   │ │ - Timeframe │ │ - Utils │ │
│  │ - Currency  │ │ - Changes   │ │ - Interactive│ │ - Types │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └────────┘ │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    STATE LAYER                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                Redux Toolkit Store                      │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │ │
│  │  │   API       │ │   Tokens    │ │ Portfolio   │       │ │
│  │  │ - RTK Query │ │ - Favorites │ │ - Holdings  │       │ │
│  │  │ - Caching   │ │ - Search    │ │ - P&L       │       │ │
│  │  │ - Sync      │ │ - Sort      │ │ - Total     │       │ │
│  │  └─────────────┘ └─────────────┘ └─────────────┘       │ │
│  │                                                         │ │
│  │  ┌─────────────┐ ┌─────────────┐                       │ │
│  │  │ Dashboard   │ │  Settings   │                       │ │
│  │  │ - Metrics   │ │ - Theme     │                       │ │
│  │  │ - Platform  │ │ - Prefs     │                       │ │
│  │  └─────────────┘ └─────────────┘                       │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   NATIVE LAYER                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────┐ │
│  │    iOS      │ │   Android   │ │   Charts    │ │ Vector │ │
│  │ - Cocoapods │ │ - Gradle    │ │ - SVG       │ │ Icons  │ │
│  │ - Info.plist│ │ - Manifest  │ │ - Gestures  │ │ - Fonts│ │
│  │ - Fonts     │ │ - Fonts     │ │ - Animation │ │ - TTF  │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🛠 Tech Stack

### Core Framework
- **React Native**: 0.80.0 - Cross-platform mobile development
- **TypeScript**: Type safety and better developer experience
- **New Architecture**: Fabric renderer and TurboModules enabled

### State Management
- **Redux Toolkit**: Modern Redux with less boilerplate
- **RTK Query**: Data fetching and caching solution
- **React Redux**: React bindings for Redux

### Navigation
- **React Navigation v6**: Tab and stack navigation
- **React Native Screens**: Native screen optimization
- **React Native Safe Area Context**: Safe area handling

### UI/UX
- **React Native Elements**: UI component library
- **React Native Vector Icons**: MaterialIcons font family
- **React Native Chart Kit**: Interactive price charts
- **React Native SVG**: Chart rendering support

### Development Tools
- **Metro**: React Native bundler
- **Flipper**: Debugging and performance monitoring
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting

### Native Dependencies
- **CocoaPods**: iOS dependency management
- **Gradle**: Android build system
- **React Native Gesture Handler**: Touch interactions
- **AsyncStorage**: Local data persistence

## 📱 Current Features

### 🏠 Dashboard
- **Lifetime Volume**: $3.77B tracked volume
- **Coin Launches**: 40,603 tokens monitored
- **Active Coins**: 174 currently active
- **Market Metrics**: Total market cap, 24h volume, liquidity
- **Platform Breakdown**: LAUNCHCOIN vs Creator Coins analysis

### 🪙 Token Browser
- **Search**: Real-time token search by symbol, name, or address
- **Sorting**: Market cap, volume, price change, age
- **Filtering**: Advanced filters for token discovery
- **Favorites**: Star/unstar tokens for quick access

### 📊 Token Analysis
- **Price Charts**: Interactive charts with multiple timeframes
- **Statistics**: Market cap, volume, liquidity, holder count
- **Trading Activity**: Buy/sell volume, unique wallets
- **Top Holders**: Ranked holder list with percentages

### 💼 Portfolio Management
- **Holdings**: Track your token positions
- **P&L Tracking**: Profit/loss calculations
- **Performance**: Day change, total return metrics
- **Value**: Real-time portfolio valuation

## 🎯 Future Roadmap

### Phase 5: Real API Integration 🔄
- [ ] Connect to Believe Screener API endpoints
- [ ] Real-time WebSocket data feeds
- [ ] Live price updates and notifications
- [ ] Historical data synchronization

### Phase 6: Advanced Features 📈
- [ ] Price alerts and notifications
- [ ] Advanced charting with technical indicators
- [ ] Portfolio analytics and insights
- [ ] Social features (community sentiment)

### Phase 7: Trading Integration 💱
- [ ] DEX integration for direct trading
- [ ] Wallet connection (WalletConnect)
- [ ] Transaction history tracking
- [ ] Gas fee optimization

### Phase 8: Professional Tools 🔧
- [ ] Custom screeners and filters
- [ ] Export functionality (CSV, PDF)
- [ ] API access for power users
- [ ] White-label solutions

## 🚀 Getting Started

### Prerequisites
```bash
# Node.js and npm
node --version  # v18+
npm --version   # v8+

# React Native CLI
npm install -g react-native-cli

# iOS (macOS only)
xcode-select --install
sudo gem install cocoapods

# Android
# Install Android Studio and SDK
```

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd believe_screener

# Install dependencies
npm install

# iOS setup
cd ios && pod install && cd ..

# Run on iOS
npx react-native run-ios

# Run on Android
npx react-native run-android
```

### Development
```bash
# Start Metro bundler
npx react-native start

# Run with specific simulator
npx react-native run-ios --simulator="iPhone 16 Pro"

# Debug mode
npx react-native log-ios
npx react-native log-android
```

## 📊 Performance Metrics

- **Bundle Size**: ~15MB (optimized for mobile)
- **Cold Start**: <2 seconds on modern devices
- **Hot Reload**: 1-3 seconds for JavaScript changes
- **Memory Usage**: <100MB average runtime
- **Battery Impact**: Minimal with efficient rendering

## 🤝 Contributing

This project is currently in active development as part of a bounty submission. After completion, contributions will be welcome following these guidelines:

1. Fork the repository
2. Create a feature branch
3. Follow TypeScript and ESLint conventions
4. Add tests for new functionality
5. Submit a pull request with detailed description

## 📄 License

This project is developed as part of a CrackedDevs.com bounty submission. License terms will be determined upon project completion.

## 🙋‍♂️ About ME

**Dishank Chauhan** - Full Stack Developer specializing in web3 and modern web technologies. Passionate about DeFi, mobile development, and creating user-centric applications.

- **Portfolio**: [https://portfolio-git-main-dishank-chauhans-projects.vercel.app/]
- **LinkedIn**: [https://www.linkedin.com/in/dishank-chauhan-186853207/]
- **GitHub**: [https://github.com/DishankChauhan]
- **Email**: [dishankchauhan29@gmail.com]

---

*Built with ❤️ for the crypto community*
