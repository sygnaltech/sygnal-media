# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production using Vite
- `npm run preview` - Preview production build
- `npm test` - Run tests with React Scripts test runner
- `npm start` - Alternative development mode with React Scripts

### Webflow Integration
- `npm run deploy` - Deploy components to Webflow library (`npx webflow library share --no-input`)

## Project Architecture

This is a **Webflow Component Library** built with React + TypeScript that creates reusable UI components for Webflow sites. The project uses a dual-file pattern for each component:

### Component Structure
Each component follows this pattern:
- `ComponentName.tsx` - Main React component implementation
- `ComponentName.webflow.tsx` - Webflow integration wrapper using `@webflow/react`

### Key Architecture Details

**Webflow Integration Pattern:**
- Components are declared using `declareComponent()` from `@webflow/react`
- Props are defined using the `@webflow/data-types` system for Webflow Designer integration
- Components support slots via `props.Slot()` for content insertion in Webflow

**Component Library Focus:**
- Built for Webflow's visual editor environment
- Components are designed to be configurable through Webflow's property panel
- Heavy use of slots for content flexibility within Webflow

**Key Libraries:**
- **Swiper.js** - For slider/carousel functionality
- **Masonry Layout** - For masonry grid layouts
- **@webflow/react** - Core Webflow component integration
- **React 19.1.1** with TypeScript

### Build System
- **Vite** for development and production builds (primary)
- **React Scripts** as fallback (legacy from CRA setup)
- Components are configured in `webflow.json` to match pattern `./src/**/*.webflow.@(js|jsx|mjs|ts|tsx)`

### Component Examples
- **Slider**: Swiper.js-based carousel with slot content support
- **Slider2**: Enhanced slider that loads Swiper.js as a script (not React version) and rebuilds slider elements externally around the slot, outside the shadow DOM. Uses RenderAdjacent component technique for locating correct component and slot.
- **Masonry**: Grid layout with configurable columns
- **Tabs**: Tab navigation system
- **FormFile**: File upload component
- **Marquee**: Scrolling text/content

All components are designed to work seamlessly within Webflow's visual editor while maintaining React component flexibility.