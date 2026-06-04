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
.export-themed ul, .export-themed ol { padding-left: 1.5em; margin: 0.6em 0; }
.export-themed li { margin: 0.25em 0; }
.export-themed table { width: 100%; border-collapse: collapse; margin: 1em 0; font-size: 14px; }
.export-themed th { text-align: left; font-weight: 600; padding: 10px 12px; }
.export-themed td { padding: 8px 12px; }
.export-themed hr { border: none; height: 1px; margin: 32px 0; }
.export-themed img { max-width: 100%; border-radius: 8px; margin: 1em 0; }
.export-themed img.apple-emoji { width: 1.15em; height: 1.15em; margin: 0 0.05em 0 0.1em; vertical-align: -0.2em; display: inline-block; border-radius: 0; box-shadow: none; border: none; }
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
:root { --black: #1d1d1f; --gray1: #424245; --gray2: #6e6e73; --gray3: #86868b; --gray4: #d2d2d7; --gray5: #f5f5f7; --white: #ffffff; --blue: #0071e3; }
.export-themed { font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 17px; line-height: 1.47; color: var(--black); background: var(--white); max-width: 740px; margin: 0 auto; -webkit-font-smoothing: antialiased; }
.export-themed h1, .export-themed h2, .export-themed h3, .export-themed h4 { page-break-after: avoid; break-after: avoid; }
.export-themed h1 { font-size: 42px; font-weight: 700; letter-spacing: -.03em; line-height: 1.1; color: var(--black); margin-bottom: 24px; }
.export-themed h2 { font-size: 32px; font-weight: 700; letter-spacing: -.025em; line-height: 1.15; color: var(--black); margin: 48px 0 16px; border-bottom: none; }
.export-themed h3 { font-size: 24px; font-weight: 600; letter-spacing: -.02em; color: var(--black); margin: 40px 0 16px; }
.export-themed p { margin: 12px 0; color: var(--gray1); }
.export-themed a { color: var(--blue); text-decoration: none; }
.export-themed code { background: var(--gray5); color: var(--black); font-family: 'SF Mono', Consolas, monospace; font-size: 14px; padding: 3px 6px; border-radius: 6px; }
.export-themed pre { background: var(--gray5); border-radius: 16px; padding: 20px; margin: 24px 0; border: none; }
.export-themed pre code { background: transparent; padding: 0; }
.export-themed blockquote { background: var(--gray5); border-radius: 16px; padding: 20px 24px; margin: 24px 0; font-size: 15px; color: var(--gray1); line-height: 1.53; border-left: none; }
.export-themed blockquote strong { color: var(--black); }
.export-themed table { width: 100%; border-collapse: collapse; font-size: 14px; letter-spacing: -.01em; margin: 20px 0; min-width: 480px; }
.export-themed th { text-align: left; font-weight: 600; color: var(--gray3); font-size: 12px; text-transform: uppercase; letter-spacing: .04em; padding: 8px 14px 10px; border-bottom: 1px solid var(--gray4); white-space: nowrap; background: transparent; }
.export-themed td { padding: 12px 14px; border-bottom: .5px solid rgba(0,0,0,.06); color: var(--gray1); }
.export-themed td strong { color: var(--black); font-weight: 600; }
.export-themed hr { border: none; border-top: .5px solid var(--gray4); margin: 32px 0; background: transparent; height: 0; }
.export-themed ul, .export-themed ol { margin: 20px 0; padding-left: 24px; color: var(--gray1); }
.export-themed li { padding: 4px 0; }
.alert-note { background: #edf4ff; border-color: transparent; }
.alert-tip { background: #eefbf0; border-color: transparent; }
.alert-important { background: #fff0f0; border-color: transparent; }
.alert-warning { background: #fff8ee; border-color: transparent; }
.alert-caution { background: #fff0f0; border-color: transparent; }
`,
};

/**
 * Get inline CSS for a specific theme
 * @param {string} theme - Theme name
 * @returns {string} CSS string
 */
export function getExportThemeCSS() {
  return themes['clean'];
}
