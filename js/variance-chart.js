/**
 * Proxa Variance Chart
 * Renders year-over-year variance bars
 */

export function calculateVariance(current, prior) {
    if (prior === 0) return current > 0 ? 100 : -100;
    return ((current - prior) / Math.abs(prior)) * 100;
}

export function renderVarianceChart(container, data, options = {}) {
    const {
        maxPercent = 50
    } = options;

    if (!container || !data || data.length === 0) return;

    let html = '';

    data.forEach(item => {
        // Section divider
        if (item.section) {
            html += `<div class="variance-section-divider">${item.section}</div>`;
            return;
        }

        const variance = calculateVariance(item.current, item.prior);
        const clampedVariance = Math.max(-maxPercent, Math.min(maxPercent, variance));
        const barWidth = Math.abs(clampedVariance) / maxPercent * 50; // 50% of container width

        // Determine if favorable
        let isFavorable;
        if (item.favorable === 'up') {
            isFavorable = variance >= 0;
        } else {
            isFavorable = variance <= 0;
        }

        const barClass = variance >= 0 ? 'variance-row__bar--positive' : 'variance-row__bar--negative';
        const valueClass = isFavorable ? 'variance-row__value--positive' : 'variance-row__value--negative';
        const rowClass = item.highlight ? 'variance-row variance-row--highlight' : 'variance-row';

        const sign = variance >= 0 ? '+' : '';
        const displayVariance = sign + variance.toFixed(1) + '%';

        html += `
            <div class="${rowClass}">
                <div class="variance-row__label">${item.label}</div>
                <div class="variance-row__bar-container">
                    <div class="variance-row__zero-line"></div>
                    <div class="variance-row__bar ${barClass}" style="width: ${barWidth}%"></div>
                </div>
                <div class="variance-row__value ${valueClass}">${displayVariance}</div>
            </div>
        `;
    });

    container.innerHTML = html;
}
