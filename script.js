// Landing page JavaScript for age verification
class AgeVerification {
    constructor() {
        this.form = document.getElementById('ageVerificationForm');
        this.nameInput = document.getElementById('fullName');
        this.dobInput = document.getElementById('dateOfBirth');
        this.nameError = document.getElementById('nameError');
        this.dobError = document.getElementById('dobError');
        this.messageContainer = document.getElementById('messageContainer');
        this.messageContent = document.getElementById('messageContent');
        
        this.initTheme();
        this.init();
    }
    
    initTheme() {
        // Initialize theme from localStorage or system preference
        const savedTheme = localStorage.getItem('taskflow_theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        
        document.documentElement.setAttribute('data-theme', theme);
        
        // Set up theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }
    
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('taskflow_theme', newTheme);
        
        // Add a little animation to the bulb
        const bulbIcon = document.querySelector('.bulb-icon');
        if (bulbIcon) {
            bulbIcon.style.transform = 'scale(1.3)';
            setTimeout(() => {
                bulbIcon.style.transform = '';
            }, 200);
        }
    }
    
    init() {
        // Check if we should show splash screen
        this.checkSplashScreen();
        
        // Check if user is already verified on page load
        this.checkExistingUser();
        
        // Add form submit event listener
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Add real-time validation
        this.nameInput.addEventListener('blur', () => this.validateName());
        this.dobInput.addEventListener('blur', () => this.validateAge());
        
        // Clear errors on input
        this.nameInput.addEventListener('input', () => this.clearError('name'));
        this.dobInput.addEventListener('input', () => this.clearError('dob'));
    }
    
    checkSplashScreen() {
        // Check if we came from splash screen or should show it
        const urlParams = new URLSearchParams(window.location.search);
        const fromSplash = urlParams.get('from') === 'splash';
        const lastSplash = localStorage.getItem('taskflow_last_splash');
        const now = Date.now();
        
        // Show splash if: not from splash AND (no previous splash OR more than 30 seconds ago)
        if (!fromSplash && (!lastSplash || now - parseInt(lastSplash) > 30000)) {
            localStorage.setItem('taskflow_last_splash', now.toString());
            window.location.href = 'splash.html';
            return;
        }
    }
    
    checkExistingUser() {
        try {
            const userData = localStorage.getItem('taskflow_user');
            if (userData) {
                const user = JSON.parse(userData);
                if (user.name && user.dateOfBirth && this.isValidAge(user.dateOfBirth)) {
                    // User is already verified, redirect to app
                    window.location.href = 'app.html';
                }
            }
        } catch (error) {
            console.error('Error checking existing user:', error);
            // Clear invalid data
            localStorage.removeItem('taskflow_user');
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        // Clear previous errors
        this.clearAllErrors();
        
        const name = this.nameInput.value.trim();
        const dateOfBirth = this.dobInput.value;
        
        let isValid = true;
        
        // Validate name
        if (!this.validateName()) {
            isValid = false;
        }
        
        // Validate age
        if (!this.validateAge()) {
            isValid = false;
        }
        
        if (isValid) {
            // Store user data and redirect
            this.storeUserData(name, dateOfBirth);
        }
    }
    
    validateName() {
        const name = this.nameInput.value.trim();
        
        if (!name) {
            this.showError('name', 'Full name is required');
            return false;
        }
        
        if (name.length < 2) {
            this.showError('name', 'Name must be at least 2 characters long');
            return false;
        }
        
        // Check for valid characters (letters, spaces, hyphens, apostrophes)
        const nameRegex = /^[a-zA-Z\s\-']+$/;
        if (!nameRegex.test(name)) {
            this.showError('name', 'Name can only contain letters, spaces, hyphens, and apostrophes');
            return false;
        }
        
        return true;
    }
    
    validateAge() {
        const dateOfBirth = this.dobInput.value;
        
        if (!dateOfBirth) {
            this.showError('dob', 'Date of birth is required');
            return false;
        }
        
        if (!this.isValidAge(dateOfBirth)) {
            this.showError('dob', 'You must be over 10 years old to access TaskFlow');
            return false;
        }
        
        return true;
    }
    
    isValidAge(dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        
        // Check if date is valid
        if (isNaN(birthDate.getTime())) {
            return false;
        }
        
        // Check if date is not in the future
        if (birthDate > today) {
            return false;
        }
        
        // Calculate age
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age > 10;
    }
    
    showError(field, message) {
        if (field === 'name') {
            this.nameError.textContent = message;
            this.nameError.classList.add('show');
            this.nameInput.style.borderColor = '#ef4444';
        } else if (field === 'dob') {
            this.dobError.textContent = message;
            this.dobError.classList.add('show');
            this.dobInput.style.borderColor = '#ef4444';
        }
    }
    
    clearError(field) {
        if (field === 'name') {
            this.nameError.classList.remove('show');
            this.nameInput.style.borderColor = '';
        } else if (field === 'dob') {
            this.dobError.classList.remove('show');
            this.dobInput.style.borderColor = '';
        }
    }
    
    clearAllErrors() {
        this.clearError('name');
        this.clearError('dob');
        this.hideMessage();
    }
    
    showMessage(message, type = 'success') {
        this.messageContent.textContent = message;
        this.messageContent.className = `message ${type}`;
        this.messageContainer.classList.remove('hidden');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.hideMessage();
        }, 5000);
    }
    
    hideMessage() {
        this.messageContainer.classList.add('hidden');
    }
    
    storeUserData(name, dateOfBirth) {
        try {
            const userData = {
                name: name,
                dateOfBirth: dateOfBirth,
                createdAt: new Date().toISOString(),
                verified: true
            };
            
            localStorage.setItem('taskflow_user', JSON.stringify(userData));
            
            // Show success message
            this.showMessage('Verification successful! Redirecting to your dashboard...', 'success');
            
            // Redirect after a short delay
            setTimeout(() => {
                window.location.href = 'app.html';
            }, 1500);
            
        } catch (error) {
            console.error('Error storing user data:', error);
            this.showMessage('An error occurred while saving your information. Please try again.', 'error');
        }
    }
}

// Initialize age verification when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AgeVerification();
});
