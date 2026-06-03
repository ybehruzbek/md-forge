/**
 * MD Forge — HTML Export
 * Creates standalone themed HTML files with page settings
 */

import { getExportThemeCSS } from './themes-inline.js';

// Border CSS for export
const BORDER_STYLES = {
  none: '',
  thin: `border: 1px solid #333; padding: 32px;`,
  thick: `border: 3px solid #1a1a1a; padding: 32px;`,
  double: `border: 4px double #333; padding: 32px;`,
  decorative: `border: 2px solid #007AFF; outline: 1px solid rgba(0, 122, 255, 0.3); outline-offset: 4px; padding: 32px; border-radius: 4px;`,
};

// Page dimensions for print CSS
const PAGE_SIZES = {
  a4: { width: '210mm', height: '297mm' },
  letter: { width: '8.5in', height: '11in' },
  legal: { width: '8.5in', height: '14in' },
  a3: { width: '297mm', height: '420mm' },
};

/**
 * Generate full standalone HTML document with page settings
 * @param {string} htmlContent - Converted HTML content
 * @param {string} theme - Theme name
 * @param {string} title - Document title
 * @param {Object} pageSettings - {pageSize, orientation, margins, border}
 * @returns {string} Full HTML document string
 */
export function generateHTML(htmlContent, theme = 'clean', title = 'Document', pageSettings = {}) {
  const themeCSS = getExportThemeCSS(theme);
  const {
    pageSize = 'a4',
    orientation = 'portrait',
    margins = { top: 15, right: 15, bottom: 15, left: 15 },
    border = 'none',
  } = pageSettings;

  const borderCSS = BORDER_STYLES[border] || '';
  const page = PAGE_SIZES[pageSize] || PAGE_SIZES.a4;
  const pageW = orientation === 'landscape' ? page.height : page.width;
  const pageH = orientation === 'landscape' ? page.width : page.height;

  return `<!DOCTYPE html>
<html lang="uz">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)}</title>
<style>
${themeCSS}

/* Page settings */
@page {
  size: ${pageW} ${pageH};
  margin: ${margins.top}mm ${margins.right}mm ${margins.bottom}mm ${margins.left}mm;
}

.page-frame {
  ${borderCSS}
}

.print-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #007AFF, #5856D6);
  color: white;
  padding: 10px 24px;
  display: flex;
  gap: 16px;
  align-items: center;
  z-index: 1000;
  font-family: -apple-system, sans-serif;
  font-size: 13px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.15);
}

.print-bar button {
  background: white;
  color: #007AFF;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  font-size: 13px;
  transition: transform 0.15s;
}

.print-bar button:hover {
  transform: scale(1.03);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.print-bar .info {
  opacity: 0.85;
  font-size: 12px;
}

@media print {
  .no-print { display: none !important; }
  .export-themed { padding: 0 !important; }
  .page-frame { border: ${border !== 'none' ? 'inherit' : 'none'}; padding: ${border !== 'none' ? '24px' : '0'}; }
}

@media screen {
  body { background: #f0f0f5; padding-top: 56px; }
  .page-frame {
    max-width: 800px;
    margin: 24px auto;
    background: white;
    box-shadow: 0 4px 24px rgba(0,0,0,0.1);
    border-radius: 8px;
  }
}
</style>
</head>
<body>
<div class="print-bar no-print">
  <button onclick="window.print()">📄 Chop etish / PDF saqlash</button>
  <span class="info">${escapeHtml(title)} · ${pageSize.toUpperCase()} · ${orientation === 'landscape' ? 'Gorizontal' : 'Vertikal'}</span>
</div>
<div class="page-frame">
  <article class="export-themed theme-${theme}">
  ${htmlContent}
  </article>
</div>
</body>
</html>`;
}

/**
 * Download HTML file
 * @param {string} html - Full HTML string
 * @param {string} filename - File name
 */
export function downloadHTML(html, filename) {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.replace(/\.md$/i, '.html');
  a.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
