/**
 * Proxa Sparkline
 * Lightweight sparkline renderer using Canvas
 */

export function drawSparkline(canvas, data, options = {}) {
    const {
        color = '#6b8f71',
        lineWidth = 2,
        showDot = true,
        dotRadius = 3,
        padding = 2
    } = options;

    if (!canvas || !data || data.length < 2) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    // Handle high DPI displays
    canvas.width = width * 2;
    canvas.height = height * 2;
    ctx.scale(2, 2);

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const stepX = (width - padding * 2) / (data.length - 1);

    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    data.forEach((val, i) => {
        const x = padding + i * stepX;
        const y = padding + (1 - (val - min) / range) * (height - padding * 2);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw end dot
    if (showDot) {
        const lastX = padding + (data.length - 1) * stepX;
        const lastY = padding + (1 - (data[data.length - 1] - min) / range) * (height - padding * 2);
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(lastX, lastY, dotRadius, 0, Math.PI * 2);
        ctx.fill();
    }
}

/**
 * Create an SVG sparkline element
 */
export function createSVGSparkline(data, options = {}) {
    const {
        width = 100,
        height = 32,
        color = '#6b8f71',
        fill = true,
        fillOpacity = 0.15
    } = options;

    if (!data || data.length < 2) return null;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    const gradientId = `sparkline-grad-${Math.random().toString(36).substr(2, 9)}`;

    let svg = `<svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">`;

    if (fill) {
        svg += `
            <defs>
                <linearGradient id="${gradientId}" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="${color}" stop-opacity="${fillOpacity}"/>
                    <stop offset="100%" stop-color="${color}" stop-opacity="0.02"/>
                </linearGradient>
            </defs>
            <path d="M0,${height - ((data[0] - min) / range) * height} ${points.split(' ').map((p, i) => `L${p}`).join(' ')} L${width},${height} L0,${height} Z" fill="url(#${gradientId})"/>
        `;
    }

    svg += `<polyline points="${points}" fill="none" stroke="${color}" stroke-width="1"/>`;
    svg += '</svg>';

    return svg;
}
