/**
 * MD Forge — DOCX Export
 * html-docx-js wrapper for Word document generation
 */

/**
 * Export HTML content to DOCX
 * @param {string} htmlContent - Rendered HTML
 * @param {string} filename - Output filename
 */
export async function exportDOCX(htmlContent, filename) {
  const { asBlob } = await import('html-docx-js-typescript');
  const { saveAs } = await import('file-saver');

  // Create a simple styled HTML for DOCX conversion
  const fullHTML = `
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8">
    <style>
      body { font-family: 'Calibri', 'Segoe UI', sans-serif; font-size: 11pt; line-height: 1.6; color: #1a1a1a; }
      h1 { font-size: 22pt; font-weight: bold; color: #1a1a1a; margin: 16pt 0 8pt; }
      h2 { font-size: 16pt; font-weight: bold; color: #1a1a1a; margin: 14pt 0 6pt; border-bottom: 1pt solid #e0e0e0; padding-bottom: 4pt; }
      h3 { font-size: 13pt; font-weight: bold; color: #333333; margin: 12pt 0 4pt; }
      p { margin: 4pt 0; }
      a { color: #0563C1; }
      code { font-family: 'Consolas', 'Courier New', monospace; font-size: 9.5pt; background: #f4f4f4; padding: 1pt 4pt; }
      pre { background: #f4f4f4; padding: 10pt; margin: 8pt 0; font-family: 'Consolas', monospace; font-size: 9pt; line-height: 1.4; }
      pre code { background: none; padding: 0; }
      table { border-collapse: collapse; width: 100%; margin: 8pt 0; }
      th { background: #f0f0f0; font-weight: bold; padding: 6pt 8pt; border: 1pt solid #d0d0d0; text-align: left; }
      td { padding: 5pt 8pt; border: 1pt solid #d0d0d0; }
      blockquote { border-left: 3pt solid #007AFF; padding: 6pt 12pt; margin: 8pt 0; color: #666; }
      ul, ol { padding-left: 20pt; margin: 4pt 0; }
      li { margin: 2pt 0; }
      hr { border: none; border-top: 1pt solid #e0e0e0; margin: 12pt 0; }
      img { max-width: 100%; }
    </style>
    </head>
    <body>
    ${htmlContent}
    </body>
    </html>
  `;

  const blob = await asBlob(fullHTML);
  saveAs(blob, filename.replace(/\.md$/i, '.docx'));
}
