# TaskFlow - Personal Productivity Todo Application

## Overview
TaskFlow is a client-side todo application built with vanilla HTML, CSS, and JavaScript. It requires no backend server and can run directly in any web browser.

## Features
- Age verification (must be over 10 years old)
- Three-stage task management: Todo, Completed, Archived
- Task creation, completion, archiving, and deletion with undo
- Unarchive functionality to restore archived tasks
- Local storage persistence
- Responsive design with smooth animations
- Professional dark theme with gradient styling

## Running the Application

### Option 1: Direct Browser Access
Simply open `index.html` in any modern web browser. No server required!

### Option 2: Local HTTP Server (Optional)
For development or if you prefer a local server:

**Using Python:**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Using Node.js:**
```bash
npx serve .
```

**Using any other static file server of your choice**

## File Structure
```
/
├── index.html          # Landing page with age verification
├── app.html           # Main todo application
├── script.js          # Age verification logic
├── app.js             # Main application logic
├── styles.css         # All styling and animations
└── README.md          # This file
```

## Dependencies
- **External**: FontAwesome 6.0.0 (loaded via CDN)
- **Browser APIs**: localStorage, Date API, DOM API
- **No Build Process**: Ready to run as-is

## Deployment
This application can be deployed to any static hosting service:
- GitHub Pages
- Netlify
- Vercel
- Surge.sh
- Any web hosting provider

Simply upload all files to your hosting service and the app will work immediately.

## Browser Compatibility
Works in all modern browsers that support:
- ES6+ JavaScript features
- CSS Grid and Flexbox
- Local Storage API
- CSS animations and transitions