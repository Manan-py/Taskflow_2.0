# TaskFlow Todo Application

## Overview

TaskFlow is a client-side todo application built with vanilla HTML, CSS, and JavaScript. It features age verification for user access and provides a comprehensive task management system with multiple task stages (todo, completed, archived). The application uses local storage for data persistence and includes a modern, responsive design with gradient backgrounds and professional styling.

## System Architecture

### Frontend Architecture
- **Technology Stack**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Architecture Pattern**: Single Page Application (SPA) with multiple HTML pages
- **State Management**: JavaScript classes with local state and localStorage persistence
- **Styling**: Custom CSS with gradient themes, FontAwesome icons, and responsive design

### Key Design Decisions
- **Client-side only**: No backend required, making deployment simple and reducing infrastructure needs
- **Local Storage**: Chosen for data persistence to avoid database complexity while maintaining user data between sessions
- **Class-based JavaScript**: Provides better code organization and encapsulation compared to procedural approach
- **Age verification**: Implements basic compliance for applications requiring minimum age requirements

## Key Components

### 1. Landing Page (index.html)
- **Purpose**: Age verification and user onboarding
- **Features**: Form validation, date of birth verification, localStorage user creation
- **JavaScript Class**: `AgeVerification`

### 2. Main Application (app.html)
- **Purpose**: Core todo functionality
- **Features**: Task management, stage switching, user profile display
- **JavaScript Class**: `TaskFlowApp`

### 3. Styling System (styles.css)
- **Design**: Modern gradient-based theme with professional appearance
- **Responsive**: Mobile-first approach with flexible layouts
- **Icons**: FontAwesome integration for enhanced UI

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
- **FontAwesome 6.0.0**: Icon library for UI enhancement
- **Source**: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css`

### Browser APIs
- **localStorage**: For data persistence across sessions
- **Date API**: For age verification calculations
- **DOM API**: For dynamic content manipulation

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
- June 28, 2025. Added delete functionality to all task sections with confirmation dialog and red styling