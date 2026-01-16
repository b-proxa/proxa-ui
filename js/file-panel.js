/**
 * File Panel Utilities
 * Shared code for spreadsheet rendering and file panel functionality
 */

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function escapeAttr(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function getColumnLetter(index) {
    let letter = '';
    while (index >= 0) {
        letter = String.fromCharCode(65 + (index % 26)) + letter;
        index = Math.floor(index / 26) - 1;
    }
    return letter;
}

// ============================================================
// FILE COMMENTS PERSISTENCE
// ============================================================

function getFileComments(filename) {
    const stored = localStorage.getItem('fileComments');
    const all = stored ? JSON.parse(stored) : {};
    return all[filename] || [];
}

function saveFileComment(filename, text) {
    const stored = localStorage.getItem('fileComments');
    const all = stored ? JSON.parse(stored) : {};
    if (!all[filename]) all[filename] = [];
    all[filename].push({
        text: text,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    });
    localStorage.setItem('fileComments', JSON.stringify(all));
}

function deleteFileComment(filename, index) {
    const stored = localStorage.getItem('fileComments');
    const all = stored ? JSON.parse(stored) : {};
    if (all[filename] && all[filename][index]) {
        all[filename].splice(index, 1);
        localStorage.setItem('fileComments', JSON.stringify(all));
    }
}

// ============================================================
// FILE SETTINGS PERSISTENCE
// ============================================================

function getFileSettings(filename) {
    const stored = localStorage.getItem('fileSettings');
    const all = stored ? JSON.parse(stored) : {};
    return all[filename] || {};
}

function saveFileSetting(filename, key, value) {
    const stored = localStorage.getItem('fileSettings');
    const all = stored ? JSON.parse(stored) : {};
    if (!all[filename]) all[filename] = {};
    all[filename][key] = value;
    localStorage.setItem('fileSettings', JSON.stringify(all));
}

// ============================================================
// CONFIRM MODAL
// ============================================================

let confirmModalResolve = null;

function showConfirmModal(message, options = {}) {
    return new Promise((resolve) => {
        confirmModalResolve = resolve;
        const modal = document.getElementById('confirm-modal');
        const messageEl = document.getElementById('confirm-modal-message');
        const confirmBtn = document.getElementById('confirm-modal-confirm');

        messageEl.textContent = message;
        confirmBtn.textContent = options.confirmText || 'Delete';
        confirmBtn.className = 'btn btn--sm ' + (options.danger ? 'btn--danger' : 'btn--primary');

        modal.classList.add('open');
    });
}

function closeConfirmModal(result) {
    const modal = document.getElementById('confirm-modal');
    modal.classList.remove('open');
    if (confirmModalResolve) {
        confirmModalResolve(result);
        confirmModalResolve = null;
    }
}

// Export for use in modules (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        escapeHtml,
        escapeAttr,
        getColumnLetter,
        getFileComments,
        saveFileComment,
        deleteFileComment,
        getFileSettings,
        saveFileSetting,
        showConfirmModal,
        closeConfirmModal
    };
}
