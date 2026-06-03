/**
 * MD Forge — Toast Notifications
 * Apple-style glass notifications
 */

const ICONS = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠',
};

/**
 * Show a toast notification
 * @param {string} message - Toast text
 * @param {'success'|'error'|'info'|'warning'} type - Toast type
 * @param {number} duration - Auto-dismiss duration in ms
 */
export function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container');

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${ICONS[type]}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Auto dismiss
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-8px) scale(0.95)';
    toast.style.transition = 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
