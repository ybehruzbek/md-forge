/**
 * MD Forge — Main Entry Point
 * App initialization, event binding, module orchestration
 */

// Styles
import './styles/index.css';
import './styles/components.css';
import './styles/editor.css';
import './styles/themes.css';

// Modules
import { convertMarkdown, renderMermaid } from './converter/markdown.js';
import { exportPDF } from './converter/pdf.js';
import { exportDOCX } from './converter/docx.js';
import { getExportThemeCSS } from './converter/themes-inline.js';
import { initTheme, toggleTheme } from './utils/theme.js';
import { readFileAsText, readMultipleFiles, downloadAsZip, getBaseName } from './utils/file-handler.js';
import { showToast } from './components/toast.js';

// ===== STATE =====
const state = {
  files: [],          // Array of {name, content}
  activeIndex: 0,     // Current active file index
  format: 'pdf',      // Export format: pdf, docx
  zoom: 100,
  renderTimeout: null,
  // Page settings
  pageSize: 'a4',
  pageOrientation: 'portrait',
  margins: { top: 15, right: 15, bottom: 15, left: 15 },
  pageBorder: 'none',
};

// ===== DOM ELEMENTS =====
const $ = (id) => document.getElementById(id);
const els = {};

function cacheDom() {
  els.navbar = $('navbar');
  els.dropzoneSection = $('dropzone-section');
  els.editorSection = $('editor-section');
  els.dropzone = $('dropzone');
  els.fileInput = $('file-input');
  els.browseBtn = $('browse-btn');
  els.writeBtn = $('write-btn');
  els.editor = $('md-editor');
  els.preview = $('preview');
  els.charCount = $('char-count');
  els.formatPicker = $('format-picker');
  els.darkToggle = $('darkmode-toggle');
  els.exportBtn = $('export-btn');
  els.sidebar = $('sidebar');
  els.fileList = $('file-list');
  els.fileCount = $('file-count');
  els.addMoreBtn = $('add-more-btn');
  els.bulkExportBtn = $('bulk-export-btn');
  els.divider = $('divider');
  els.zoomIn = $('zoom-in');
  els.zoomOut = $('zoom-out');
  els.zoomLevel = $('zoom-level');
  els.progressModal = $('progress-modal');
  els.progressBar = $('progress-bar');
  els.progressText = $('progress-text');
  els.progressCancel = $('progress-cancel');
  // Settings panel
  els.settingsToggle = $('settings-toggle');
  els.settingsPanel = $('export-settings');
  els.settingsClose = $('settings-close');
  els.pageSize = $('page-size');
  els.pageOrientation = $('page-orientation');
  els.marginTop = $('margin-top');
  els.marginRight = $('margin-right');
  els.marginBottom = $('margin-bottom');
  els.marginLeft = $('margin-left');
  els.pageBorder = $('page-border');
}

// ===== INITIALIZATION =====
function init() {
  cacheDom();
  initTheme();

  bindDropzone();
  bindEditor();
  bindToolbar();
  bindDivider();
  bindKeyboard();
  bindSettings();

  // Mark initial active theme option
  updateSegmentedControl();

  // Prevent FOUC: Reveal UI smoothly
  setTimeout(() => {
    document.body.classList.add('ready');
  }, 50);
}

// ===== DROPZONE =====
function bindDropzone() {
  const dz = els.dropzone;

  // Drag events
  ['dragenter', 'dragover'].forEach(ev => {
    dz.addEventListener(ev, (e) => {
      e.preventDefault();
      dz.classList.add('drag-over');
    });
  });

  ['dragleave', 'drop'].forEach(ev => {
    dz.addEventListener(ev, (e) => {
      e.preventDefault();
      dz.classList.remove('drag-over');
    });
  });

  dz.addEventListener('drop', async (e) => {
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleFiles(files);
    }
  });

  // Click on dropzone
  dz.addEventListener('click', () => els.fileInput.click());

  // Browse button
  els.browseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    els.fileInput.click();
  });

  // File input change
  els.fileInput.addEventListener('change', async (e) => {
    if (e.target.files.length > 0) {
      await handleFiles(e.target.files);
      e.target.value = '';
    }
  });

  // Write manually button
  els.writeBtn.addEventListener('click', () => {
    state.files = [{ name: 'untitled.md', content: '' }];
    state.activeIndex = 0;
    showEditor();
    els.editor.focus();
  });

  // Add more files
  els.addMoreBtn.addEventListener('click', () => els.fileInput.click());
}

