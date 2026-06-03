/**
 * MD Forge — Inline Theme CSS for Exports
 * Self-contained CSS strings for standalone HTML/PDF/DOCX
 */

const baseCSS = `
* { margin: 0; padding: 0; box-sizing: border-box; }
.print-bar { position: fixed; top: 0; left: 0; right: 0; background: #007AFF; color: white; padding: 8px 20px; display: flex; gap: 12px; align-items: center; z-index: 1000; font-family: -apple-system, sans-serif; font-size: 13px; }
.print-bar button { background: white; color: #007AFF; border: none; padding: 6px 16px; border-radius: 20px; font-weight: 600; cursor: pointer; font-size: 13px; }
.print-bar button:hover { background: #e8f0fe; }
@media print { .no-print { display: none !important; } .export-themed { padding: 0 !important; } }
.export-themed { padding: 60px 32px 48px; }
.export-themed h1 { font-size: 2em; font-weight: 700; margin: 1.2em 0 0.6em; line-height: 1.2; letter-spacing: -0.5px; }
.export-themed h1:first-child { margin-top: 0; }
.export-themed h2 { font-size: 1.5em; font-weight: 600; margin: 1.2em 0 0.5em; padding-bottom: 0.3em; }
.export-themed h3 { font-size: 1.25em; font-weight: 600; margin: 1em 0 0.5em; }
.export-themed h4 { font-weight: 600; margin: 1em 0 0.4em; }
.export-themed p { margin: 0.6em 0; }
.export-themed a { text-decoration: none; }
.export-themed a:hover { text-decoration: underline; }
.export-themed strong { font-weight: 600; }
.export-themed img { max-width: 100%; border-radius: 8px; margin: 1em 0; }
.export-themed ul, .export-themed ol { padding-left: 1.5em; margin: 0.6em 0; }
.export-themed li { margin: 0.25em 0; }
.export-themed table { width: 100%; border-collapse: collapse; margin: 1em 0; font-size: 14px; }
.export-themed th { text-align: left; font-weight: 600; padding: 10px 12px; }
.export-themed td { padding: 8px 12px; }
.export-themed hr { border: none; height: 1px; margin: 2em 0; }
.export-themed pre { margin: 1em 0; border-radius: 8px; overflow: hidden; }
.export-themed pre code { display: block; padding: 16px 20px; font-size: 13px; line-height: 1.6; overflow-x: auto; border-radius: 8px; }
.export-themed code { font-size: 0.88em; padding: 2px 6px; border-radius: 4px; }
.export-themed blockquote { border-left: 3px solid; padding: 8px 16px; margin: 1em 0; border-radius: 0 8px 8px 0; }
.export-themed blockquote p { margin: 0.3em 0; }
.alert-block { padding: 12px 16px; margin: 1em 0; border-radius: 8px; border-left: 4px solid; font-size: 14px; }
.alert-block .alert-title { font-weight: 600; font-size: 13px; margin-bottom: 4px; }
`;

