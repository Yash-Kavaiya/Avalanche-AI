# Avalanche AI Agent Platform

## Project Description
A comprehensive AI-powered blockchain analytics platform specifically designed for the Avalanche ecosystem. Combines intelligent AI assistance with professional-grade analytics tools, real-time blockchain data integration, advanced DeFi insights, smart contract security analysis, market intelligence, subnet exploration, and NFT analytics to help users navigate and analyze the Avalanche blockchain efficiently.

## Key Features
- **AI-Powered Chat Assistant**: Multi-model AI chat with DevvAI, Kimi-K2, OpenRouter integration for blockchain queries and analysis
- **Voice Interface**: ElevenLabs STT/TTS integration for hands-free interaction and accessibility
- **Authentication System**: Secure email OTP verification with session management
- **Real-time Blockchain Integration**: Live Avalanche network data, wallet analysis, and transaction monitoring
- **Advanced Wallet Analysis**: Comprehensive wallet analytics with professional scoring, side-by-side comparison, and detailed performance insights
- **Wallet Scoring System**: Professional-grade wallet evaluation with A-F grading, strength/weakness analysis, and actionable recommendations
- **Wallet Comparison Tools**: Side-by-side performance comparison between multiple wallets with detailed metrics
- **Portfolio Analytics**: Multi-wallet tracking with portfolio analytics, balance monitoring, and asset allocation analysis
- **Transaction Analysis**: Transaction history, gas analytics, and blockchain explorer integration with pattern detection
- **DeFi Analytics**: Portfolio tracking, yield opportunities, and protocol integration
- **Smart Contract Security Scanner**: Vulnerability detection, gas optimization analysis, and function simulation
- **Market Intelligence Dashboard**: Comprehensive 8-tab analytics suite with real-time data, sentiment analysis, trading opportunities, DeFi metrics, news aggregation, technical analysis, asset screening, and price alerts
- **Subnet Explorer**: Comprehensive subnet analysis, validator tracking, and network statistics
- **NFT Analytics Center**: Collection analysis, rarity tools, and portfolio tracking
- **Professional UI/UX**: Avalanche-branded design with dark/light theme support

## Data Storage
Tables: 
- `exxgha1ndt6o` (chat_conversations) - AI chat history and conversation management
- `exxghj9mvzls` (user_wallets) - Connected wallet addresses and metadata  
- `exxghrlzoa2o` (user_preferences) - User settings and dashboard configuration
- `exxgi37kp728` (saved_queries) - Saved blockchain analysis queries and templates

## Devv SDK Integration
Built-in: Authentication (email OTP), Database (NoSQL tables), DevvAI chat, Web Search, Web Reader, Email service
External: OpenRouter AI (multi-model access), ElevenLabs (voice synthesis and recognition)

## Special Requirements
**Phase 1 Complete**: Core infrastructure with auth, AI chat, voice features, and dashboard foundation
**Phase 2 Complete**: Real-time blockchain data integration, wallet management, transaction analysis, DeFi analytics
**Phase 3 Complete**: Smart contract interaction tools, market intelligence, subnet explorer, NFT analytics
**Next Phases**: Alert system, social features, data export, mobile optimization, performance enhancements

/src
├── components/
│   ├── ui/              # Pre-installed shadcn/ui components
│   ├── auth/            # Authentication components
│   │   ├── AuthForm.tsx # Email OTP login interface
│   │   └── ProtectedRoute.tsx # Route protection wrapper
│   ├── layout/          # Layout components
│   │   ├── DashboardLayout.tsx # Main app layout structure
│   │   ├── Sidebar.tsx  # Navigation sidebar with Avalanche branding
│   │   └── Header.tsx   # Top header with user menu and controls
│   ├── chat/            # AI Chat interface
│   │   └── ChatInterface.tsx # Complete chat UI with voice integration
│   ├── dashboard/       # Dashboard components
│   │   ├── DashboardOverview.tsx # Main dashboard with stats and metrics
│   │   ├── BlockchainDashboard.tsx # Real-time blockchain data and wallet management
│   │   ├── TransactionAnalyzer.tsx # Transaction history and gas analytics
│   │   └── DeFiAnalytics.tsx # DeFi positions and yield opportunities
│   ├── wallet/          # Advanced Wallet Analysis Tools
│   │   ├── WalletAnalysis.tsx # Comprehensive wallet analytics with multi-tab interface
│   │   ├── WalletComparison.tsx # Side-by-side wallet performance comparison
│   │   └── WalletScoring.tsx # Professional wallet scoring system with grades and recommendations
│   ├── contracts/       # Smart Contract Tools
│   │   └── ContractAnalyzer.tsx # Security scanner, gas analysis, and function simulator
│   ├── market/          # Market Intelligence Suite
│   │   ├── MarketIntelligence.tsx # Comprehensive market analytics dashboard with 8 tabs
│   │   ├── PriceAlerts.tsx # Real-time price alert system with notifications
│   │   └── MarketScreener.tsx # Advanced asset screening and filtering tools
│   ├── subnets/         # Subnet Explorer
│   │   └── SubnetExplorer.tsx # Subnet analysis, validator tracking, and network stats
│   └── nft/             # NFT Analytics
│       └── NFTAnalytics.tsx # NFT collection analysis, rarity tools, and portfolio tracking
│
├── store/               # Zustand state management
│   ├── auth-store.ts    # Authentication state and actions
│   ├── chat-store.ts    # AI chat conversations and streaming
│   ├── voice-store.ts   # Voice recording and synthesis
│   └── wallet-store.ts  # Blockchain data, wallets, and portfolio management
│
├── hooks/               # Custom React hooks
│   ├── use-mobile.ts    # Mobile detection
│   ├── use-toast.ts     # Toast notifications
│   └── use-initialize-stores.ts # App initialization with all stores
│
├── lib/                 # Utilities and services
│   ├── utils.ts         # Helper functions including cn for Tailwind
│   ├── avalanche.ts     # Avalanche blockchain integration with authentication-aware price services and reliable fallbacks
│   └── contracts.ts     # Smart contract analysis and security tools
│
├── pages/               # Route pages
│   ├── HomePage.tsx     # Main dashboard page with comprehensive tabs
│   ├── ChatPage.tsx     # Dedicated AI chat interface page  
│   ├── PortfolioPage.tsx # Complete portfolio analytics with wallet management and DeFi tracking
│   ├── WalletAnalysisPage.tsx # Advanced wallet analysis with scoring, comparison, and detailed insights
│   ├── MarketIntelligencePage.tsx # Complete market intelligence dashboard with 8-tab analytics suite
│   ├── PlaceholderPage.tsx # Generic placeholder for upcoming features
│   └── NotFoundPage.tsx # 404 error page
│
├── App.tsx              # Root component with routing
├── main.tsx            # Application entry point
└── index.css           # Design system with Avalanche theme colors