async function handleFiles(fileList) {
  try {
    const files = await readMultipleFiles(fileList);
    state.files = [...state.files, ...files];
    state.activeIndex = state.files.length > 1 ? state.activeIndex : 0;

    showEditor();
    loadActiveFile();

    if (state.files.length > 1) {
      showSidebar();
    }

    showToast(`${files.length} fayl yuklandi`, 'success');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ===== EDITOR =====
function bindEditor() {
  els.editor.addEventListener('input', () => {
    // Save current content to state
    if (state.files[state.activeIndex]) {
      state.files[state.activeIndex].content = els.editor.value;
    }

    updateCharCount();
    debouncedRender();
  });

  // Tab support
  els.editor.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = els.editor.selectionStart;
      const end = els.editor.selectionEnd;
      els.editor.value = els.editor.value.substring(0, start) + '  ' + els.editor.value.substring(end);
      els.editor.selectionStart = els.editor.selectionEnd = start + 2;
      els.editor.dispatchEvent(new Event('input'));
    }
  });
}

function loadActiveFile() {
  const file = state.files[state.activeIndex];
  if (!file) return;

  els.editor.value = file.content;
  updateCharCount();
  renderPreview();
  updateSidebarActive();
}

function updateCharCount() {
  const len = els.editor.value.length;
  els.charCount.textContent = `${len.toLocaleString()} belgi`;
}

function debouncedRender() {
  clearTimeout(state.renderTimeout);
  state.renderTimeout = setTimeout(renderPreview, 150);
}

async function renderPreview() {
  const md = els.editor.value;
  if (!md.trim()) {
    els.preview.innerHTML = '<p style="color:var(--text-tertiary);text-align:center;margin-top:40vh">Preview bu yerda ko\'rinadi</p>';
    return;
  }

  const html = convertMarkdown(md);
  els.preview.innerHTML = html;

  // Convert emojis to Apple style
  try {
    if (window.twemoji) {
      twemoji.parse(els.preview, {
        callback: function(icon, options, variant) {
          // Reconstruct the actual emoji character from the hex code
          const emojiChar = String.fromCodePoint(...icon.split('-').map(x => parseInt(x, 16)));
          // Use Elk.sh CDN which perfectly maps the character to Apple style
          return 'https://emojicdn.elk.sh/' + emojiChar + '?style=apple';
        },
        className: 'apple-emoji'
      });
    }
  } catch (e) {
    console.warn('Twemoji parse error:', e);
  }

  // Add skeleton overlay
  const skeleton = document.createElement('div');
  skeleton.className = 'loading-overlay';
  skeleton.innerHTML = `
    <div class="skeleton skeleton-title" style="max-width:300px"></div>
    <div class="skeleton skeleton-text"></div>
    <div class="skeleton skeleton-text"></div>
    <div class="skeleton skeleton-text" style="max-width:80%"></div>
    <div style="height:32px"></div>
    <div class="skeleton skeleton-block"></div>
  `;
  els.preview.appendChild(skeleton);

  // Render mermaid diagrams
  await renderMermaid(els.preview);

  // Bind code copy buttons
  els.preview.querySelectorAll('.code-copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = decodeURIComponent(btn.dataset.code);
      navigator.clipboard.writeText(code).then(() => {
        btn.textContent = 'Nusxalandi!';
        setTimeout(() => btn.textContent = 'Nusxalash', 1500);
      });
    });
  });

  // Fade out skeleton smoothly
  requestAnimationFrame(() => {
    skeleton.classList.add('fade-out');
    setTimeout(() => skeleton.remove(), 300);
  });
}

