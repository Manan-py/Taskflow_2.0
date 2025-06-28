// Main todo application JavaScript

// Check splash screen immediately before DOM loads to prevent flash
(function() {
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
    
    // If we reach here, show the content
    document.addEventListener('DOMContentLoaded', function() {
        document.body.classList.add('show-content');
    });
})();

class TaskFlowApp {
    constructor() {
        this.currentStage = 'todo';
        this.tasks = {
            todo: [],
            completed: [],
            archived: []
        };
        
        this.user = null;
        this.initializeElements();
        this.init();
    }
    
    initializeElements() {
        // User elements
        this.userNameEl = document.getElementById('userName');
        this.userAvatarEl = document.getElementById('userAvatar');
        this.signOutBtn = document.getElementById('signOutBtn');
        
        // Stage elements
        this.todoTab = document.getElementById('todoTab');
        this.completedTab = document.getElementById('completedTab');
        this.archivedTab = document.getElementById('archivedTab');
        
        // Counters
        this.todoCount = document.getElementById('todoCount');
        this.completedCount = document.getElementById('completedCount');
        this.archivedCount = document.getElementById('archivedCount');
        
        // Task elements
        this.taskForm = document.getElementById('taskForm');
        this.taskInput = document.getElementById('taskInput');
        this.taskList = document.getElementById('taskList');
        
        // Toast container
        this.toastContainer = document.getElementById('toastContainer');
    }
    
    async init() {
        // Check authentication
        if (!this.checkAuthentication()) {
            window.location.href = 'index.html';
            return;
        }
        
        // Load user data
        this.loadUserData();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Load tasks from localStorage or fetch initial data
        await this.loadTasks();
        
        // Render initial view
        this.renderTasks();
        this.updateCounters();
    }
    

    checkAuthentication() {
        try {
            const userData = localStorage.getItem('taskflow_user');
            if (!userData) {
                return false;
            }
            
            const user = JSON.parse(userData);
            if (!user.name || !user.dateOfBirth || !user.verified) {
                return false;
            }
            
            // Verify age again
            const today = new Date();
            const birthDate = new Date(user.dateOfBirth);
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            if (age <= 10) {
                return false;
            }
            
            this.user = user;
            return true;
            
        } catch (error) {
            console.error('Authentication check failed:', error);
            return false;
        }
    }
    
    loadUserData() {
        if (this.user) {
            // Set username
            this.userNameEl.textContent = this.user.name;
            
            // Generate avatar using UI Avatars API
            const avatarUrl = `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${encodeURIComponent(this.user.name)}`;
            
            // Create avatar image
            const avatarImg = document.createElement('img');
            avatarImg.src = avatarUrl;
            avatarImg.alt = this.user.name;
            avatarImg.style.width = '100%';
            avatarImg.style.height = '100%';
            avatarImg.style.borderRadius = '50%';
            avatarImg.style.objectFit = 'cover';
            
            // Replace avatar content
            this.userAvatarEl.innerHTML = '';
            this.userAvatarEl.appendChild(avatarImg);
            
            // Fallback to initials if image fails
            avatarImg.onerror = () => {
                const initials = this.getInitials(this.user.name);
                this.userAvatarEl.innerHTML = `<span class="avatar-text">${initials}</span>`;
            };
        }
    }
    
    getInitials(name) {
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('');
    }
    
    setupEventListeners() {
        // Sign out button
        this.signOutBtn.addEventListener('click', () => this.signOut());
        
        // Stage tabs
        this.todoTab.addEventListener('click', () => this.setActiveStage('todo'));
        this.completedTab.addEventListener('click', () => this.setActiveStage('completed'));
        this.archivedTab.addEventListener('click', () => this.setActiveStage('archived'));
        
        // Task form
        this.taskForm.addEventListener('submit', (e) => this.handleTaskSubmit(e));
    }
    
    async loadTasks() {
        try {
            // Try to load from localStorage first
            const savedTasks = localStorage.getItem('taskflow_tasks');
            if (savedTasks) {
                this.tasks = JSON.parse(savedTasks);
                return;
            }
            
            // If no saved tasks, fetch initial data from API
            await this.fetchInitialTasks();
            
        } catch (error) {
            console.error('Error loading tasks:', error);
            this.showToast('Error loading tasks', 'error');
        }
    }
    
