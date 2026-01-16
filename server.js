const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const PORT = 3000;

// Ensure upload directories exist
const uploadDirs = [
    'references/files',
    'references/files/presentations',
    'references/files/spreadsheets',
    'references/files/documents',
    'attachments'
];
uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Determine folder based on file type
        const ext = path.extname(file.originalname).toLowerCase();
        let folder = 'references/files';

        if (['.pptx', '.ppt', '.key'].includes(ext)) {
            folder = 'references/files/presentations';
        } else if (['.xlsx', '.xls', '.csv'].includes(ext)) {
            folder = 'references/files/spreadsheets';
        } else if (['.pdf'].includes(ext)) {
            folder = 'references/files/documents';
        }

        cb(null, folder);
    },
    filename: (req, file, cb) => {
        // Keep original filename
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter: (req, file, cb) => {
        const allowed = ['.pdf', '.xlsx', '.xls', '.csv', '.pptx', '.ppt', '.key', '.doc', '.docx'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowed.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('File type not allowed'));
        }
    }
});

// Serve static files
app.use(express.static('.'));
app.use(express.json());

// File upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileInfo = {
        name: req.file.originalname,
        path: req.file.path,
        size: formatFileSize(req.file.size),
        type: getFileType(req.file.originalname),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    res.json({ success: true, file: fileInfo });
});

// List files endpoint
app.get('/api/files', (req, res) => {
    const files = [];
    const baseDir = 'references/files';

    const scanDir = (dir, category) => {
        if (fs.existsSync(dir)) {
            fs.readdirSync(dir).forEach(file => {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);
                if (stat.isFile()) {
                    files.push({
                        name: file,
                        path: filePath,
                        size: formatFileSize(stat.size),
                        type: getFileType(file),
                        category: category,
                        date: stat.mtime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    });
                }
            });
        }
    };

    scanDir(path.join(baseDir, 'presentations'), 'presentations');
    scanDir(path.join(baseDir, 'spreadsheets'), 'spreadsheets');
    scanDir(path.join(baseDir, 'documents'), 'documents');

    res.json(files);
});

// Delete file endpoint
app.delete('/api/files/:filename', (req, res) => {
    const filename = decodeURIComponent(req.params.filename);
    const dirs = [
        'references/files/presentations',
        'references/files/spreadsheets',
        'references/files/documents'
    ];

    for (const dir of dirs) {
        const filePath = path.join(dir, filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return res.json({ success: true });
        }
    }

    res.status(404).json({ error: 'File not found' });
});

// ============================================================
// ATTACHMENTS API (for Record page)
// ============================================================

const attachmentStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'attachments'),
    filename: (req, file, cb) => cb(null, file.originalname)
});

const attachmentUpload = multer({
    storage: attachmentStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowed = ['.pdf', '.xlsx', '.xls', '.csv', '.png', '.jpg', '.jpeg', '.gif'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowed.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('File type not allowed'));
        }
    }
});

// Upload attachment
app.post('/api/attachments', attachmentUpload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileInfo = {
        name: req.file.originalname,
        path: req.file.path,
        size: formatFileSize(req.file.size),
        type: getFileType(req.file.originalname),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    res.json({ success: true, file: fileInfo });
});

// List attachments
app.get('/api/attachments', (req, res) => {
    const files = [];
    const dir = 'attachments';

    if (fs.existsSync(dir)) {
        fs.readdirSync(dir).forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isFile()) {
                files.push({
                    name: file,
                    path: filePath,
                    size: formatFileSize(stat.size),
                    type: getFileType(file),
                    date: stat.mtime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                });
            }
        });
    }

    res.json(files);
});

// Delete attachment
app.delete('/api/attachments/:filename', (req, res) => {
    const filename = decodeURIComponent(req.params.filename);
    const filePath = path.join('attachments', filename);

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return res.json({ success: true });
    }

    res.status(404).json({ error: 'File not found' });
});

// ============================================================
// AUDIT API
// ============================================================

