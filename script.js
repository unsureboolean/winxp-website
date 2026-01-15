// Windows XP Website JavaScript

// Tips of the Day
const TIPS_OF_THE_DAY = [
    "Pro tip: Don't forget to save your work. Or your sanity.",
    "Ctrl+Alt+Snacks increases productivity by 42%.",
    "Jeff.exe runs best on caffeine.",
    "Have you tried turning it off and on again?",
    "The best code is the code that works... eventually.",
    "Coffee: because murder is illegal.",
    "I'm not arguing, I'm just explaining why I'm right.",
    "Debugging: like being a detective in a crime drama, except the crime is against you.",
    "It works on my machine. Ship it!",
    "I would tell you a programming joke, but you wouldn't get it.",
    "Why do programmers prefer dark mode? Because light attracts bugs!",
    "There are 10 types of people: those who understand binary and those who don't."
];

// Shower Thoughts
const SHOWER_THOUGHTS = [
    "If you think you're too small to make a difference, try sleeping in a room with a mosquito.",
    "Why do we park in driveways and drive on parkways?",
    "I'm not lazy, I'm just on energy-saving mode.",
    "Parallel lines have so much in common. It's a shame they'll never meet.",
    "I told my computer I needed a break, and now it won't stop sending me Kit-Kat ads.",
    "The best time to plant a tree was 20 years ago. The second best time is now.",
    "I'm reading a book about anti-gravity. It's impossible to put down.",
    "Why is abbreviation such a long word?",
    "I used to hate facial hair, but then it grew on me.",
    "What's the difference between a poorly dressed man on a bicycle and a well-dressed man on a tricycle? Attire.",
    "I'm on a seafood diet. I see food and I eat it.",
    "Time flies like an arrow. Fruit flies like a banana."
];

class WindowsXPDesktop {
    constructor() {
        this.activeWindow = null;
        this.windowZIndex = 100;
        this.isStartMenuOpen = false;
        this.soundEnabled = false;
        this.currentTipIndex = 0;
        this.currentThoughtIndex = 0;
        this.tipShownThisSession = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateClock();
        this.positionWindows();
        this.showTipOfTheDay();
        
        // Update clock every second
        setInterval(() => this.updateClock(), 1000);
    }