// ===== TOOLBAR =====
function bindToolbar() {
  // Format picker (segmented control)
  els.formatPicker.querySelectorAll('.seg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.format = btn.dataset.format;
      els.formatPicker.querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateSegmentedControl();
    });
  });

  // Dark mode toggle
  els.darkToggle.addEventListener('click', () => {
    const newTheme = toggleTheme();
    showToast(newTheme === 'dark' ? 'Qorong\'u rejim' : 'Yorug\' rejim', 'info', 1500);
  });

  // Export button
  els.exportBtn.addEventListener('click', handleExport);

  // Bulk export
  els.bulkExportBtn.addEventListener('click', handleBulkExport);

  // Zoom
  els.zoomIn.addEventListener('click', () => {
    state.zoom = Math.min(state.zoom + 10, 200);
    applyZoom();
  });

  els.zoomOut.addEventListener('click', () => {
    state.zoom = Math.max(state.zoom - 10, 60);
    applyZoom();
  });

  // Progress cancel
  els.progressCancel.addEventListener('click', () => {
    els.progressModal.classList.add('hidden');
  });
}

// ===== SETTINGS PANEL =====
function bindSettings() {
  els.settingsToggle.addEventListener('click', () => {
    els.settingsPanel.classList.toggle('hidden');
  });

  els.settingsClose.addEventListener('click', () => {
    els.settingsPanel.classList.add('hidden');
  });

  // Page Size Custom Segmented Control
  els.pageSize.querySelectorAll('.custom-seg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      els.pageSize.querySelectorAll('.custom-seg-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.pageSize = btn.dataset.val;
    });
  });

  // Page Orientation Custom Segmented Control
  els.pageOrientation.querySelectorAll('.custom-seg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      els.pageOrientation.querySelectorAll('.custom-seg-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.pageOrientation = btn.dataset.val;
    });
  });

  // Page Border Visual Grid
  els.pageBorder.querySelectorAll('.border-card').forEach(card => {
    card.addEventListener('click', () => {
      els.pageBorder.querySelectorAll('.border-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      state.pageBorder = card.dataset.val;
    });
  });

  // Margin inputs
  ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'].forEach(key => {
    const side = key.replace('margin', '').toLowerCase();
    els[key].addEventListener('input', (e) => {
      state.margins[side] = parseInt(e.target.value) || 0;
    });
  });
}

function updateSegmentedControl() {
  const btns = els.formatPicker.querySelectorAll('.seg-btn');
  const indicator = els.formatPicker.querySelector('.seg-indicator');
  const activeBtn = els.formatPicker.querySelector('.seg-btn.active');

  if (activeBtn && indicator) {
    indicator.style.width = `${activeBtn.offsetWidth}px`;
    indicator.style.transform = `translateX(${activeBtn.offsetLeft - 2}px)`;
  }
}

function applyZoom() {
  els.preview.style.fontSize = `${(state.zoom / 100) * 15}px`;
  els.zoomLevel.textContent = `${state.zoom}%`;
}



// ===== EXPORT =====
async function handleExport() {
  const file = state.files[state.activeIndex];
  if (!file || !file.content.trim()) {
    showToast('Eksport uchun matn kerak', 'warning');
    return;
  }

  // Clone preview to capture rendered Mermaid SVGs but remove UI elements
  const previewClone = els.preview.cloneNode(true);
  previewClone.querySelectorAll('.code-copy-btn').forEach(btn => btn.remove());
  const html = await prepareHTMLForExport(previewClone.innerHTML);
  const themeCSS = getExportThemeCSS();
  const baseName = getBaseName(file.name);
  const pageSettings = {
    pageSize: state.pageSize,
    orientation: state.pageOrientation,
    margins: state.margins,
    border: state.pageBorder,
  };

  try {
    els.exportBtn.disabled = true;
    els.exportBtn.querySelector('span').textContent = '...';

    switch (state.format) {
      case 'pdf': {
        showToast('PDF tayyorlanmoqda...', 'info', 2000);
        await exportPDF(html, themeCSS, file.name, 'clean', pageSettings);
        showToast('PDF eksport qilindi ✓', 'success');
        break;
      }
      case 'docx': {
        showToast('DOCX tayyorlanmoqda...', 'info', 2000);
        await exportDOCX(html, file.name);
        showToast('DOCX eksport qilindi ✓', 'success');
        break;
      }
    }
  } catch (err) {
    showToast(`Eksport xatosi: ${err.message}`, 'error');
    console.error(err);
  } finally {
    els.exportBtn.disabled = false;
    els.exportBtn.querySelector('span').textContent = 'Export';
  }
}

