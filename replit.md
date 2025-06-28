# TaskFlow Todo Application

## Overview

TaskFlow is a client-side todo application built with vanilla HTML, CSS, and JavaScript. It features age verification for user access and provides a comprehensive task management system with multiple task stages (todo, completed, archived). The application uses local storage for data persistence and includes a modern, responsive design with gradient backgrounds and professional styling.

## System Architecture

### Frontend Architecture
- **Technology Stack**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Architecture Pattern**: Pure client-side application with multiple HTML pages
- **State Management**: JavaScript classes with local state and localStorage persistence
- **Styling**: Custom CSS with gradient themes, FontAwesome icons, smooth animations, and responsive design
- **No Server Required**: Runs directly in browser, can be served as static files

### Key Design Decisions
- **Pure client-side**: Zero backend dependencies, runs in any modern browser
- **Static file deployment**: Can be hosted on any static hosting service (GitHub Pages, Netlify, etc.)
- **Local Storage**: Chosen for data persistence to avoid database complexity while maintaining user data between sessions
- **Class-based JavaScript**: Provides better code organization and encapsulation compared to procedural approach
- **Age verification**: Implements basic compliance for applications requiring minimum age requirements
- **Smooth animations**: Enhanced user experience with CSS transitions and JavaScript-driven animations

## Key Components

### 1. Landing Page (index.html)
- **Purpose**: Age verification and user onboarding
- **Features**: Form validation, date of birth verification, localStorage user creation, theme toggle
- **JavaScript Class**: `AgeVerification`

### 2. Main Application (app.html)
- **Purpose**: Core todo functionality
- **Features**: Task management, stage switching, user profile display, theme toggle
- **JavaScript Class**: `TaskFlowApp`

### 3. Styling System (styles.css)
- **Design**: Dual-theme system (dark/light mode) with modern gradient backgrounds
- **Theme System**: CSS variables for seamless theme switching with localStorage persistence
- **Responsive**: Mobile-first approach with comprehensive breakpoints (768px, 480px)
- **Icons**: FontAwesome integration for enhanced UI including animated lightbulb theme toggle

### 4. Theme System
- **Dark Mode**: Default gradient theme with purple/blue tones
- **Light Mode**: Clean light theme with subtle gradients
- **Toggle**: Animated lightbulb button in top-right corner of all pages
- **Persistence**: User preference saved in localStorage across sessions

## Data Flow

### User Authentication Flow
1. User accesses landing page (index.html)
2. Age verification form validates user input
3. User data stored in localStorage upon successful verification
4. Automatic redirect to main application
5. Main app checks localStorage for existing user session

### Task Management Flow
1. Tasks created through form input
2. Tasks stored in memory with localStorage backup
3. Tasks categorized into three stages: todo, completed, archived
4. Real-time counter updates for each stage
5. Stage switching updates UI without page reload

## External Dependencies

### CDN Resources
- **FontAwesome 6.0.0**: Icon library for UI enhancement including theme toggle bulb icon
- **Source**: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css`

### Browser APIs
- **localStorage**: For data persistence (user data, tasks, theme preference)
- **Date API**: For age verification calculations
- **DOM API**: For dynamic content manipulation
- **matchMedia API**: For detecting system dark/light mode preference

## Deployment Strategy

### Static Hosting
- **Compatibility**: Any static file hosting service (GitHub Pages, Netlify, Vercel)
- **Requirements**: Web server capable of serving HTML, CSS, and JavaScript files
- **No backend dependencies**: Eliminates need for server infrastructure

### File Structure
```
/
├── index.html (Landing page)
├── app.html (Main application)
├── script.js (Age verification logic)
├── app.js (Main application logic)
└── styles.css (Unified styling)
```

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 28, 2025. Initial setup
- June 28, 2025. Added delete functionality to all task sections with undo feature - replaced confirmation dialog with 5-second undo toast notification
- June 28, 2025. Added unarchive button to move tasks from archived back to todo section
- June 28, 2025. Implemented comprehensive smooth animations and transitions including: task entrance/exit animations, button hover effects with shadows, stage switching transitions, ripple effects on button clicks, and staggered section loading animations
- June 28, 2025. Enhanced unarchive functionality to restore tasks to their previous stage (todo or completed) instead of always going to todo
- June 28, 2025. Made task stage navigation sticky for better UX while scrolling
- June 28, 2025. Created animated splash screen with floating particles and loading animation that displays for 2.5 seconds before redirecting
- June 28, 2025. Redesigned entire visual theme with dynamic gradient backgrounds, floating animations, enhanced logos, improved task cards with backdrop blur effects, and modern glass-morphism styling
- June 28, 2025. Fixed splash screen to appear on every reload/navigation and properly redirect based on user authentication status
- June 28, 2025. Added dark/light mode toggle with animated lightbulb icon in top-right corner of all pages, localStorage persistence, and CSS variables for seamless theme switching
- June 28, 2025. Implemented comprehensive responsive design with mobile-first approach, optimized for all device sizes (desktop, tablet, mobile) with breakpoints at 768px and 480px