app.get('/api/audit', async (req, res) => {
    try {
        const audit = await runAudit();
        res.json(audit);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/audit/run', async (req, res) => {
    try {
        const audit = await runAudit();
        // Regenerate the markdown report
        generateAuditReport(audit);
        res.json({ success: true, audit });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

async function runAudit() {
    const audit = {
        timestamp: new Date().toISOString(),
        summary: { total: 0, critical: 0, high: 0, medium: 0, low: 0 },
        categories: {}
    };

    // 1. Component inventory
    const cssElements = globFiles('css/elements/*.css');
    const cssComponents = globFiles('css/components/*.css');
    const cssPatterns = globFiles('css/patterns/*.css');
    const jsModules = globFiles('js/*.js').filter(f => !f.includes('index.js'));
    const testFiles = globFiles('tests/**/*.html');

    audit.categories.inventory = {
        elements: cssElements.length,
        components: cssComponents.length,
        patterns: cssPatterns.length,
        jsModules: jsModules.length,
        testFiles: testFiles.length,
        testCoverage: Math.round((testFiles.length / (cssElements.length + cssComponents.length)) * 100)
    };

    // 2. Check for hardcoded colors (should use tokens)
    const hardcodedColors = [];
    const cssFiles = [...cssElements, ...cssComponents, ...cssPatterns];
    const colorRegex = /#[0-9a-fA-F]{3,6}\b/g;
    const allowedColors = ['#fff', '#ffffff', '#000', '#000000', '#e0e0e0']; // common exceptions

    cssFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        const lines = content.split('\n');
        lines.forEach((line, i) => {
            const matches = line.match(colorRegex);
            if (matches) {
                matches.forEach(color => {
                    if (!allowedColors.includes(color.toLowerCase())) {
                        hardcodedColors.push({ file: file.replace(/^\.\//, ''), line: i + 1, color });
                    }
                });
            }
        });
    });

    audit.categories.hardcodedColors = {
        count: hardcodedColors.length,
        issues: hardcodedColors.slice(0, 20) // Limit to first 20
    };
    if (hardcodedColors.length > 0) {
        audit.summary.high += 1;
        audit.summary.total += 1;
    }

    // 3. Check for console.log statements
    const consoleLogs = [];
    const htmlFiles = globFiles('**/*.html').filter(f => !f.includes('node_modules'));
    const allJsFiles = globFiles('js/**/*.js');

    [...htmlFiles, ...allJsFiles].forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        const lines = content.split('\n');
        lines.forEach((line, i) => {
            if (line.includes('console.log')) {
                consoleLogs.push({ file: file.replace(/^\.\//, ''), line: i + 1 });
            }
        });
    });

    audit.categories.consoleLogs = {
        count: consoleLogs.length,
        issues: consoleLogs.slice(0, 10)
    };
    if (consoleLogs.length > 0) {
        audit.summary.low += 1;
        audit.summary.total += 1;
    }

    // 4. Check for missing responsive styles
    const missingResponsive = [];
    cssFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        if (!content.includes('@media')) {
            missingResponsive.push(file.replace(/^\.\//, ''));
        }
    });

    audit.categories.responsive = {
        missing: missingResponsive.length,
        files: missingResponsive
    };
    if (missingResponsive.length > 10) {
        audit.summary.medium += 1;
        audit.summary.total += 1;
    }

    // 5. Check report file
    const reportPath = 'AUDIT-REPORT.md';
    if (fs.existsSync(reportPath)) {
        const stat = fs.statSync(reportPath);
        audit.reportLastModified = stat.mtime.toISOString();
    }

    return audit;
}

function globFiles(pattern) {
    const glob = require('path');
    const results = [];

    // Simple glob implementation
    const parts = pattern.split('/');
    const searchDir = (dir, remaining) => {
        if (!fs.existsSync(dir)) return;

        if (remaining.length === 0) return;

        const part = remaining[0];
        const rest = remaining.slice(1);

        if (part === '**') {
            // Recursive search
            fs.readdirSync(dir).forEach(item => {
                const fullPath = path.join(dir, item);
                const stat = fs.statSync(fullPath);
                if (stat.isDirectory()) {
                    searchDir(fullPath, remaining); // Keep **
                    searchDir(fullPath, rest); // Move past **
                } else if (rest.length === 0 || matchGlob(item, rest[0])) {
                    if (rest.length <= 1) results.push(fullPath);
                }
            });
        } else if (part.includes('*')) {
            // Wildcard match
            fs.readdirSync(dir).forEach(item => {
                if (matchGlob(item, part)) {
                    const fullPath = path.join(dir, item);
                    const stat = fs.statSync(fullPath);
                    if (stat.isDirectory() && rest.length > 0) {
                        searchDir(fullPath, rest);
                    } else if (stat.isFile() && rest.length === 0) {
                        results.push(fullPath);
                    }
                }
            });
        } else {
            // Exact match
            const fullPath = path.join(dir, part);
            if (fs.existsSync(fullPath)) {
                const stat = fs.statSync(fullPath);
                if (stat.isDirectory()) {
                    searchDir(fullPath, rest);
                } else if (rest.length === 0) {
                    results.push(fullPath);
                }
            }
        }
    };

    searchDir('.', parts);
    return results;
}

function matchGlob(str, pattern) {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$');
    return regex.test(str);
}

function generateAuditReport(audit) {
    const report = `# Proxa UI Design System - Audit Report

**Generated:** ${new Date().toLocaleString()}
**Status:** Automated scan

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | ${audit.summary.critical} |
| High | ${audit.summary.high} |
| Medium | ${audit.summary.medium} |
| Low | ${audit.summary.low} |
| **Total** | **${audit.summary.total}** |

---

## Component Inventory

| Category | Count |
|----------|-------|
| Elements | ${audit.categories.inventory.elements} |
| Components | ${audit.categories.inventory.components} |
| Patterns | ${audit.categories.inventory.patterns} |
| JS Modules | ${audit.categories.inventory.jsModules} |
| Test Files | ${audit.categories.inventory.testFiles} |
| **Test Coverage** | **${audit.categories.inventory.testCoverage}%** |

---

## Hardcoded Colors

Found **${audit.categories.hardcodedColors.count}** hardcoded colors that should use design tokens.

${audit.categories.hardcodedColors.issues.map(i => `- \`${i.file}:${i.line}\` → \`${i.color}\``).join('\n')}
${audit.categories.hardcodedColors.count > 20 ? `\n*...and ${audit.categories.hardcodedColors.count - 20} more*` : ''}

---

## Console Statements

Found **${audit.categories.consoleLogs.count}** console.log statements.

${audit.categories.consoleLogs.issues.map(i => `- \`${i.file}:${i.line}\``).join('\n')}

---

## Missing Responsive Styles

**${audit.categories.responsive.missing}** CSS files have no \`@media\` queries:

${audit.categories.responsive.files.map(f => `- \`${f}\``).join('\n')}

---

*Run \`POST /api/audit/run\` to regenerate this report.*
`;

    fs.writeFileSync('AUDIT-REPORT.md', report);
}

// Helper functions
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function getFileType(filename) {
    const ext = path.extname(filename).toLowerCase();
    const types = {
        '.pdf': 'pdf',
        '.xlsx': 'xlsx',
        '.xls': 'xlsx',
        '.csv': 'csv',
        '.pptx': 'pptx',
        '.ppt': 'pptx',
        '.key': 'pptx',
        '.doc': 'doc',
        '.docx': 'doc'
    };
    return types[ext] || 'file';
}

// ============================================================
// AI BLOCKS API
// ============================================================

// Initialize Anthropic client (only if API key is available)
let anthropic = null;
if (process.env.ANTHROPIC_API_KEY) {
    anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

app.post('/api/ai/generate', async (req, res) => {
    if (!anthropic) {
        return res.status(503).json({
            success: false,
            error: 'AI not configured. Set ANTHROPIC_API_KEY environment variable.'
        });
    }

    const { prompt, context } = req.body;

    if (!prompt) {
        return res.status(400).json({ success: false, error: 'Prompt is required' });
    }

    try {
        const systemPrompt = buildAISystemPrompt(context || {});

        const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 4096,
            system: systemPrompt,
            messages: [{ role: 'user', content: prompt }]
        });

        res.json({
            success: true,
            suggestion: response.content[0].text
        });
    } catch (error) {
        console.error('AI generation error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'AI generation failed'
        });
    }
});

