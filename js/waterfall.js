/**
 * Proxa Waterfall Chart
 * Renders a financial waterfall (bridge) chart
 */

export function formatValue(val) {
    const abs = Math.abs(val);
    if (abs >= 1000000) return '$' + (abs / 1000000).toFixed(2) + 'M';
    if (abs >= 1000) return '$' + (abs / 1000).toFixed(0) + 'K';
    return '$' + abs.toFixed(0);
}

export function renderWaterfall(container, data, options = {}) {
    const {
        height = 340,
        maxValue = null
    } = options;

    if (!container || !data || data.length === 0) return;

    // Find max value for scale (use first total if not specified)
    const scaleMax = maxValue || data.find(d => d.type === 'total')?.value || Math.max(...data.map(d => Math.abs(d.value)));
    const scale = height / scaleMax;

    let runningTotal = 0;
    let html = '<div class="waterfall__axis"></div>';

    data.forEach((item, i) => {
        let barBottom, barHeight;

        if (item.type === 'total' || item.type === 'subtotal') {
            // Totals start from 0
            barBottom = 0;
            barHeight = item.value * scale;
            runningTotal = item.value;
        } else {
            // Changes
            const prevTotal = runningTotal;
            runningTotal += item.value;

            if (item.value < 0) {
                // Decrease: bar hangs from previous level
                barBottom = runningTotal * scale;
                barHeight = Math.abs(item.value) * scale;
            } else {
                // Increase: bar builds up from previous level
                barBottom = prevTotal * scale;
                barHeight = item.value * scale;
            }
        }

        const barClass = item.type === 'total' ? 'waterfall__bar--total' :
                         item.type === 'subtotal' ? 'waterfall__bar--subtotal' :
                         item.value < 0 ? 'waterfall__bar--decrease' : 'waterfall__bar--increase';

        html += `
            <div class="waterfall__bar-group">
                <div class="waterfall__bar-wrapper" style="bottom: ${barBottom}px">
                    <div class="waterfall__bar ${barClass}" style="height: ${barHeight}px">
                        <span class="waterfall__value">${formatValue(item.value)}</span>
                    </div>
                </div>
                <div class="waterfall__label">
                    <strong>${item.label}</strong>
                    ${item.sublabel || ''}
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}