async function prepareHTMLForExport(htmlString) {
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.visibility = 'hidden';
  container.style.width = '800px'; // Give it a fixed width so svgs can resolve 100% width
  container.innerHTML = htmlString;
  document.body.appendChild(container); 
  
  const svgs = container.querySelectorAll('svg');
  for (const svg of svgs) {
    await new Promise((resolve) => {
      try {
        let w = svg.viewBox.baseVal?.width;
        let h = svg.viewBox.baseVal?.height;
        
        if (!w || !h) {
          const rect = svg.getBoundingClientRect();
          w = rect.width || 800;
          h = rect.height || 400;
        }

        const xml = new XMLSerializer().serializeToString(svg);
        const svg64 = btoa(unescape(encodeURIComponent(xml)));
        const image64 = 'data:image/svg+xml;base64,' + svg64;
        
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = w * 2;
          canvas.height = h * 2;
          const ctx = canvas.getContext('2d');
          
          // Canvas is transparent by default. No fillRect needed.
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          const pngData = canvas.toDataURL('image/png');
          const finalImg = document.createElement('img');
          finalImg.src = pngData;
          finalImg.style.width = w + 'px';
          finalImg.style.maxWidth = '100%';
          finalImg.style.display = 'block';
          finalImg.style.margin = '0 auto';
          
          svg.replaceWith(finalImg);
          resolve();
        };
        img.onerror = () => resolve();
        img.src = image64;
      } catch(e) {
        resolve(); // skip on error
      }
    });
  }
  
  const finalHtml = container.innerHTML;
  document.body.removeChild(container);
  return finalHtml;
}

async function handleBulkExport() {
  if (state.files.length === 0) {
    showToast('Fayllar kerak', 'warning');
    return;
  }

  // Show progress
  els.progressModal.classList.remove('hidden');
  els.progressBar.style.width = '0%';
  els.progressText.textContent = `0 / ${state.files.length} tayyor`;

  const converted = [];

  try {
    for (let i = 0; i < state.files.length; i++) {
      const file = state.files[i];
      const html = convertMarkdown(file.content);
      const baseName = getBaseName(file.name);

      let ext, content;
      switch (state.format) {
        case 'html':
          ext = '.html';
          content = generateHTML(html, state.exportTheme, baseName);
          break;
        case 'pdf':
        case 'docx':
          // For bulk, fallback to HTML
          ext = '.html';
          content = generateHTML(html, state.exportTheme, baseName);
          break;
      }

      converted.push({ name: `${baseName}${ext}`, content });

      const progress = ((i + 1) / state.files.length) * 100;
      els.progressBar.style.width = `${progress}%`;
      els.progressText.textContent = `${i + 1} / ${state.files.length} tayyor`;
    }

    // Download as ZIP
    await downloadAsZip(converted, 'md-forge-export.zip');
    showToast(`${converted.length} fayl ZIP sifatida eksport qilindi ✓`, 'success');
  } catch (err) {
    showToast(`Bulk eksport xatosi: ${err.message}`, 'error');
  } finally {
    els.progressModal.classList.add('hidden');
  }
}

// ===== SIDEBAR =====
function showSidebar() {
  els.sidebar.classList.remove('hidden');
  renderSidebar();
}

