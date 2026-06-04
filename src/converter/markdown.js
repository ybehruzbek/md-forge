/**
 * MD Forge — Markdown Converter
 * marked.js + highlight.js + GitHub Alerts + Mermaid
 */

import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.min.css';
import twemoji from 'twemoji';

// Store mermaid blocks for later rendering
let mermaidBlocks = [];

/**
 * Configure marked with custom extensions
 */
function setupMarked() {
  const renderer = new marked.Renderer();

  // Custom heading with anchor IDs
  renderer.heading = function ({ text, depth }) {
    const slug = String(text).toLowerCase().replace(/[^\w]+/g, '-').replace(/^-|-$/g, '');
    return `<h${depth} id="${slug}">${text}</h${depth}>`;
  };

  // Custom code blocks — highlight.js + mermaid detection
  renderer.code = function ({ text, lang }) {
    // Mermaid diagrams
    if (lang === 'mermaid') {
      const id = `mermaid-${mermaidBlocks.length}`;
      mermaidBlocks.push({ id, code: text });
      return `<div class="mermaid-wrapper" id="${id}">${text}</div>`;
    }

    // Syntax highlighting
    let highlighted;
    if (lang && hljs.getLanguage(lang)) {
      highlighted = hljs.highlight(text, { language: lang }).value;
    } else {
      highlighted = hljs.highlightAuto(text).value;
    }

    const langLabel = lang || 'text';
    return `<div class="code-block-wrapper">
      <button class="code-copy-btn" data-code="${encodeURIComponent(text)}">Nusxalash</button>
      <pre><code class="hljs language-${langLabel}">${highlighted}</code></pre>
    </div>`;
  };

  // Checkbox list items — only style task items, don't interfere with nesting
  renderer.listitem = function (token) {
    const text = token.text || '';
    const str = String(text);
    // Check if this is a task list item (has checkbox)
    if (token.task) {
      const checked = token.checked ? ' checked=""' : '';
      const body = str.replace(/^\[[ x]\]\s*/i, '');
      return `<li style="list-style:none;margin-left:-1.5em"><input type="checkbox"${checked} disabled> ${body}</li>\n`;
    }
    // For all other list items, use default rendering to preserve nesting
    let itemBody = '';
    if (token.tokens) {
      itemBody = this.parser.parse(token.tokens, !!token.loose);
    } else {
      itemBody = str;
    }
    return `<li>${itemBody}</li>\n`;
  };

  marked.setOptions({
    renderer,
    gfm: true,
    breaks: false,
  });
}

/**
 * Process GitHub-style alerts
 * > [!NOTE] → styled alert block
 */
function processAlerts(md) {
  const alertTypes = {
    NOTE: { icon: 'ℹ️', cls: 'alert-note' },
    TIP: { icon: '💡', cls: 'alert-tip' },
    IMPORTANT: { icon: '❗', cls: 'alert-important' },
    WARNING: { icon: '⚠️', cls: 'alert-warning' },
    CAUTION: { icon: '🔴', cls: 'alert-caution' },
  };

  // Match blockquote alert pattern
  return md.replace(
    /^> \[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\n((?:>.*\n?)*)/gm,
    (match, type, body) => {
      const alert = alertTypes[type];
      const content = body.replace(/^> ?/gm, '').trim();
      return `<div class="alert-block ${alert.cls}">
        <div class="alert-title">${alert.icon} ${type}</div>
        <div>${marked.parse(content)}</div>
      </div>\n\n`;
    }
  );
}

/**
 * Convert Markdown to HTML
 * @param {string} md - Raw markdown text
 * @returns {string} HTML string
 */
export function convertMarkdown(md) {
  // Reset mermaid blocks
  mermaidBlocks = [];

  // Process alerts before marked
  let processed = processAlerts(md);

  // Parse with marked
  let html = marked.parse(processed);

  // Convert emojis to Apple style
  try {
    html = twemoji.parse(html, {
      base: 'https://cdnjs.cloudflare.com/ajax/libs/emoji-datasource-apple/15.0.1/img/apple/64/',
      ext: '.png',
      folder: '',
      className: 'apple-emoji'
    });
  } catch (e) {
    console.error('Emoji parse error:', e);
  }

  return html;
}

/**
 * Render mermaid diagrams in the preview
 * @param {HTMLElement} container - Preview container
 */
export async function renderMermaid(container) {
  if (mermaidBlocks.length === 0) return;

  try {
    const mermaid = (await import('mermaid')).default;
    const isDark = document.documentElement.dataset.theme === 'dark';
    const theme = isDark ? 'dark' : 'default';

    // Vibrant colors for charts
    const vibrantColors = {
      primaryColor: '#007AFF',
      primaryTextColor: isDark ? '#fff' : '#000',
      primaryBorderColor: '#005bb5',
      lineColor: isDark ? '#6e6e73' : '#aeaeb2',
      textColor: isDark ? '#f5f5f7' : '#1d1d1f',
      mainBkg: isDark ? '#2c2c2e' : '#f5f5f7',
      pie1: '#FF2D55', // Pink
      pie2: '#5856D6', // Purple
      pie3: '#FF9500', // Orange
      pie4: '#34C759', // Green
      pie5: '#5AC8FA', // Light Blue
      pie6: '#AF52DE', // Violet
      pie7: '#FF3B30', // Red
    };

    mermaid.initialize({
      startOnLoad: false,
      theme,
      themeVariables: vibrantColors,
      securityLevel: 'loose',
    });

    for (const block of mermaidBlocks) {
      const el = container.querySelector(`#${block.id}`);
      if (el) {
        try {
          const { svg } = await mermaid.render(`${block.id}-svg`, block.code);
          el.innerHTML = svg;
        } catch (e) {
          el.innerHTML = `<pre style="color:var(--error);font-size:12px">Mermaid xato: ${e.message}</pre>`;
        }
      }
    }
  } catch (e) {
    console.warn('Mermaid yuklanmadi:', e);
  }
}

/**
 * Generate Table of Contents from markdown
 * @param {string} md - Raw markdown
 * @returns {string} TOC as HTML
 */
export function generateTOC(md) {
  const headings = [];
  const regex = /^(#{1,3})\s+(.+)$/gm;
  let match;

  while ((match = regex.exec(md)) !== null) {
    const level = match[1].length;
    const text = match[2].replace(/[*_`]/g, '');
    const slug = text.toLowerCase().replace(/[^\w]+/g, '-').replace(/^-|-$/g, '');
    headings.push({ level, text, slug });
  }

  if (headings.length === 0) return '';

  let html = '<nav class="toc"><h4>Mundarija</h4><ul>';
  for (const h of headings) {
    const indent = (h.level - 1) * 16;
    html += `<li style="padding-left:${indent}px"><a href="#${h.slug}">${h.text}</a></li>`;
  }
  html += '</ul></nav>';

  return html;
}

// Initialize marked on import
setupMarked();
