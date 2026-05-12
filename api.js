// ============================================================
// api.js — Apps Script API Connector with localStorage Fallback
// ChulaEduTracker
// ============================================================

// ---- Configuration ----
// เปลี่ยน API_BASE เป็น URL ของ Apps Script Web App ที่ deploy แล้ว
const API_BASE = 'https://script.google.com/macros/s/AKfycbyWchLf-hdgEgNaQQm2nGuFy9RbKiIWXRSQGiOvyoMYUZ2tCvz-b9coCdunXHIOg1dyCw/exec'; // เว้นว่างไว้ = ใช้ localStorage อย่างเดียว

const USE_API = API_BASE && API_BASE.length > 0;

// ---- Fetch Helpers ----

async function apiGet(action, params = {}) {
  if (!USE_API) return localGet(action, params);
  try {
    const url = new URL(API_BASE);
    url.searchParams.set('action', action);
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, v);
    });
    const res = await fetch(url.toString());
    return await res.json();
  } catch (err) {
    console.warn('API GET failed, falling back to localStorage:', err);
    return localGet(action, params);
  }
}

async function apiPost(action, body = {}) {
  if (!USE_API) return localPost(action, body);
  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      body: JSON.stringify({ action, ...body })
    });
    return await res.json();
  } catch (err) {
    console.warn('API POST failed, falling back to localStorage:', err);
    return localPost(action, body);
  }
}

// ---- localStorage Fallback Functions ----

function localGet(action, params) {
  switch (action) {
    case 'getUser': {
      const user = loadFromStorage(STORAGE_KEYS.USER);
      if (!user || user.user_id !== params.userId) {
        return { success: false, message: 'User not found' };
      }
      return { success: true, data: user };
    }
    case 'getSemesters': {
      const semesters = loadFromStorage(STORAGE_KEYS.SEMESTERS) || [];
      const filtered = semesters.filter(s => s.user_id === params.userId);
      // Sort by academic_year and semester
      filtered.sort((a, b) => {
        if (a.academic_year !== b.academic_year) return a.academic_year - b.academic_year;
        return a.semester - b.semester;
      });
      return { success: true, data: filtered };
    }
    case 'getEnrollments': {
      const enrollments = loadFromStorage(STORAGE_KEYS.ENROLLMENTS) || [];
      let filtered = enrollments.filter(e => e.user_id === params.userId);
      if (params.semesterId) {
        filtered = filtered.filter(e => e.semester_id === params.semesterId);
      }
      return { success: true, data: filtered };
    }
    case 'getCurriculum': {
      const program = params.program || 'all';
      return { success: true, data: getCurriculumForProgram(program) };
    }
    default:
      return { success: false, message: 'Unknown action' };
  }
}

function localPost(action, body) {
  switch (action) {
    case 'createUser': {
      const user = {
        user_id: body.userId || generateUUID(),
        display_name: body.displayName,
        student_id: body.studentId,
        program: body.program,
        entry_year: parseInt(body.entryYear),
        entry_semester: parseInt(body.entrySemester),
        created_at: new Date().toISOString()
      };
      saveToStorage(STORAGE_KEYS.USER, user);
      return { success: true, data: { user_id: user.user_id } };
    }
    case 'addSemester': {
      const semesters = loadFromStorage(STORAGE_KEYS.SEMESTERS) || [];
      // Check duplicate
      const exists = semesters.find(s =>
        s.user_id === body.userId &&
        s.academic_year === parseInt(body.academicYear) &&
        s.semester === parseInt(body.semester)
      );
      if (exists) {
        return { success: false, message: 'ภาคการศึกษานี้มีอยู่แล้ว' };
      }
      const sem = {
        semester_id: generateUUID(),
        user_id: body.userId,
        academic_year: parseInt(body.academicYear),
        semester: parseInt(body.semester),
        created_at: new Date().toISOString()
      };
      semesters.push(sem);
      saveToStorage(STORAGE_KEYS.SEMESTERS, semesters);
      return { success: true, data: { semester_id: sem.semester_id } };
    }
    case 'addEnrollment': {
      const enrollments = loadFromStorage(STORAGE_KEYS.ENROLLMENTS) || [];
      const enrollment = {
        enrollment_id: generateUUID(),
        semester_id: body.semesterId,
        user_id: body.userId,
        course_code: body.courseCode,
        course_name: body.courseName,
        credits: parseFloat(body.credits),
        grade: body.grade,
        category: body.category,
        is_manual: body.isManual || false,
        created_at: new Date().toISOString()
      };
      enrollments.push(enrollment);
      saveToStorage(STORAGE_KEYS.ENROLLMENTS, enrollments);
      return { success: true, data: { enrollment_id: enrollment.enrollment_id } };
    }
    case 'updateEnrollment': {
      const enrollments = loadFromStorage(STORAGE_KEYS.ENROLLMENTS) || [];
      const idx = enrollments.findIndex(e => e.enrollment_id === body.enrollmentId);
      if (idx === -1) return { success: false, message: 'Enrollment not found' };
      if (body.grade !== undefined) enrollments[idx].grade = body.grade;
      if (body.courseCode !== undefined) enrollments[idx].course_code = body.courseCode;
      if (body.courseName !== undefined) enrollments[idx].course_name = body.courseName;
      if (body.credits !== undefined) enrollments[idx].credits = parseFloat(body.credits);
      if (body.category !== undefined) enrollments[idx].category = body.category;
      saveToStorage(STORAGE_KEYS.ENROLLMENTS, enrollments);
      return { success: true };
    }
    case 'deleteEnrollment': {
      let enrollments = loadFromStorage(STORAGE_KEYS.ENROLLMENTS) || [];
      enrollments = enrollments.filter(e => e.enrollment_id !== body.enrollmentId);
      saveToStorage(STORAGE_KEYS.ENROLLMENTS, enrollments);
      return { success: true };
    }
    case 'deleteSemester': {
      let semesters = loadFromStorage(STORAGE_KEYS.SEMESTERS) || [];
      semesters = semesters.filter(s => s.semester_id !== body.semesterId);
      saveToStorage(STORAGE_KEYS.SEMESTERS, semesters);
      // Also delete enrollments in this semester
      let enrollments = loadFromStorage(STORAGE_KEYS.ENROLLMENTS) || [];
      enrollments = enrollments.filter(e => e.semester_id !== body.semesterId);
      saveToStorage(STORAGE_KEYS.ENROLLMENTS, enrollments);
      return { success: true };
    }
    default:
      return { success: false, message: 'Unknown action' };
  }
}

// ---- Public API Object ----

const API = {
  getUser:          (userId) => apiGet('getUser', { userId }),
  createUser:       (data) => apiPost('createUser', data),
  getSemesters:     (userId) => apiGet('getSemesters', { userId }),
  addSemester:      (data) => apiPost('addSemester', data),
  deleteSemester:   (semesterId) => apiPost('deleteSemester', { semesterId }),
  getEnrollments:   (userId, semesterId) => apiGet('getEnrollments', { userId, semesterId }),
  addEnrollment:    (data) => apiPost('addEnrollment', data),
  updateEnrollment: (data) => apiPost('updateEnrollment', data),
  deleteEnrollment: (enrollmentId) => apiPost('deleteEnrollment', { enrollmentId }),
  getCurriculum:    (program) => apiGet('getCurriculum', { program })
};
