/**
 * MD Forge — PDF Export
 * html2pdf.js wrapper with page settings (size, orientation, margins, borders)
 */

// Page size dimensions in mm
const PAGE_SIZES = {
  a4: [210, 297],
  letter: [216, 279],
  legal: [216, 356],
  a3: [297, 420],
};

// Border CSS generators
const BORDER_STYLES = {
  none: '',
  thin: `border: 1px solid #333;`,
  thick: `border: 3px solid #1a1a1a;`,
  double: `border: 4px double #333;`,
  decorative: `
    border: 2px solid #007AFF;
    outline: 1px solid rgba(0, 122, 255, 0.3);
    outline-offset: 4px;
  `,
};

/**
 * Export HTML content to PDF with page settings
 * @param {string} htmlContent - Rendered HTML
 * @param {string} themeCSS - Inline theme CSS
 * @param {string} filename - Output filename
 * @param {string} theme - Theme name
 * @param {Object} pageSettings - {pageSize, orientation, margins, border}
 */
export async function exportPDF(htmlContent, themeCSS, filename, theme = 'clean', pageSettings = {}) {
  const html2pdf = (await import('html2pdf.js')).default;

  const {
    pageSize = 'a4',
    orientation = 'portrait',
    margins = { top: 15, right: 15, bottom: 15, left: 15 },
    border = 'none',
  } = pageSettings;

  const borderCSS = BORDER_STYLES[border] || '';
  const borderPadding = border !== 'none' ? 'padding: 24px;' : '';

  // Create container
  const container = document.createElement('div');
  container.innerHTML = `
    <style>
      ${themeCSS}
      .pdf-border-frame {
        ${borderCSS}
        ${borderPadding}
        border-radius: ${border === 'decorative' ? '4px' : '0'};
        min-height: 100%;
      }
    </style>
    <div class="pdf-border-frame">
      <article class="export-themed theme-${theme}">
        ${htmlContent}
      </article>
    </div>
  `;

  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';

  const [w] = PAGE_SIZES[pageSize] || PAGE_SIZES.a4;
  container.style.width = `${orientation === 'landscape' ? PAGE_SIZES[pageSize][1] : w}mm`;
  document.body.appendChild(container);

  const options = {
    margin: [margins.top, margins.right, margins.bottom, margins.left],
    filename: filename.replace(/\.md$/i, '.pdf'),
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
    },
    jsPDF: {
      unit: 'mm',
      format: pageSize,
      orientation: orientation,
    },
    pagebreak: { mode: ['css', 'legacy'] },
  };

  try {
    await html2pdf().set(options).from(container.querySelector('.pdf-border-frame')).save();
  } finally {
    document.body.removeChild(container);
  }
}
