/**
 * Proxa Slide Panel
 * Manage slide-over panel interactions
 */

let activePanel = null;

export function openPanel(panelId) {
    const panel = document.getElementById(panelId) || document.querySelector(`[data-panel="${panelId}"]`);
    const overlay = document.querySelector('.overlay');

    if (panel) {
        // Close any active panel first
        if (activePanel && activePanel !== panel) {
            activePanel.classList.remove('active');
        }

        panel.classList.add('active');
        activePanel = panel;

        if (overlay) {
            overlay.classList.add('active');
        }

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
}

export function closePanel() {
    const overlay = document.querySelector('.overlay');

    if (activePanel) {
        activePanel.classList.remove('active');
        activePanel = null;
    }

    if (overlay) {
        overlay.classList.remove('active');
    }

    // Restore body scroll
    document.body.style.overflow = '';
}

export function initPanels() {
    // Close panel when clicking overlay
    const overlay = document.querySelector('.overlay');
    if (overlay) {
        overlay.addEventListener('click', closePanel);
    }

    // Close panel when clicking close button
    document.querySelectorAll('.panel__close').forEach(btn => {
        btn.addEventListener('click', closePanel);
    });

    // Close panel on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && activePanel) {
            closePanel();
        }
    });
}

export function getActivePanel() {
    return activePanel;
}
