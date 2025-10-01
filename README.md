# 🧘 Mindful Yoga App

A mobile-first React PWA for mindful yoga practice with voice coaching, progress tracking, and breathing exercises.

**Philosophy**: "Breathe First, Features Later" - Simple, calming yoga practice without overwhelm.

## ✨ Features

- **12 Yoga Poses** with detailed instructions, benefits, and modifications
- **Pre-built Sessions** (5, 10, 15 minute practices)
- **Custom Session Builder** for personalized sequences
- **Voice Coaching** with 3 personalities (Gentle, Motivational, Minimal)
- **Breathing Exercises** with visual guides (Box, 4-7-8, Energizing, Alternate Nostril)
- **Progress Tracking** with streak counter and analytics
- **Mood Tracking** (optional pre/post practice)
- **Practice Insights** dashboard with heatmap and statistics
- **PWA Support** for offline practice
- **Mobile-First Design** optimized for 375px+ screens

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

## 📦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run test:e2e     # Run Playwright E2E tests
```

## 🏗️ Tech Stack

- **React 18** + **Vite 5** - Fast, modern development
- **React Router v7** - Client-side routing
- **Zustand** - Lightweight state management with localStorage persistence
- **Tailwind CSS** - Utility-first styling with custom design system
- **Framer Motion** - Smooth animations
- **Web Speech API** - Voice coaching
- **PWA** - Offline support via vite-plugin-pwa
- **Playwright** - E2E testing

## 📱 Mobile-First Design

- **Baseline**: iPhone SE (375px width)
- **No horizontal scrolling**
- **Touch-optimized** interactions (44px minimum targets)
- **Safe area support** for iOS notch/home indicator
- **Fixed header/footer** with scrollable content

## 🎯 Status

**MVP Complete** - Ready for beta testing

- ✅ All core features implemented
- ✅ Mobile responsiveness validated
- ✅ Zero ESLint errors
- ✅ PWA with offline support
- ✅ Comprehensive analytics

## 📄 Documentation

- **CLAUDE.md** - Development guidance and architecture
- **PRD.md** - Complete product requirements

## 🧪 Testing

```bash
# Run E2E tests
npm run test:e2e

# Interactive test UI
npm run test:e2e:ui

# Debug tests
npm run test:e2e:debug

# View test report
npm run test:e2e:report
```

## 🤝 Contributing

This is a personal project for friends and family. Feel free to fork and adapt for your own use!

## 📝 License

Private project - All rights reserved

---

**Built with 💚 for mindful practice**