    async fetchInitialTasks() {
        try {
            const response = await fetch('https://dummyjson.com/todos');
            const data = await response.json();
            
            if (data.todos && Array.isArray(data.todos)) {
                // Transform API data to our task format
                this.tasks.todo = data.todos.slice(0, 10).map(todo => ({
                    id: this.generateId(),
                    title: todo.todo,
                    createdAt: new Date().toISOString(),
                    lastModified: new Date().toISOString(),
                    stage: 'todo'
                }));
                
                // Save to localStorage
                this.saveTasks();
                this.showToast('Initial tasks loaded successfully');
            }
        } catch (error) {
            console.error('Error fetching initial tasks:', error);
            // Create some default tasks if API fails
            this.createDefaultTasks();
        }
    }
    
    createDefaultTasks() {
        this.tasks.todo = [
            {
                id: this.generateId(),
                title: 'Welcome to TaskFlow! Add your first task above.',
                createdAt: new Date().toISOString(),
                lastModified: new Date().toISOString(),
                stage: 'todo'
            }
        ];
        this.saveTasks();
    }
    
    setActiveStage(stage) {
        this.currentStage = stage;
        
        // Update tab appearance
        document.querySelectorAll('.stage-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        if (stage === 'todo') {
            this.todoTab.classList.add('active');
        } else if (stage === 'completed') {
            this.completedTab.classList.add('active');
        } else if (stage === 'archived') {
            this.archivedTab.classList.add('active');
        }
        
        // Animate stage transition
        this.taskList.style.opacity = '0';
        this.taskList.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            // Re-render tasks
            this.renderTasks();
            
            // Animate in
            this.taskList.style.transition = 'all 0.3s ease';
            this.taskList.style.opacity = '1';
            this.taskList.style.transform = 'translateY(0)';
        }, 150);
    }
    
    handleTaskSubmit(e) {
        e.preventDefault();
        
        const taskTitle = this.taskInput.value.trim();
        if (!taskTitle) {
            this.showToast('Please enter a task description', 'error');
            return;
        }
        
        // Create new task
        const newTask = {
            id: this.generateId(),
            title: taskTitle,
            createdAt: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            stage: this.currentStage
        };
        
        // Add to current stage
        this.tasks[this.currentStage].push(newTask);
        
        // Clear input
        this.taskInput.value = '';
        
        // Save and re-render
        this.saveTasks();
        this.renderTasks();
        this.updateCounters();
        
        this.showToast('Task added successfully');
    }
    
    moveTask(taskId, fromStage, toStage) {
        // Find task
        const taskIndex = this.tasks[fromStage].findIndex(task => task.id === taskId);
        if (taskIndex === -1) {
            this.showToast('Task not found', 'error');
            return;
        }
        
        // Get task and update it
        const task = this.tasks[fromStage][taskIndex];
        
        // Store previous stage when archiving for unarchive functionality
        if (toStage === 'archived') {
            task.previousStage = fromStage;
        }
        
        task.stage = toStage;
        task.lastModified = new Date().toISOString();
        
        // Move task
        this.tasks[fromStage].splice(taskIndex, 1);
        this.tasks[toStage].push(task);
        
        // Save and re-render
        this.saveTasks();
        this.renderTasks();
        this.updateCounters();
        
        // Show notification based on action
        let message = '';
        if (toStage === 'completed') {
            message = 'Task moved to Completed';
        } else if (toStage === 'archived') {
            message = 'Task moved to Archived';
        } else if (toStage === 'todo') {
            message = 'Task moved to Todo';
        }
        
        this.showToast(message);
    }
    
    unarchiveTask(taskId) {
        // Find task in archived
        const taskIndex = this.tasks.archived.findIndex(task => task.id === taskId);
        if (taskIndex === -1) {
            this.showToast('Task not found', 'error');
            return;
        }
        
        const task = this.tasks.archived[taskIndex];
        const targetStage = task.previousStage || 'todo'; // Default to todo if no previous stage
        
        // Move task back to its previous stage
        task.stage = targetStage;
        task.lastModified = new Date().toISOString();
        
        this.tasks.archived.splice(taskIndex, 1);
        this.tasks[targetStage].push(task);
        
        // Save and re-render
        this.saveTasks();
        this.renderTasks();
        this.updateCounters();
        
        this.showToast(`Task restored to ${targetStage === 'todo' ? 'Todo' : 'Completed'}`);
    }
    
    deleteTask(taskId, fromStage) {
        // Find task
        const taskIndex = this.tasks[fromStage].findIndex(task => task.id === taskId);
        if (taskIndex === -1) {
            this.showToast('Task not found', 'error');
            return;
        }
        
        // Get the task before removing it
        const deletedTask = this.tasks[fromStage][taskIndex];
        
        // Find the task element and animate it out
        const taskElement = document.querySelector(`[data-task-id="${taskId}"]`)?.closest('.task-item');
        if (taskElement) {
            taskElement.style.animation = 'fadeOutDown 0.4s ease-in-out forwards';
            
            // Wait for animation to complete before removing from data
            setTimeout(() => {
                // Remove task
                this.tasks[fromStage].splice(taskIndex, 1);
                
                // Save and re-render
                this.saveTasks();
                this.renderTasks();
                this.updateCounters();
                
                // Show undo toast
                this.showUndoToast(deletedTask, fromStage);
            }, 400);
        } else {
            // Fallback if element not found
            this.tasks[fromStage].splice(taskIndex, 1);
            this.saveTasks();
            this.renderTasks();
            this.updateCounters();
            this.showUndoToast(deletedTask, fromStage);
        }
    }
    
    showUndoToast(deletedTask, fromStage) {
        // Create undo toast
        const toast = document.createElement('div');
        toast.className = 'toast undo-toast';
        
        const message = document.createElement('span');
        const truncatedTitle = deletedTask.title.length > 30 
            ? deletedTask.title.substring(0, 30) + '...' 
            : deletedTask.title;
        message.textContent = `Task "${truncatedTitle}" deleted`;
        
        const undoButton = document.createElement('button');
        undoButton.className = 'undo-btn';
        undoButton.innerHTML = '<i class="fas fa-undo"></i> Undo';
        undoButton.onclick = () => {
            this.undoDelete(deletedTask, fromStage);
            this.removeToast(toast);
        };
        
        toast.appendChild(message);
        toast.appendChild(undoButton);
        this.toastContainer.appendChild(toast);
        
        // Auto-remove after 5 seconds
        const timeoutId = setTimeout(() => {
            this.removeToast(toast);
        }, 5000);
        
        // Store timeout ID to clear it if undo is clicked
        toast.timeoutId = timeoutId;
    }
    
    undoDelete(deletedTask, originalStage) {
        // Restore the task to its original stage
        this.tasks[originalStage].push(deletedTask);
        
        // Save and re-render
        this.saveTasks();
        this.renderTasks();
        this.updateCounters();
        
        this.showToast('Task restored successfully');
    }
    
    removeToast(toast) {
        if (toast.timeoutId) {
            clearTimeout(toast.timeoutId);
        }
        
        if (toast.parentNode) {
            toast.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }
    }
    
    renderTasks() {
        const currentTasks = this.tasks[this.currentStage];
        
        if (currentTasks.length === 0) {
            this.renderEmptyState();
            return;
        }
        
        const tasksHTML = currentTasks
            .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified))
            .map(task => this.createTaskHTML(task))
            .join('');
        
        this.taskList.innerHTML = tasksHTML;
        
        // Add event listeners to task buttons
        this.attachTaskEventListeners();
    }
    
    renderEmptyState() {
        let message = '';
        let icon = '';
        
        if (this.currentStage === 'todo') {
            icon = 'fas fa-tasks';
            message = 'No tasks yet. Add your first task above!';
        } else if (this.currentStage === 'completed') {
            icon = 'fas fa-check-circle';
            message = 'No completed tasks yet. Complete some tasks to see them here.';
        } else if (this.currentStage === 'archived') {
            icon = 'fas fa-archive';
            message = 'No archived tasks yet. Archive completed tasks to organize them.';
        }
        
        this.taskList.innerHTML = `
            <div class="empty-state">
                <i class="${icon}"></i>
                <h3>No ${this.currentStage} tasks</h3>
                <p>${message}</p>
            </div>
        `;
    }
    
    createTaskHTML(task) {
        const timestamp = this.formatTimestamp(task.lastModified);
        let actionsHTML = '';
        
        // Generate action buttons based on current stage
        if (this.currentStage === 'todo') {
            actionsHTML = `
                <button class="task-btn btn-complete" data-task-id="${task.id}" data-action="complete">
                    <i class="fas fa-check"></i>
                    Mark as completed
                </button>
                <button class="task-btn btn-archive" data-task-id="${task.id}" data-action="archive">
                    <i class="fas fa-archive"></i>
                    Archive
                </button>
                <button class="task-btn btn-delete" data-task-id="${task.id}" data-action="delete">
                    <i class="fas fa-trash"></i>
                    Delete
                </button>
            `;
        } else if (this.currentStage === 'completed') {
            actionsHTML = `
                <button class="task-btn btn-archive" data-task-id="${task.id}" data-action="archive">
                    <i class="fas fa-archive"></i>
                    Archive
                </button>
                <button class="task-btn btn-delete" data-task-id="${task.id}" data-action="delete">
                    <i class="fas fa-trash"></i>
                    Delete
                </button>
            `;
        } else if (this.currentStage === 'archived') {
            actionsHTML = `
                <div class="archived-actions">
                    <button class="task-btn btn-unarchive" data-task-id="${task.id}" data-action="unarchive">
                        <i class="fas fa-undo"></i>
                        Unarchive
                    </button>
                    <button class="task-btn btn-delete" data-task-id="${task.id}" data-action="delete">
                        <i class="fas fa-trash"></i>
                        Delete
                    </button>
                </div>
            `;
        }
        
        return `
            <div class="task-item">
                <div class="task-content">
                    <div class="task-info">
                        <div class="task-title">${this.escapeHtml(task.title)}</div>
                    </div>
                </div>
                <div class="task-meta">
                    <div class="task-actions">
                        ${actionsHTML}
                    </div>
                    <div class="task-timestamp">
                        Last modified at:<br>
                        ${timestamp}
                    </div>
                </div>
            </div>
        `;
    }
    
    attachTaskEventListeners() {
        const actionButtons = this.taskList.querySelectorAll('.task-btn[data-action]');
        actionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const taskId = e.target.closest('.task-btn').dataset.taskId;
                const action = e.target.closest('.task-btn').dataset.action;
                
                if (action === 'complete') {
                    this.moveTask(taskId, 'todo', 'completed');
                } else if (action === 'archive') {
                    this.moveTask(taskId, this.currentStage, 'archived');
                } else if (action === 'unarchive') {
                    this.unarchiveTask(taskId);
                } else if (action === 'delete') {
                    this.deleteTask(taskId, this.currentStage);
                }
            });
        });
    }
    
    updateCounters() {
        this.todoCount.textContent = this.tasks.todo.length;
        this.completedCount.textContent = this.tasks.completed.length;
        this.archivedCount.textContent = this.tasks.archived.length;
    }
    
    saveTasks() {
        try {
            localStorage.setItem('taskflow_tasks', JSON.stringify(this.tasks));
        } catch (error) {
            console.error('Error saving tasks:', error);
            this.showToast('Error saving tasks', 'error');
        }
    }
    
    signOut() {
        if (confirm('Are you sure you want to sign out?')) {
            localStorage.removeItem('taskflow_user');
            localStorage.removeItem('taskflow_tasks');
            window.location.href = 'index.html';
        }
    }
    
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    formatTimestamp(isoString) {
        const date = new Date(isoString);
        return date.toLocaleString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        this.toastContainer.appendChild(toast);
        
        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TaskFlowApp();
});
