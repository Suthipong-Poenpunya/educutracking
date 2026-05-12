// ============================================================
// utils.js — Helper Functions
// ChulaEduTracker
// ============================================================

/**
 * Generate a UUID v4
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

/**
 * Format date to Thai-style string
 */
function formatDate(date) {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
}

/**
 * Get semester label in Thai
 */
function getSemesterLabel(semester) {
  switch (parseInt(semester)) {
    case 1: return 'ภาคต้น';
    case 2: return 'ภาคปลาย';
    case 3: return 'ภาคฤดูร้อน';
    default: return `ภาค ${semester}`;
  }
}

/**
 * Get full semester display text
 */
function getSemesterDisplayText(academicYear, semester) {
  return `ปีการศึกษา ${academicYear} ${getSemesterLabel(semester)}`;
}

// ---- LocalStorage Helpers ----

const STORAGE_KEYS = {
  USER: 'chula_edu_user',
  SEMESTERS: 'chula_edu_semesters',
  ENROLLMENTS: 'chula_edu_enrollments',
  SETTINGS: 'chula_edu_settings'
};

function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Storage save failed:', e);
    return false;
  }
}

function loadFromStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Storage load failed:', e);
    return null;
  }
}

function clearStorage() {
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
}

// ---- Export CSV ----

function exportToCSV(data, filename) {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row =>
      headers.map(h => {
        let val = row[h] ?? '';
        // Escape commas and quotes
        if (typeof val === 'string' && (val.includes(',') || val.includes('"') || val.includes('\n'))) {
          val = '"' + val.replace(/"/g, '""') + '"';
        }
        return val;
      }).join(',')
    )
  ];

  const csvString = '\uFEFF' + csvRows.join('\n'); // BOM for Thai text
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename || 'export.csv';
  link.click();
  URL.revokeObjectURL(link.href);
}

// ---- Animation Helper ----

function animateValue(element, start, end, duration, suffix = '') {
  const range = end - start;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    const current = start + range * eased;

    if (Number.isInteger(end)) {
      element.textContent = Math.round(current) + suffix;
    } else {
      element.textContent = current.toFixed(2) + suffix;
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  requestAnimationFrame(update);
}

// ---- Debounce ----

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// ---- Toast Notification ----

function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span class="toast-message">${message}</span>
  `;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ---- Grade Color Helper ----

function getGradeColor(grade) {
  const colors = {
    'A':  '#10b981', 'B+': '#34d399', 'B':  '#6ee7b7',
    'C+': '#fbbf24', 'C':  '#f59e0b', 'D+': '#f97316',
    'D':  '#ef4444', 'F':  '#dc2626',
    'W':  '#6b7280', 'S':  '#8b5cf6', 'U':  '#6b7280',
    'I':  '#6b7280', 'P':  '#8b5cf6'
  };
  return colors[grade] || '#6b7280';
}

function getGradeBadgeClass(grade) {
  if (['A', 'B+', 'B'].includes(grade)) return 'grade-good';
  if (['C+', 'C'].includes(grade)) return 'grade-mid';
  if (['D+', 'D'].includes(grade)) return 'grade-low';
  if (grade === 'F') return 'grade-fail';
  return 'grade-special';
}