    setupEventListeners() {
        // Start button
        const startButton = document.getElementById('start-button');
        const startMenu = document.getElementById('start-menu');
        
        startButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleStartMenu();
        });

        // Desktop icons
        document.querySelectorAll('.desktop-icon').forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectDesktopIcon(icon);
            });
            
            icon.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                const windowId = icon.getAttribute('data-window');
                this.openWindow(windowId);
                this.playSound('open');
            });
        });

        // Start menu items
        document.querySelectorAll('.start-menu-item[data-window]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const windowId = item.getAttribute('data-window');
                this.openWindow(windowId);
                this.closeStartMenu();
                this.playSound('open');
            });
        });

        // Window controls
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const window = btn.closest('.window');
                this.closeWindow(window);
                this.playSound('close');
            });
        });

        document.querySelectorAll('.minimize-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const window = btn.closest('.window');
                this.minimizeWindow(window);
            });
        });

        document.querySelectorAll('.maximize-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const window = btn.closest('.window');
                this.toggleMaximizeWindow(window);
            });
        });

        // Window dragging
        document.querySelectorAll('.window-header').forEach(header => {
            this.makeDraggable(header.parentElement, header);
        });

        // Click outside to close start menu and deselect icons
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.start-menu') && !e.target.closest('.start-button')) {
                this.closeStartMenu();
            }
            
            if (!e.target.closest('.desktop-icon')) {
                this.deselectAllIcons();
            }
        });

        // Window focus
        document.querySelectorAll('.window').forEach(window => {
            window.addEventListener('mousedown', () => {
                this.focusWindow(window);
            });
        });

        // Tip of the Day controls
        const closeTipBtn = document.getElementById('close-tip-btn');
        const nextTipBtn = document.getElementById('next-tip-btn');
        
        if (closeTipBtn) {
            closeTipBtn.addEventListener('click', () => {
                this.closeTipOfTheDay();
            });
        }
        
        if (nextTipBtn) {
            nextTipBtn.addEventListener('click', () => {
                this.showNextTip();
            });
        }

        // Shower Thoughts
        const nextThoughtBtn = document.getElementById('next-thought-btn');
        if (nextThoughtBtn) {
            nextThoughtBtn.addEventListener('click', () => {
                this.showNextThought();
            });
        }

        // Sound toggle
        const soundToggle = document.getElementById('sound-toggle');
        if (soundToggle) {
            soundToggle.addEventListener('click', () => {
                this.toggleSound();
            });
        }
    }

    updateClock() {
        const clock = document.getElementById('clock');
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
        clock.textContent = timeString;
    }

    toggleStartMenu() {
        const startMenu = document.getElementById('start-menu');
        const startButton = document.getElementById('start-button');
        
        if (this.isStartMenuOpen) {
            this.closeStartMenu();
        } else {
            this.openStartMenu();
        }
    }

    openStartMenu() {
        const startMenu = document.getElementById('start-menu');
        const startButton = document.getElementById('start-button');
        
        startMenu.style.display = 'block';
        startButton.classList.add('active');
        this.isStartMenuOpen = true;
    }

    closeStartMenu() {
        const startMenu = document.getElementById('start-menu');
        const startButton = document.getElementById('start-button');
        
        startMenu.style.display = 'none';
        startButton.classList.remove('active');
        this.isStartMenuOpen = false;
    }

    selectDesktopIcon(icon) {
        this.deselectAllIcons();
        icon.classList.add('selected');
    }

    deselectAllIcons() {
        document.querySelectorAll('.desktop-icon').forEach(icon => {
            icon.classList.remove('selected');
        });
    }

    openWindow(windowId) {
        const window = document.getElementById(windowId + '-window');
        if (!window) return;

        window.style.display = 'block';
        this.focusWindow(window);
        
        // Position window if it's the first time opening
        if (!window.hasAttribute('data-positioned')) {
            this.positionWindow(window);
            window.setAttribute('data-positioned', 'true');
        }
    }

    closeWindow(window) {
        window.style.display = 'none';
        window.classList.remove('maximized');
        
        // Focus another window if available
        const visibleWindows = document.querySelectorAll('.window[style*="display: block"]');
        if (visibleWindows.length > 0) {
            this.focusWindow(visibleWindows[visibleWindows.length - 1]);
        }
    }

    minimizeWindow(window) {
        window.style.display = 'none';
        
        // Focus another window if available
        const visibleWindows = document.querySelectorAll('.window[style*="display: block"]');
        if (visibleWindows.length > 0) {
            this.focusWindow(visibleWindows[visibleWindows.length - 1]);
        }
    }

    toggleMaximizeWindow(window) {
        if (window.classList.contains('maximized')) {
            window.classList.remove('maximized');
            // Restore previous position and size
            if (window.hasAttribute('data-prev-style')) {
                const prevStyle = window.getAttribute('data-prev-style');
                window.style.cssText = prevStyle;
            }
        } else {
            // Save current position and size
            window.setAttribute('data-prev-style', window.style.cssText);
            window.classList.add('maximized');
        }
    }

    focusWindow(window) {
        // Remove active state from all windows
        document.querySelectorAll('.window').forEach(w => {
            w.classList.add('inactive');
            w.style.zIndex = 100;
        });
        
        // Set active window
        window.classList.remove('inactive');
        window.style.zIndex = ++this.windowZIndex;
        this.activeWindow = window;
    }

    positionWindows() {
        const windows = document.querySelectorAll('.window');
        let offsetX = 50;
        let offsetY = 50;
        
        windows.forEach((window, index) => {
            this.positionWindow(window, offsetX + (index * 30), offsetY + (index * 30));
        });
    }

    positionWindow(window, x = null, y = null) {
        const rect = window.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width - 20;
        const maxY = window.innerHeight - rect.height - 60; // Account for taskbar
        
        if (x === null) x = Math.max(20, Math.min(maxX, Math.random() * 200 + 50));
        if (y === null) y = Math.max(20, Math.min(maxY, Math.random() * 100 + 50));
        
        window.style.left = x + 'px';
        window.style.top = y + 'px';
    }

    makeDraggable(element, handle) {
        let isDragging = false;
        let startX, startY, startLeft, startTop;

        handle.addEventListener('mousedown', (e) => {
            if (element.classList.contains('maximized')) return;
            
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = parseInt(element.style.left) || 0;
            startTop = parseInt(element.style.top) || 0;
            
            this.focusWindow(element);
            
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            let newLeft = startLeft + deltaX;
            let newTop = startTop + deltaY;
            
            // Constrain to viewport
            newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - element.offsetWidth));
            newTop = Math.max(0, Math.min(newTop, window.innerHeight - element.offsetHeight - 40));
            
            element.style.left = newLeft + 'px';
            element.style.top = newTop + 'px';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    // Tip of the Day
    showTipOfTheDay() {
        if (this.tipShownThisSession) return;
        
        this.tipShownThisSession = true;
        const tipModal = document.getElementById('tip-modal');
        if (tipModal) {
            tipModal.style.display = 'flex';
            this.displayTip();
        }
    }

    displayTip() {
        const tipText = document.getElementById('tip-text');
        if (tipText) {
            tipText.textContent = TIPS_OF_THE_DAY[this.currentTipIndex];
        }
    }

    showNextTip() {
        this.currentTipIndex = (this.currentTipIndex + 1) % TIPS_OF_THE_DAY.length;
        this.displayTip();
    }

    closeTipOfTheDay() {
        const tipModal = document.getElementById('tip-modal');
        if (tipModal) {
            tipModal.style.display = 'none';
        }
    }

    // Shower Thoughts
    showNextThought() {
        this.currentThoughtIndex = (this.currentThoughtIndex + 1) % SHOWER_THOUGHTS.length;
        const thoughtText = document.getElementById('shower-thought-text');
        if (thoughtText) {
            thoughtText.textContent = SHOWER_THOUGHTS[this.currentThoughtIndex];
        }
    }

    // Initialize shower thoughts on window open
    initializeShowerThoughts() {
        const thoughtText = document.getElementById('shower-thought-text');
        if (thoughtText && thoughtText.textContent === '') {
            this.currentThoughtIndex = Math.floor(Math.random() * SHOWER_THOUGHTS.length);
            thoughtText.textContent = SHOWER_THOUGHTS[this.currentThoughtIndex];
        }
    }

    // Sound Effects
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const soundToggle = document.getElementById('sound-toggle');
        if (soundToggle) {
            if (this.soundEnabled) {
                soundToggle.classList.remove('muted');
            } else {
                soundToggle.classList.add('muted');
            }
        }
    }

    playSound(type) {
        if (!this.soundEnabled) return;

        // Create audio context and play simple beeps
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        switch (type) {
            case 'open':
                // Window open sound - ascending beep
                oscillator.frequency.value = 800;
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.1);
                break;
            case 'close':
                // Window close sound - descending beep
                oscillator.frequency.value = 600;
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.1);
                break;
            case 'error':
                // Error sound - low beep
                oscillator.frequency.value = 400;
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.2);
                break;
        }
    }
}

// Initialize the desktop when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const desktop = new WindowsXPDesktop();
    
    // Initialize shower thoughts when the window opens
    const showerThoughtsWindow = document.getElementById('shower-thoughts-window');
    if (showerThoughtsWindow) {
        const originalOpenWindow = desktop.openWindow.bind(desktop);
        desktop.openWindow = function(windowId) {
            originalOpenWindow(windowId);
            if (windowId === 'shower-thoughts') {
                desktop.initializeShowerThoughts();
            }
        };
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    // Reposition windows that are out of bounds
    document.querySelectorAll('.window').forEach(window => {
        if (window.style.display !== 'none' && !window.classList.contains('maximized')) {
            const rect = window.getBoundingClientRect();
            let left = parseInt(window.style.left) || 0;
            let top = parseInt(window.style.top) || 0;
            
            // Adjust if window is out of bounds
            if (left + rect.width > window.innerWidth) {
                left = Math.max(0, window.innerWidth - rect.width - 20);
                window.style.left = left + 'px';
            }
            
            if (top + rect.height > window.innerHeight - 40) {
                top = Math.max(0, window.innerHeight - rect.height - 60);
                window.style.top = top + 'px';
            }
        }
    });
});
