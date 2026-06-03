/**
 * MD Forge — Theme Manager
 * Light/Dark mode toggle with system preference detection
 */

const THEME_KEY = 'md-forge-theme';
const EXPORT_THEME_KEY = 'md-forge-export-theme';

/**
 * Initialize theme from localStorage or system preference
 */
export function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) {
    setTheme(saved, false);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light', false);
  }

  // Listen to system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
      setTheme(e.matches ? 'dark' : 'light', false);
    }
  });
}

/**
 * Set theme (light/dark)
 * @param {string} theme - 'light' or 'dark'
 * @param {boolean} save - Save to localStorage
 */
export function setTheme(theme, save = true) {
  document.documentElement.dataset.theme = theme;
  if (save) {
    localStorage.setItem(THEME_KEY, theme);
  }
}

/**
 * Toggle between light and dark
 */
export function toggleTheme() {
  const current = document.documentElement.dataset.theme;
  const next = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}

/**
 * Get current theme
 * @returns {string} 'light' or 'dark'
 */
export function getTheme() {
  return document.documentElement.dataset.theme || 'light';
}

/**
 * Get/set export theme
 */
export function getExportTheme() {
  return localStorage.getItem(EXPORT_THEME_KEY) || 'clean';
}

export function setExportTheme(theme) {
  localStorage.setItem(EXPORT_THEME_KEY, theme);
}
