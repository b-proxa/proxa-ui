import { useState, useRef, useCallback, useEffect } from 'react';

const ASPECT_RATIOS = {
  '16:9': { width: 16, height: 9, label: 'Desktop', stack: false },
  '16:4': { width: 16, height: 4, label: 'Wide', stack: false },
  '4:3': { width: 4, height: 3, label: 'Tablet', stack: false },
  '9:16': { width: 9, height: 16, label: 'Mobile', stack: true },
};

const PRESET_LAYOUTS = [
  { 
    name: 'Title + 2 Columns', 
    regions: [
      { id: 'title', name: 'Title', row: 1, col: '1 / -1', color: '#4a6fa5', component: 'title', padding: 12 },
      { id: 'left', name: 'Description', row: 2, col: 1, color: '#6b8f71', component: 'markdown', padding: 12 },
      { id: 'right', name: 'Visualization', row: 2, col: 2, color: '#c9a227', component: 'chart', padding: 8 },
    ],
    rows: 'auto 1fr',
    cols: '35% 1fr',
    stackOrder: ['title', 'right', 'left']
  },
  { 
    name: 'Two Columns', 
    regions: [
      { id: 'left', name: 'Left', row: 1, col: 1, color: '#4a6fa5', component: 'markdown', padding: 12 },
      { id: 'right', name: 'Right', row: 1, col: 2, color: '#6b8f71', component: 'chart', padding: 8 },
    ],
    rows: '1fr',
    cols: '1fr 1fr',
    stackOrder: ['left', 'right']
  },
  { 
    name: 'Header + Body + Footer', 
    regions: [
      { id: 'header', name: 'Header', row: 1, col: '1 / -1', color: '#4a6fa5', component: 'title', padding: 12 },
      { id: 'body', name: 'Body', row: 2, col: '1 / -1', color: '#6b8f71', component: 'chart', padding: 8 },
      { id: 'footer', name: 'Footer', row: 3, col: '1 / -1', color: '#c9a227', component: 'markdown', padding: 12 },
    ],
    rows: 'auto 1fr auto',
    cols: '1fr',
    stackOrder: ['header', 'body', 'footer']
  },
  { 
    name: 'Sidebar + Content', 
    regions: [
      { id: 'sidebar', name: 'Sidebar', row: '1 / -1', col: 1, color: '#4a6fa5', component: 'markdown', padding: 12 },
      { id: 'content', name: 'Content', row: '1 / -1', col: 2, color: '#6b8f71', component: 'chart', padding: 8 },
    ],
    rows: '1fr',
    cols: '25% 1fr',
    stackOrder: ['content', 'sidebar']
  },
];

const COMPONENT_TYPES = [
  { id: 'title', name: 'Title' },
  { id: 'markdown', name: 'Markdown' },
  { id: 'chart', name: 'Chart' },
  { id: 'table', name: 'Table' },
  { id: 'image', name: 'Image' },
];

// Sample data
const SAMPLE_CHART_DATA = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    { label: 'Revenue', data: [1200, 1400, 1300, 1550, 1480, 1720], color: '#4a6fa5' },
    { label: 'Expenses', data: [850, 920, 880, 1020, 990, 1140], color: '#6b8f71' },
  ]
};

// Design system styles matching the Record
const styles = {
  fontFamily: 'system-ui, -apple-system, sans-serif',
  colors: {
    gray50: '#fafaf8', gray75: '#f8f8f6', gray100: '#f6f5f3',
    gray200: '#e7e5e4', gray300: '#d6d3d1', gray400: '#a8a29e',
    gray500: '#78716c', gray600: '#57534e', gray700: '#44403c',
    gray800: '#292524', gray900: '#1c1917',
    accent: '#4a6fa5',
  }
};

