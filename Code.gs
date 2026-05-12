// ============================================================
// Code.gs — ChulaEduTracker API (Google Apps Script)
// คัดลอกไฟล์นี้ไปวางใน Google Apps Script editor
// แล้ว Deploy > New deployment > Web app
// ============================================================

const SPREADSHEET_ID = '15HmeUlELONPI0f33d9XbSG45-xUsAnbGSrFlzXsyYmc'; // ← เปลี่ยนตรงนี้
const SHEET = {
  USERS:       'Users',
  SEMESTERS:   'Semesters',
  ENROLLMENTS: 'Enrollments',
  CURRICULUM:  'Curriculum',
  GRADE_CFG:   'GradeConfig'
};

function doGet(e) {
  const action = e.parameter.action;
  let result;
  try {
    switch(action) {
      case 'getUser':        result = getUser(e.parameter.userId); break;
      case 'getSemesters':   result = getSemesters(e.parameter.userId); break;
      case 'getEnrollments': result = getEnrollments(e.parameter.userId, e.parameter.semesterId); break;
      case 'getCurriculum':  result = getCurriculum(e.parameter.program); break;
      case 'getProgress':    result = getProgress(e.parameter.userId); break;
      case 'getGradeReport': result = getGradeReport(e.parameter.userId); break;
      default: result = { success: false, message: 'Unknown action' };
    }
  } catch(err) {
    result = { success: false, message: err.toString() };
  }
  return buildResponse(result);
}

function doPost(e) {
  const payload = JSON.parse(e.postData.contents);
  const action = payload.action;
  let result;
  try {
    switch(action) {
      case 'createUser':       result = createUser(payload); break;
      case 'addSemester':      result = addSemester(payload); break;
      case 'addEnrollment':    result = addEnrollment(payload); break;
      case 'batchAddEnrollments': result = batchAddEnrollments(payload); break;
      case 'updateEnrollment': result = updateEnrollment(payload); break;
      case 'deleteEnrollment': result = deleteEnrollment(payload); break;
      case 'deleteSemester':   result = deleteSemester(payload); break;
      default: result = { success: false, message: 'Unknown action' };
    }
  } catch(err) {
    result = { success: false, message: err.toString() };
  }
  return buildResponse(result);
}

function buildResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ---- Helpers ----
function getSheet(name) {
  return SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(name);
}

function generateId() {
  return Utilities.getUuid();
}

// ---- Users ----
function getUser(userId) {
  const sheet = getSheet(SHEET.USERS);
  const data = sheet.getDataRange().getValues();
  const row = data.find(r => r[0] === userId);
  if (!row) return { success: false, message: 'User not found' };
  return { success: true, data: { user_id: row[0], display_name: row[1], student_id: row[2], program: row[3], entry_year: row[4], entry_semester: row[5] } };
}

function createUser(payload) {
  const sheet = getSheet(SHEET.USERS);
  const userId = payload.userId || generateId();
  sheet.appendRow([userId, payload.displayName, payload.studentId, payload.program, payload.entryYear, payload.entrySemester, new Date().toISOString()]);
  return { success: true, data: { user_id: userId } };
}

// ---- Semesters ----
function getSemesters(userId) {
  const sheet = getSheet(SHEET.SEMESTERS);
  const data = sheet.getDataRange().getValues();
  const rows = data.filter(r => r[1] === userId);
  return { success: true, data: rows.map(r => ({ semester_id: r[0], user_id: r[1], academic_year: r[2], semester: r[3] })) };
}

function addSemester(payload) {
  const sheet = getSheet(SHEET.SEMESTERS);
  const id = generateId();
  sheet.appendRow([id, payload.userId, parseInt(payload.academicYear), parseInt(payload.semester), new Date().toISOString()]);
  return { success: true, data: { semester_id: id } };
}

function deleteSemester(payload) {
  const sheet = getSheet(SHEET.SEMESTERS);
  const data = sheet.getDataRange().getValues();
  for (let i = data.length - 1; i >= 1; i--) {
    if (data[i][0] === payload.semesterId) { sheet.deleteRow(i + 1); break; }
  }
  // Delete related enrollments
  const enrSheet = getSheet(SHEET.ENROLLMENTS);
  const enrData = enrSheet.getDataRange().getValues();
  for (let i = enrData.length - 1; i >= 1; i--) {
    if (enrData[i][1] === payload.semesterId) enrSheet.deleteRow(i + 1);
  }
  return { success: true };
}

// ---- Enrollments ----
function getEnrollments(userId, semesterId) {
  const sheet = getSheet(SHEET.ENROLLMENTS);
  const data = sheet.getDataRange().getValues();
  let rows = data.filter(r => r[2] === userId);
  if (semesterId) rows = rows.filter(r => r[1] === semesterId);
  return { success: true, data: rows.map(r => ({ enrollment_id: r[0], semester_id: r[1], user_id: r[2], course_code: r[3], course_name: r[4], credits: r[5], grade: r[6], category: r[7], is_manual: r[8] })) };
}

function addEnrollment(payload) {
  const sheet = getSheet(SHEET.ENROLLMENTS);
  const id = generateId();
  sheet.appendRow([id, payload.semesterId, payload.userId, payload.courseCode, payload.courseName, parseFloat(payload.credits), payload.grade, payload.category, payload.isManual || false, new Date().toISOString()]);
  return { success: true, data: { enrollment_id: id } };
}

function batchAddEnrollments(payload) {
  const sheet = getSheet(SHEET.ENROLLMENTS);
  const results = [];
  for (const enr of payload.enrollments) {
    const id = generateId();
    sheet.appendRow([
      id, enr.semesterId, payload.userId,
      enr.courseCode, enr.courseName, parseFloat(enr.credits),
      enr.grade, enr.category, enr.isManual || false,
      new Date().toISOString()
    ]);
    results.push({ enrollment_id: id, course_code: enr.courseCode });
  }
  return { success: true, data: { imported: results.length, details: results } };
}

function updateEnrollment(payload) {
  const sheet = getSheet(SHEET.ENROLLMENTS);
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === payload.enrollmentId) {
      if (payload.grade) sheet.getRange(i + 1, 7).setValue(payload.grade);
      return { success: true };
    }
  }
  return { success: false, message: 'Enrollment not found' };
}

function deleteEnrollment(payload) {
  const sheet = getSheet(SHEET.ENROLLMENTS);
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === payload.enrollmentId) { sheet.deleteRow(i + 1); return { success: true }; }
  }
  return { success: false, message: 'Not found' };
}

// ---- Curriculum ----
function getCurriculum(program) {
  const sheet = getSheet(SHEET.CURRICULUM);
  const data = sheet.getDataRange().getValues();
  let rows = data.slice(1);
  if (program && program !== 'all') rows = rows.filter(r => r[9] === 'all' || r[9] === program);
  return { success: true, data: rows.map(r => ({ course_code: r[0], course_name: r[1], credits: r[2], category: r[3], is_required: r[4], recommended_year: r[5], recommended_semester: r[6], prerequisite: r[7], subcategory: r[8], program: r[9] })) };
}