const themes = {
  clean: `
${baseCSS}
.export-themed { font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif; font-size: 15px; line-height: 1.7; color: #1d1d1f; background: #ffffff; max-width: 720px; margin: 0 auto; }
.export-themed h1, .export-themed h2, .export-themed h3 { color: #1d1d1f; }
.export-themed h2 { border-bottom: 1px solid #e5e5ea; }
.export-themed a { color: #007AFF; }
.export-themed code { background: #f5f5f7; color: #1d1d1f; font-family: 'SF Mono', 'Fira Code', Consolas, monospace; }
.export-themed pre code { background: #f5f5f7; color: #1d1d1f; }
.export-themed blockquote { border-color: #007AFF; background: #f5f5f7; color: #6e6e73; }
.export-themed th { background: #f5f5f7; border-bottom: 2px solid #e5e5ea; }
.export-themed td { border-bottom: 1px solid #f0f0f0; }
.export-themed hr { background: #e5e5ea; }
.alert-note { background: rgba(0,122,255,0.08); border-color: #007AFF; }
.alert-tip { background: rgba(52,199,89,0.08); border-color: #34C759; }
.alert-important { background: rgba(175,82,222,0.08); border-color: #af52de; }
.alert-warning { background: rgba(255,149,0,0.08); border-color: #FF9500; }
.alert-caution { background: rgba(255,59,48,0.08); border-color: #FF3B30; }
`,
  dark: `
${baseCSS}
.export-themed { font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif; font-size: 15px; line-height: 1.7; color: #f5f5f7; background: #1c1c1e; max-width: 720px; margin: 0 auto; }
.export-themed h1, .export-themed h2, .export-themed h3 { color: #ffffff; }
.export-themed h2 { border-bottom: 1px solid #38383a; }
.export-themed a { color: #0A84FF; }
.export-themed code { background: #2c2c2e; color: #f5f5f7; font-family: 'SF Mono', 'Fira Code', Consolas, monospace; }
.export-themed pre code { background: #2c2c2e; color: #e4e4e7; }
.export-themed blockquote { border-color: #0A84FF; background: rgba(10,132,255,0.1); color: #98989d; }
.export-themed th { background: #2c2c2e; border-bottom: 2px solid #38383a; }
.export-themed td { border-bottom: 1px solid #38383a; }
.export-themed hr { background: #38383a; }
.alert-note { background: rgba(10,132,255,0.15); border-color: #0A84FF; }
.alert-tip { background: rgba(48,209,88,0.15); border-color: #30D158; }
.alert-important { background: rgba(191,90,242,0.15); border-color: #BF5AF2; }
.alert-warning { background: rgba(255,159,10,0.15); border-color: #FF9F0A; }
.alert-caution { background: rgba(255,69,58,0.15); border-color: #FF453A; }
`,
  academic: `
${baseCSS}
.export-themed { font-family: 'Georgia', 'Times New Roman', 'Palatino', serif; font-size: 16px; line-height: 1.8; color: #2c2c2c; background: #fffef9; max-width: 680px; margin: 0 auto; }
.export-themed h1, .export-themed h2, .export-themed h3 { color: #1a1a1a; font-family: 'Georgia', serif; }
.export-themed h2 { border-bottom: 1px solid #d4cfc4; }
.export-themed a { color: #8B4513; }
.export-themed code { background: #f4f1ea; color: #2c2c2c; font-family: 'Courier New', Courier, monospace; }
.export-themed pre code { background: #f4f1ea; color: #2c2c2c; }
.export-themed blockquote { border-color: #8B4513; background: #f4f1ea; color: #666666; }
.export-themed th { background: #f4f1ea; border-bottom: 2px solid #d4cfc4; }
.export-themed td { border-bottom: 1px solid #e8e4da; }
.export-themed hr { background: #d4cfc4; }
.alert-note { background: rgba(139,69,19,0.06); border-color: #8B4513; }
.alert-tip { background: rgba(34,139,34,0.06); border-color: #228B22; }
.alert-important { background: rgba(139,0,0,0.06); border-color: #8B0000; }
.alert-warning { background: rgba(218,165,32,0.06); border-color: #DAA520; }
.alert-caution { background: rgba(178,34,34,0.06); border-color: #B22222; }
`,
  minimal: `
${baseCSS}
.export-themed { font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; font-size: 16px; line-height: 1.8; color: #333333; background: #ffffff; max-width: 640px; margin: 0 auto; }
.export-themed h1, .export-themed h2, .export-themed h3 { color: #111111; }
.export-themed h2 { border-bottom: 1px solid #eeeeee; }
.export-themed a { color: #333333; }
.export-themed code { background: #fafafa; color: #333333; font-family: 'SF Mono', Consolas, monospace; }
.export-themed pre code { background: #fafafa; color: #333333; }
.export-themed blockquote { border-color: #dddddd; background: transparent; color: #999999; }
.export-themed th { background: transparent; border-bottom: 2px solid #eeeeee; }
.export-themed td { border-bottom: 1px solid #f5f5f5; }
.export-themed hr { background: #eeeeee; }
.alert-note { background: #f9f9f9; border-color: #dddddd; }
.alert-tip { background: #f9f9f9; border-color: #cccccc; }
.alert-important { background: #f9f9f9; border-color: #999999; }
.alert-warning { background: #f9f9f9; border-color: #bbbbbb; }
.alert-caution { background: #f9f9f9; border-color: #aaaaaa; }
`,
};

/**
 * Get inline CSS for a specific theme
 * @param {string} theme - Theme name
 * @returns {string} CSS string
 */
export function getExportThemeCSS(theme) {
  return themes[theme] || themes.clean;
}
