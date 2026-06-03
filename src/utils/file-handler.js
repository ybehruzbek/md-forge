/**
 * MD Forge — File Handler
 * File reading, ZIP packaging, and download utilities
 */

/**
 * Read a File object as text
 * @param {File} file
 * @returns {Promise<{name: string, content: string}>}
 */
export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ name: file.name, content: reader.result });
    reader.onerror = () => reject(new Error(`${file.name} o'qishda xato`));
    reader.readAsText(file);
  });
}

/**
 * Read multiple files
 * @param {FileList|File[]} files
 * @returns {Promise<Array<{name: string, content: string}>>}
 */
export async function readMultipleFiles(files) {
  const mdFiles = Array.from(files).filter(f =>
    f.name.endsWith('.md') || f.name.endsWith('.markdown') || f.name.endsWith('.txt')
  );

  if (mdFiles.length === 0) {
    throw new Error('MD fayl topilmadi');
  }

  return Promise.all(mdFiles.map(readFileAsText));
}

/**
 * Create and download a ZIP file from multiple converted files
 * @param {Array<{name: string, content: string}>} files - Array of {name, content}
 * @param {string} zipName - Name for the ZIP file
 * @param {Function} onProgress - Progress callback (current, total)
 */
export async function downloadAsZip(files, zipName = 'md-forge-export.zip', onProgress) {
  const JSZip = (await import('jszip')).default;
  const { saveAs } = await import('file-saver');

  const zip = new JSZip();

  for (let i = 0; i < files.length; i++) {
    zip.file(files[i].name, files[i].content);
    if (onProgress) onProgress(i + 1, files.length);
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, zipName);
}

/**
 * Trigger download of a single file
 * @param {string} content - File content
 * @param {string} filename - File name
 * @param {string} mimeType - MIME type
 */
export function downloadFile(content, filename, mimeType = 'text/html') {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Get file name without extension
 * @param {string} filename
 * @returns {string}
 */
export function getBaseName(filename) {
  return filename.replace(/\.(md|markdown|txt)$/i, '');
}
