/**
 * Proxa Toast
 * Show notification toasts
 */

let toastTimeout = null;

export function showToast(message, options = {}) {
    const {
        duration = 3000,
        type = 'default' // 'default', 'success', 'error', 'warning'
    } = options;

    // Find or create toast element
    let toast = document.querySelector('.toast');

    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }

    // Clear any existing timeout
    if (toastTimeout) {
        clearTimeout(toastTimeout);
    }

    // Remove existing type classes
    toast.classList.remove('toast--success', 'toast--error', 'toast--warning');

    // Add type class if specified
    if (type !== 'default') {
        toast.classList.add(`toast--${type}`);
    }

    // Set message and show
    toast.textContent = message;
    toast.classList.add('show');

    // Auto-hide after duration
    if (duration > 0) {
        toastTimeout = setTimeout(() => {
            hideToast();
        }, duration);
    }
}

export function hideToast() {
    const toast = document.querySelector('.toast');
    if (toast) {
        toast.classList.remove('show');
    }
}
