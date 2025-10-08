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
- **@webflow/react** - Core Webflow component integration
- **React 19.1.1** with TypeScript

### Build System
- **Vite** for development and production builds (primary)
- **React Scripts** as fallback (legacy from CRA setup)
- Components are configured in `webflow.json` to match pattern `./src/**/*.webflow.@(js|jsx|mjs|ts|tsx)`




## Webflow Code Components Properties

These are Webflow's supported Property types and docs for each. 

Never use description, use tooltip instead. 

- Text: https://developers.webflow.com/code-components/reference/prop-types/text.md
- Rich Text: https://developers.webflow.com/code-components/reference/prop-types/rich-text.md
- Text Node: https://developers.webflow.com/code-components/reference/prop-types/text-node.md
- Link: https://developers.webflow.com/code-components/reference/prop-types/link.md
- Image: https://developers.webflow.com/code-components/reference/prop-types/image.md
- Number: https://developers.webflow.com/code-components/reference/prop-types/number.md
- Boolean: https://developers.webflow.com/code-components/reference/prop-types/boolean.md
- Variant: https://developers.webflow.com/code-components/reference/prop-types/variant.md
- Visibility: https://developers.webflow.com/code-components/reference/prop-types/visibility.md
- Slot: https://developers.webflow.com/code-components/reference/prop-types/slot.md
- ID: https://developers.webflow.com/code-components/reference/prop-types/id.md


