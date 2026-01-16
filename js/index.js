/**
 * Proxa UI
 * Main entry point for all JavaScript modules
 */

// Import and re-export all modules
import { drawSparkline, createSVGSparkline } from './sparkline.js';
import { renderWaterfall, formatValue } from './waterfall.js';
import { renderVarianceChart, calculateVariance } from './variance-chart.js';
import { initDropdowns, openDropdown, closeDropdown, closeAllDropdowns } from './dropdown.js';
import { openPanel, closePanel, initPanels, getActivePanel } from './slide-panel.js';
import { showToast, hideToast } from './toast.js';

export {
    // Sparkline
    drawSparkline,
    createSVGSparkline,
    // Waterfall
    renderWaterfall,
    formatValue,
    // Variance Chart
    renderVarianceChart,
    calculateVariance,
    // Dropdown
    initDropdowns,
    openDropdown,
    closeDropdown,
    closeAllDropdowns,
    // Slide Panel
    openPanel,
    closePanel,
    initPanels,
    getActivePanel,
    // Toast
    showToast,
    hideToast
};

/**
 * Initialize all Proxa interactive components
 */
export function init() {
    initDropdowns();
    initPanels();
}