function renderSidebar() {
  els.fileCount.textContent = state.files.length;
  els.fileList.innerHTML = '';

  state.files.forEach((file, index) => {
    const item = document.createElement('div');
    item.className = `file-item${index === state.activeIndex ? ' active' : ''}`;
    item.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      <span class="file-item-name">${file.name}</span>
      <button class="file-item-remove" title="Olib tashlash">×</button>
    `;

    item.addEventListener('click', () => {
      state.activeIndex = index;
      loadActiveFile();
      renderSidebar();
    });

    item.querySelector('.file-item-remove').addEventListener('click', (e) => {
      e.stopPropagation();
      state.files.splice(index, 1);
      if (state.files.length === 0) {
        showDropzone();
        return;
      }
      if (state.activeIndex >= state.files.length) {
        state.activeIndex = state.files.length - 1;
      }
      loadActiveFile();
      renderSidebar();
      if (state.files.length <= 1) {
        els.sidebar.classList.add('hidden');
      }
    });

    els.fileList.appendChild(item);
  });
}

function updateSidebarActive() {
  els.fileList.querySelectorAll('.file-item').forEach((item, i) => {
    item.classList.toggle('active', i === state.activeIndex);
  });
}

// ===== VIEW MANAGEMENT =====
function showEditor() {
  els.dropzoneSection.classList.add('hidden');
  els.editorSection.classList.remove('hidden');
  els.navbar.classList.add('stuck');
  document.body.classList.add('editor-active');
}

function showDropzone() {
  els.editorSection.classList.add('hidden');
  els.dropzoneSection.classList.remove('hidden');
  els.sidebar.classList.add('hidden');
  els.navbar.classList.remove('stuck');
  document.body.classList.remove('editor-active');
  state.files = [];
  state.activeIndex = 0;
}

// ===== DIVIDER (Resize) =====
function bindDivider() {
  let isDragging = false;
  let startX;
  let startLeftWidth;

  els.divider.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    const editorPane = els.divider.previousElementSibling;
    startLeftWidth = editorPane.offsetWidth;
    els.divider.classList.add('active');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const editorPane = els.divider.previousElementSibling;
    const previewPane = els.divider.nextElementSibling;
    const container = editorPane.parentElement;
    const containerWidth = container.offsetWidth;
    const newLeftWidth = Math.max(280, Math.min(containerWidth - 280, startLeftWidth + dx));
    const leftPercent = (newLeftWidth / containerWidth) * 100;

    editorPane.style.flex = `0 0 ${leftPercent}%`;
    previewPane.style.flex = `1`;
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      els.divider.classList.remove('active');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  });
}

// ===== KEYBOARD SHORTCUTS =====
function bindKeyboard() {
  document.addEventListener('keydown', (e) => {
    // Ctrl+S / Cmd+S — Export
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleExport();
    }

    // Ctrl+E / Cmd+E — Toggle format
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
      e.preventDefault();
      const formats = ['html', 'pdf', 'docx'];
      const idx = formats.indexOf(state.format);
      state.format = formats[(idx + 1) % formats.length];
      els.formatPicker.querySelectorAll('.seg-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.format === state.format);
      });
      updateSegmentedControl();
      showToast(`Format: ${state.format.toUpperCase()}`, 'info', 1200);
    }

    // Escape — Close menus / settings
    if (e.key === 'Escape') {
      els.themeMenu.classList.add('hidden');
      els.progressModal.classList.add('hidden');
      els.settingsPanel.classList.add('hidden');
    }
  });
}

// ===== GLOBAL DROP PREVENTION =====
// Prevent browser from opening dropped files
document.addEventListener('dragover', (e) => e.preventDefault());
document.addEventListener('drop', (e) => e.preventDefault());

// ===== START =====
document.addEventListener('DOMContentLoaded', init);

// Handle window resize for segmented control
window.addEventListener('resize', () => {
  requestAnimationFrame(updateSegmentedControl);
});