// Get file content for AI context
app.get('/api/ai/file-content/:filename', async (req, res) => {
    const filename = decodeURIComponent(req.params.filename);
    const dirs = [
        'references/files/spreadsheets',
        'references/files/documents',
        'references/files/presentations',
        'attachments'
    ];

    let filePath = null;
    for (const dir of dirs) {
        const testPath = path.join(dir, filename);
        if (fs.existsSync(testPath)) {
            filePath = testPath;
            break;
        }
    }

    if (!filePath) {
        return res.status(404).json({ error: 'File not found' });
    }

    const ext = path.extname(filename).toLowerCase();

    try {
        if (ext === '.csv') {
            const content = fs.readFileSync(filePath, 'utf8');
            res.json({ success: true, content, type: 'csv' });
        } else if (['.xlsx', '.xls'].includes(ext)) {
            // For XLSX, we'll read it and convert to CSV-like text
            const XLSX = require('xlsx');
            const workbook = XLSX.readFile(filePath);
            const sheets = {};
            workbook.SheetNames.forEach(name => {
                sheets[name] = XLSX.utils.sheet_to_csv(workbook.Sheets[name]);
            });
            res.json({ success: true, content: sheets, type: 'xlsx' });
        } else {
            // For other files, return basic info
            res.json({ success: true, content: `[Binary file: ${filename}]`, type: ext });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

function buildAISystemPrompt(context) {
    let prompt = `You are an AI assistant helping with data management in a business application called Proxa.

Your role is to help extract, transform, and format data based on user instructions.`;

    if (context.fieldType) {
        prompt += `\n\nYou are currently working on a field of type: ${context.fieldType}`;
    }

    if (context.fieldName) {
        prompt += `\nField name: ${context.fieldName}`;
    }

    if (context.attachments && context.attachments.length > 0) {
        prompt += `\n\n--- REFERENCE DATA ---\n`;
        context.attachments.forEach(att => {
            prompt += `\n=== ${att.name} ===\n${typeof att.content === 'object' ? JSON.stringify(att.content, null, 2) : att.content}\n`;
        });
        prompt += `\n--- END REFERENCE DATA ---`;
    }

    if (context.currentContent) {
        prompt += `\n\nCurrent field content:\n${JSON.stringify(context.currentContent, null, 2)}`;
    }

    prompt += `\n\nIMPORTANT INSTRUCTIONS:
1. Respond with ONLY the requested data/content
2. Format your response appropriately for the field type
3. For data tables, return valid JSON arrays
4. For text fields, return plain text or markdown
5. Do NOT include explanations unless specifically asked
6. Be precise and match the requested format exactly`;

    return prompt;
}

app.listen(PORT, () => {
    console.log(`
  ┌─────────────────────────────────────┐
  │                                     │
  │   Proxa Design System               │
  │   http://localhost:${PORT}             │
  │                                     │
  │   Ready for file uploads            │
  │                                     │
  └─────────────────────────────────────┘
`);
});