// Title Component
function TitleComponent({ compact, padding = 12 }) {
  return (
    <div style={{ 
      padding: `${padding}px`,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
      <div style={{ 
        fontSize: compact ? '9px' : '11px', 
        fontWeight: 500, 
        color: styles.colors.gray400,
        letterSpacing: '0.3px',
        marginBottom: '2px',
      }}>
        Fall 2025 Management Presentation
      </div>
      <h1 style={{ 
        margin: 0,
        fontSize: compact ? '14px' : '20px', 
        fontWeight: 600, 
        color: styles.colors.gray900,
        lineHeight: 1.2,
      }}>
        Financial Performance 2024
      </h1>
    </div>
  );
}

// Markdown Component
function MarkdownComponent({ compact, padding = 12 }) {
  return (
    <div style={{ 
      height: '100%',
      minHeight: 0,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <div style={{
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        padding: `${padding}px`,
        fontSize: compact ? '10px' : '13px',
        lineHeight: 1.5,
        color: styles.colors.gray700,
      }}>
        <h2 style={{ 
          fontSize: compact ? '11px' : '14px', 
          fontWeight: 600, 
          color: styles.colors.gray800,
          margin: '0 0 6px 0',
        }}>
          Key Highlights
        </h2>
        <p style={{ margin: '0 0 8px 0' }}>
          <strong>Revenue growth</strong> of 108% year-over-year demonstrates strong market position and validates our strategic investments in product development.
        </p>
        <p style={{ margin: '0 0 8px 0' }}>
          Our expansion into new markets contributed significantly to this growth, with the APAC region showing particularly strong adoption rates among enterprise customers.
        </p>
        
        <h3 style={{ 
          fontSize: compact ? '10px' : '13px', 
          fontWeight: 600, 
          margin: '12px 0 6px 0',
        }}>
          Trends
        </h3>
        <ul style={{ margin: '0 0 8px 0', paddingLeft: '16px' }}>
          <li style={{ marginBottom: '4px' }}>Consistent upward trajectory across all quarters</li>
          <li style={{ marginBottom: '4px' }}>Expenses scaling efficiently with revenue growth</li>
          <li style={{ marginBottom: '4px' }}>Profit margins expanding significantly in H2</li>
          <li style={{ marginBottom: '4px' }}>Customer acquisition costs decreased 15%</li>
        </ul>
        
        <h3 style={{ 
          fontSize: compact ? '10px' : '13px', 
          fontWeight: 600, 
          margin: '12px 0 6px 0',
        }}>
          Looking Ahead
        </h3>
        <p style={{ margin: '0 0 8px 0' }}>
          Q1 2025 projections indicate continued momentum with expected revenue growth of 25-30% quarter-over-quarter.
        </p>
        <p style={{ margin: '0 0 8px 0' }}>
          Key initiatives include launching our enterprise tier, expanding the sales team, and deepening partnerships with strategic technology providers.
        </p>
        <p style={{ margin: '0' }}>
          We remain focused on sustainable growth while maintaining operational efficiency and product excellence.
        </p>
      </div>
    </div>
  );
}

// Chart Component - follows responsive slide pattern
function ChartComponent({ compact, aspectRatio, padding = 8 }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  
  const drawChart = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
    // Get actual container dimensions
    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match container exactly (with 2x for retina)
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    
    const w = rect.width;
    const h = rect.height;
    
    // Dynamic padding - smaller when compact
    const padding = compact 
      ? { top: 8, right: 8, bottom: 18, left: 28 }
      : { top: 12, right: 12, bottom: 24, left: 36 };
    
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;
    
    // Don't draw if too small
    if (chartW < 20 || chartH < 20) return;
    
    // Clear
    ctx.clearRect(0, 0, w, h);
    
    // Grid lines
    ctx.strokeStyle = '#e7e5e4';
    ctx.lineWidth = 0.5;
    const gridLines = compact ? 3 : 4;
    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + (chartH / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();
    }
    
    // Data
    const allValues = SAMPLE_CHART_DATA.datasets.flatMap(d => d.data);
    const maxVal = Math.max(...allValues) * 1.1;
    const minVal = 0;
    
    SAMPLE_CHART_DATA.datasets.forEach((dataset) => {
      ctx.strokeStyle = dataset.color;
      ctx.lineWidth = compact ? 1 : 1.5;
      ctx.beginPath();
      
      dataset.data.forEach((val, i) => {
        const x = padding.left + (chartW / (dataset.data.length - 1)) * i;
        const y = padding.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      
      // Points - smaller when compact
      if (!compact || chartH > 60) {
        dataset.data.forEach((val, i) => {
          const x = padding.left + (chartW / (dataset.data.length - 1)) * i;
          const y = padding.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;
          ctx.fillStyle = dataset.color;
          ctx.beginPath();
          ctx.arc(x, y, compact ? 1.5 : 2.5, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    });
    
    // X labels - always visible
    ctx.fillStyle = styles.colors.gray500;
    ctx.font = `${compact ? 8 : 9}px system-ui`;
    ctx.textAlign = 'center';
    SAMPLE_CHART_DATA.labels.forEach((label, i) => {
      const x = padding.left + (chartW / (SAMPLE_CHART_DATA.labels.length - 1)) * i;
      ctx.fillText(label, x, h - 4);
    });
    
    // Y labels
    ctx.textAlign = 'right';
    ctx.font = `${compact ? 7 : 9}px system-ui`;
    for (let i = 0; i <= gridLines; i++) {
      const val = minVal + ((maxVal - minVal) / gridLines) * (gridLines - i);
      const y = padding.top + (chartH / gridLines) * i;
      ctx.fillText((val / 1000).toFixed(1) + 'k', padding.left - 3, y + 3);
    }
  }, [compact]);
  
  // Redraw on mount and when dependencies change
  useEffect(() => {
    drawChart();
  }, [drawChart, aspectRatio]);
  
  // ResizeObserver to redraw when container size changes
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const observer = new ResizeObserver(() => {
      requestAnimationFrame(drawChart);
    });
    observer.observe(container);
    
    return () => observer.disconnect();
  }, [drawChart]);
  
  return (
    <div style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      padding: `${padding}px`,
      minHeight: 0,
      overflow: 'hidden',
    }}>
      {/* Legend - fixed height, won't shrink */}
      <div style={{ 
        display: 'flex', 
        gap: compact ? '8px' : '12px', 
        marginBottom: compact ? '2px' : '4px',
        flexShrink: 0,
      }}>
        {SAMPLE_CHART_DATA.datasets.map(d => (
          <div key={d.label} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px',
            fontSize: compact ? '8px' : '10px',
            color: styles.colors.gray600,
          }}>
            <span style={{ 
              width: compact ? '8px' : '12px', 
              height: '2px', 
              background: d.color,
              borderRadius: '1px',
            }} />
            {d.label}
          </div>
        ))}
      </div>
      {/* Chart container - flexible, takes remaining space */}
      <div 
        ref={containerRef}
        style={{ 
          flex: 1,
          minHeight: 0,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <canvas 
          ref={canvasRef} 
          style={{ 
            position: 'absolute',
            inset: 0,
            width: '100%', 
            height: '100%',
          }} 
        />
      </div>
    </div>
  );
}

// Table Component
function TableComponent({ compact, padding = 8 }) {
  const data = [
    { month: 'Jan', revenue: 1200, expenses: 850 },
    { month: 'Feb', revenue: 1400, expenses: 920 },
    { month: 'Mar', revenue: 1300, expenses: 880 },
    { month: 'Apr', revenue: 1550, expenses: 1020 },
  ];
  
  return (
    <div style={{ 
      padding: `${padding}px`,
      overflow: 'auto',
      height: '100%',
    }}>
      <table style={{ 
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: compact ? '9px' : '11px',
      }}>
        <thead>
          <tr style={{ background: styles.colors.gray50 }}>
            <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600, borderBottom: `1px solid ${styles.colors.gray200}` }}>Month</th>
            <th style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 600, borderBottom: `1px solid ${styles.colors.gray200}` }}>Revenue</th>
            <th style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 600, borderBottom: `1px solid ${styles.colors.gray200}` }}>Expenses</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td style={{ padding: '6px 8px', borderBottom: `1px solid ${styles.colors.gray100}` }}>{row.month}</td>
              <td style={{ padding: '6px 8px', textAlign: 'right', borderBottom: `1px solid ${styles.colors.gray100}` }}>${row.revenue.toLocaleString()}</td>
              <td style={{ padding: '6px 8px', textAlign: 'right', borderBottom: `1px solid ${styles.colors.gray100}` }}>${row.expenses.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Image Component
function ImageComponent({ compact, padding = 12 }) {
  return (
    <div style={{ 
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: `${padding}px`,
    }}>
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px dashed ${styles.colors.gray300}`,
        borderRadius: '4px',
        color: styles.colors.gray400,
        fontSize: compact ? '10px' : '12px',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', marginBottom: '4px', opacity: 0.5 }}>⬜</div>
          Image
        </div>
      </div>
    </div>
  );
}

// Component renderer
function RegionContent({ component, compact, aspectRatio, padding = 12 }) {
  const p = compact ? Math.max(4, padding - 4) : padding;
  
  switch (component) {
    case 'title': return <TitleComponent compact={compact} padding={p} />;
    case 'markdown': return <MarkdownComponent compact={compact} padding={p} />;
    case 'chart': return <ChartComponent compact={compact} aspectRatio={aspectRatio} padding={p} />;
    case 'table': return <TableComponent compact={compact} padding={p} />;
    case 'image': return <ImageComponent compact={compact} padding={p} />;
    default: return null;
  }
}

// Layout mode - clean wireframe
function LayoutOverlay({ region, onPaddingChange }) {
  const padding = region.padding || 12;
  
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      padding: `${padding}px`,
      background: styles.colors.gray200,
    }}>
      {/* Content area - white with border */}
      <div style={{
        width: '100%',
        height: '100%',
        background: 'white',
        border: `1px solid ${styles.colors.gray300}`,
        borderRadius: '2px',
        position: 'relative',
      }}>
        {/* Region name - inside content area */}
        <span style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '11px',
          color: styles.colors.gray400,
        }}>
          {region.name}
        </span>
      </div>
      
      {/* Padding control - in the padding area, top right */}
      <select
        value={padding}
        onChange={(e) => {
          e.stopPropagation();
          onPaddingChange(region.id, parseInt(e.target.value));
        }}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          top: '4px',
          right: '4px',
          fontSize: '9px',
          padding: '2px 4px',
          border: `1px solid ${styles.colors.gray300}`,
          borderRadius: '3px',
          background: 'white',
          cursor: 'pointer',
          color: styles.colors.gray500,
        }}
      >
        <option value={0}>0px</option>
        <option value={4}>4px</option>
        <option value={8}>8px</option>
        <option value={12}>12px</option>
        <option value={16}>16px</option>
        <option value={24}>24px</option>
      </select>
    </div>
  );
}

export default function SlideLayoutBuilder() {
  const [layout, setLayout] = useState(PRESET_LAYOUTS[0]);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [mode, setMode] = useState('layout'); // 'layout' or 'content'
  const [colSplit, setColSplit] = useState(35);
  const containerRef = useRef(null);
  const isResizing = useRef(false);

  const currentAspect = ASPECT_RATIOS[aspectRatio];
  const shouldStack = currentAspect.stack;
  const isCompact = aspectRatio === '16:4' || aspectRatio === '9:16';

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    isResizing.current = true;
    
    const handleMouseMove = (e) => {
      if (!isResizing.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = Math.max(20, Math.min(80, ((e.clientX - rect.left) / rect.width) * 100));
      setColSplit(pct);
    };
    
    const handleMouseUp = () => {
      isResizing.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, []);

  const updateRegionComponent = (id, component) => {
    setLayout(prev => ({
      ...prev,
      regions: prev.regions.map(r => r.id === id ? { ...r, component } : r)
    }));
  };

  const updateRegionPadding = (id, padding) => {
    setLayout(prev => ({
      ...prev,
      regions: prev.regions.map(r => r.id === id ? { ...r, padding } : r)
    }));
  };

  const gridStyle = shouldStack 
    ? { display: 'flex', flexDirection: 'column', gap: '0px' }
    : {
        display: 'grid',
        gridTemplateRows: layout.rows,
        gridTemplateColumns: layout.cols.includes('%') 
          ? layout.cols.replace(/\d+%/, `${colSplit}%`)
          : layout.cols,
        gap: '0px',
      };

  // For mobile, don't constrain aspect ratio - let content flow
  const slideStyle = shouldStack
    ? {
        width: '300px',
        maxWidth: '300px',
        minHeight: '400px',
        height: 'auto',
      }
    : {
        aspectRatio: `${currentAspect.width} / ${currentAspect.height}`,
        width: '100%',
        maxWidth: '900px',
      };

  const hasResizableCol = layout.cols.includes('%') && !shouldStack;

  return (
    <div style={{ 
      fontFamily: styles.fontFamily, 
      padding: '16px',
      background: styles.colors.gray100,
      minHeight: '100vh',
    }}>
      {/* Controls */}
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        marginBottom: '16px',
        alignItems: 'center',
      }}>
        {/* Layout preset */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <label style={{ fontSize: '11px', color: styles.colors.gray500 }}>Layout</label>
          <select
            value={layout.name}
            onChange={(e) => {
              const preset = PRESET_LAYOUTS.find(p => p.name === e.target.value);
              if (preset) {
                setLayout(JSON.parse(JSON.stringify(preset)));
                setColSplit(35);
              }
            }}
            style={{
              padding: '6px 10px',
              fontSize: '11px',
              border: `1px solid ${styles.colors.gray300}`,
              borderRadius: '4px',
              background: 'white',
              color: styles.colors.gray700,
              cursor: 'pointer',
            }}
          >
            {PRESET_LAYOUTS.map((preset, i) => (
              <option key={i} value={preset.name}>{preset.name}</option>
            ))}
          </select>
        </div>

        {/* Aspect ratio */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <label style={{ fontSize: '11px', color: styles.colors.gray500 }}>Aspect</label>
          <select
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value)}
            style={{
              padding: '6px 10px',
              fontSize: '11px',
              border: `1px solid ${styles.colors.gray300}`,
              borderRadius: '4px',
              background: 'white',
              color: styles.colors.gray700,
              cursor: 'pointer',
            }}
          >
            {Object.entries(ASPECT_RATIOS).map(([ratio, config]) => (
              <option key={ratio} value={ratio}>{ratio} {config.label}</option>
            ))}
          </select>
        </div>

        {/* Mode */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <label style={{ fontSize: '11px', color: styles.colors.gray500 }}>View</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            style={{
              padding: '6px 10px',
              fontSize: '11px',
              border: `1px solid ${styles.colors.gray300}`,
              borderRadius: '4px',
              background: 'white',
              color: styles.colors.gray700,
              cursor: 'pointer',
            }}
          >
            <option value="layout">Layout</option>
            <option value="content">Content</option>
          </select>
        </div>

        {hasResizableCol && !shouldStack && (
          <span style={{ fontSize: '11px', color: styles.colors.gray400, marginLeft: 'auto' }}>
            Split: {Math.round(colSplit)}%
          </span>
        )}
      </div>

      {/* Slide Preview */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '24px',
        background: styles.colors.gray200,
        borderRadius: '8px',
      }}>
        <div
          ref={containerRef}
          style={{
            ...slideStyle,
            background: 'white',
            borderRadius: '6px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflow: shouldStack ? 'visible' : 'hidden',
            position: 'relative',
            ...gridStyle,
          }}
        >
          {shouldStack ? (
            layout.stackOrder.map((id) => {
              const region = layout.regions.find(r => r.id === id);
              if (!region) return null;
              // For mobile: title and description auto-size, chart gets fixed height
              const isChart = region.component === 'chart';
              const isTitle = region.component === 'title';
              
              return (
                <div
                  key={region.id}
                  style={{
                    flex: 'none',
                    minHeight: isChart ? '200px' : (isTitle ? 'auto' : 'auto'),
                    height: isChart ? '200px' : 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    borderBottom: `1px solid ${styles.colors.gray200}`,
                    position: 'relative',
                  }}
                >
                  {mode === 'layout' ? (
                    <LayoutOverlay 
                      region={region} 
                      onPaddingChange={updateRegionPadding}
                    />
                  ) : (
                    <RegionContent 
                      component={region.component} 
                      compact={isCompact} 
                      aspectRatio={aspectRatio}
                      padding={region.padding}
                    />
                  )}
                </div>
              );
            })
          ) : (
            <>
              {layout.regions.map((region) => {
                // Check if this is an auto-height row
                const rowIndex = typeof region.row === 'number' ? region.row - 1 : 0;
                const isAutoRow = layout.rows.split(' ')[rowIndex] === 'auto';
                
                return (
                <div
                  key={region.id}
                  style={{
                    gridRow: region.row,
                    gridColumn: region.col,
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: mode === 'layout' && isAutoRow ? '60px' : 0,
                    minWidth: 0,
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  {mode === 'layout' ? (
                    <LayoutOverlay 
                      region={region} 
                      onComponentChange={updateRegionComponent}
                      onPaddingChange={updateRegionPadding}
                    />
                  ) : (
                    <RegionContent 
                      component={region.component} 
                      compact={isCompact}
                      aspectRatio={aspectRatio}
                      padding={region.padding}
                    />
                  )}
                </div>
              )})}
              
              {hasResizableCol && mode === 'content' && (
                <div
                  onMouseDown={handleMouseDown}
                  style={{
                    position: 'absolute',
                    left: `${colSplit}%`,
                    top: 0,
                    bottom: 0,
                    width: '8px',
                    marginLeft: '-4px',
                    cursor: 'col-resize',
                    background: 'transparent',
                    zIndex: 10,
                  }}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
