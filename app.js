// ============================================================
// app.js — Main Application Controller - ChulaEduTracker
// ============================================================

let currentUser = null;
let semesters = [];
let enrollments = [];
let curriculum = [];
let selectedCourse = null;

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  populateDropdowns();
  const saved = loadFromStorage(STORAGE_KEYS.USER);
  if (saved) { currentUser = saved; showApp(); }
});

function populateDropdowns() {
  const gradeSelect = document.getElementById('course-grade');
  GRADE_OPTIONS.forEach(g => { const o = document.createElement('option'); o.value = g; o.textContent = g; gradeSelect.appendChild(o); });
  const catSelect = document.getElementById('manual-category');
  GE_CATEGORIES.forEach(c => { const o = document.createElement('option'); o.value = c.value; o.textContent = c.label; catSelect.appendChild(o); });
}

// ---- Registration ----
async function handleRegister(e) {
  e.preventDefault();
  const data = {
    displayName: document.getElementById('reg-name').value.trim(),
    studentId: document.getElementById('reg-student-id').value.trim(),
    program: document.getElementById('reg-program').value,
    entryYear: parseInt(document.getElementById('reg-entry-year').value),
    entrySemester: parseInt(document.getElementById('reg-entry-sem').value)
  };
  const res = await API.createUser(data);
  if (res.success) {
    currentUser = { user_id: res.data.user_id, display_name: data.displayName, student_id: data.studentId, program: data.program, entry_year: data.entryYear, entry_semester: data.entrySemester };
    saveToStorage(STORAGE_KEYS.USER, currentUser);
    showApp();
    showToast('ลงทะเบียนสำเร็จ!', 'success');
  }
}

function showApp() {
  document.getElementById('register-screen').style.display = 'none';
  document.getElementById('app-container').style.display = 'block';
  document.getElementById('user-info').style.display = 'flex';
  document.getElementById('user-display-name').textContent = currentUser.display_name;
  curriculum = getCurriculumForProgram(currentUser.program);
  loadAllData();
}

function handleLogout() {
  if (!confirm('ต้องการออกจากระบบ? (ข้อมูลจะยังอยู่ใน localStorage)')) return;
  currentUser = null;
  document.getElementById('register-screen').style.display = 'flex';
  document.getElementById('app-container').style.display = 'none';
  document.getElementById('user-info').style.display = 'none';
  localStorage.removeItem(STORAGE_KEYS.USER);
}

// ---- Data Loading ----
async function loadAllData() {
  const semRes = await API.getSemesters(currentUser.user_id);
  semesters = semRes.success ? semRes.data : [];
  const enrRes = await API.getEnrollments(currentUser.user_id);
  enrollments = enrRes.success ? enrRes.data : [];
  renderAll();
}

function renderAll() {
  renderDashboard();
  renderCourses();
  renderAnalysis();
  renderPlanning();
}

// ---- Tab Switching ----
function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === 'panel-' + tab));
}

// ---- Modal ----
function showModal(id) { document.getElementById(id).classList.add('show'); }
function closeModal(id) { document.getElementById(id).classList.remove('show'); }

// ---- Dashboard ----
function renderDashboard() {
  const progress = calcProgress(enrollments, curriculum);
  const semGrades = [];
  const semGroups = groupBy(enrollments, 'semester_id');
  Object.values(semGroups).forEach(courses => semGrades.push(calcSemesterGrade(courses)));
  const cumul = calcCumulative(semGrades);

  // Stats cards
  document.getElementById('stats-grid').innerHTML = `
    <div class="stat-card"><div class="stat-icon">📚</div><div class="stat-value">${progress.totalEarned}</div><div class="stat-label">หน่วยกิตที่สะสม</div></div>
    <div class="stat-card"><div class="stat-icon">📝</div><div class="stat-value">${progress.remaining}</div><div class="stat-label">ยังต้องลงอีก</div></div>
    <div class="stat-card"><div class="stat-icon">📈</div><div class="stat-value">${cumul.GPAX !== null ? cumul.GPAX.toFixed(2) : '-'}</div><div class="stat-label">GPAX สะสม</div></div>
    <div class="stat-card"><div class="stat-icon">🎯</div><div class="stat-value">${Math.round(progress.totalEarned / progress.totalRequired * 100)}%</div><div class="stat-label">ความสำเร็จรวม</div></div>
  `;

  // Progress bars
  const bars = [
    { label: 'วิชาศึกษาทั่วไป (Gen-Ed)', earned: progress.geTotal, required: 30 },
    { label: 'วิชาครู', earned: progress.prof.earned, required: 36 },
    { label: 'วิชาเอกบังคับ', earned: progress.majorCore.earned, required: 40 },
    { label: 'วิชาเอกเลือก', earned: progress.majorElec.total, required: 20 },
    { label: 'วิชาเลือกเสรี', earned: progress.freeElec.earned, required: 6 }
  ];
  document.getElementById('progress-bars').innerHTML = bars.map(b => {
    const pct = Math.min(100, Math.round(b.earned / b.required * 100));
    const cls = pct >= 100 ? 'complete' : pct >= 60 ? '' : 'warning';
    return `<div class="progress-item"><div class="progress-header"><span class="progress-label">${b.label}</span><span class="progress-value">${b.earned}/${b.required} นก.</span></div><div class="progress-bar"><div class="progress-fill ${cls}" style="width:${pct}%"></div></div></div>`;
  }).join('');

  // Missing required
  const missing = [...progress.prof.missing, ...progress.majorCore.missing];
  document.getElementById('missing-list').innerHTML = missing.length === 0
    ? '<li style="color:var(--success);padding:12px">✅ ลงวิชาบังคับครบแล้ว!</li>'
    : missing.map(c => `<li class="missing-item"><span class="missing-icon">⚠️</span><span>${c.course_code} ${c.course_name}</span><span class="missing-credits">${c.credits} นก.</span></li>`).join('');

  // Graduation check
  renderGraduationCheck(progress);
}

function renderGraduationCheck(progress) {
  const checks = [
    { label: `Gen-Ed: ${progress.geTotal}/30 นก.`, pass: progress.geTotal >= 30 },
    { label: `วิชาครู: ${progress.prof.earned}/36 นก.`, pass: progress.prof.earned >= 36 && progress.prof.missing.length === 0, warn: progress.prof.missing.length > 0 },
    { label: `วิชาเอกบังคับ: ${progress.majorCore.earned}/40 นก.`, pass: progress.majorCore.earned >= 40 && progress.majorCore.missing.length === 0 },
    { label: `วิชาเอกเลือก (ด้านเทคโนโลยีฯ): ${progress.majorElec.elecEt.earned}/9 นก.`, pass: progress.majorElec.elecEt.earned >= 9 },
    { label: `วิชาเอกเลือก (ด้านคอมพิวเตอร์ฯ): ${progress.majorElec.elecCs.earned}/5 นก.`, pass: progress.majorElec.elecCs.earned >= 5 },
    { label: `วิชาเอกเลือก (ตามกลุ่มวิชา): ${progress.majorElec.elecGroup.earned}/6 นก.`, pass: progress.majorElec.elecGroup.earned >= 6 },
    { label: `วิชาเลือกเสรี: ${progress.freeElec.earned}/6 นก.`, pass: progress.freeElec.earned >= 6 },
    { label: `รวมทั้งหมด: ${progress.totalEarned}/${progress.totalRequired} นก.`, pass: progress.canGraduate }
  ];
  document.getElementById('graduation-check').innerHTML = checks.map(c => {
    const cls = c.pass ? 'check-pass' : 'check-fail';
    const icon = c.pass ? '✅' : '❌';
    return `<div class="check-item ${cls}">${icon} ${c.label}</div>`;
  }).join('');
}

// ---- Courses Tab ----
function renderCourses() {
  const list = document.getElementById('semesters-list');
  const empty = document.getElementById('courses-empty');
  if (semesters.length === 0) { list.innerHTML = ''; empty.style.display = 'block'; return; }
  empty.style.display = 'none';

  list.innerHTML = semesters.map(sem => {
    const semEnr = enrollments.filter(e => e.semester_id === sem.semester_id);
    const grade = calcSemesterGrade(semEnr);
    return `
    <div class="semester-group" data-sem-id="${sem.semester_id}">
      <div class="semester-header" onclick="toggleSemester(this)">
        <div class="semester-title">📁 ${getSemesterDisplayText(sem.academic_year, sem.semester)}</div>
        <div class="semester-meta">
          <span>${semEnr.length} วิชา</span>
          <span>${grade.CA} นก.</span>
          <span>GPA: ${grade.GPA !== null ? grade.GPA.toFixed(2) : '-'}</span>
          <span class="semester-chevron">▼</span>
        </div>
      </div>
      <div class="semester-body">
        ${semEnr.length > 0 ? `<table class="data-table"><thead><tr><th>รหัส</th><th>ชื่อวิชา</th><th>นก.</th><th>เกรด</th><th>หมวด</th><th></th></tr></thead><tbody>
          ${semEnr.map(e => `<tr><td>${e.course_code}</td><td>${e.course_name}</td><td>${e.credits}</td><td><span class="grade-badge ${getGradeBadgeClass(e.grade)}">${e.grade}</span></td><td><span style="font-size:11px;color:var(--text-muted)">${CATEGORY_LABELS[e.category] || e.category}</span></td><td class="actions"><button class="btn-icon" title="แก้ไข" onclick="editCourse('${e.enrollment_id}')">✏️</button><button class="btn-icon" title="ลบ" onclick="deleteCourse('${e.enrollment_id}')">🗑️</button></td></tr>`).join('')}
        </tbody></table>` : '<p style="color:var(--text-muted);font-size:13px;padding:8px">ยังไม่มีวิชา</p>'}
        <div class="semester-summary">GPA ภาคนี้: <span>${grade.GPA !== null ? grade.GPA.toFixed(2) : '-'}</span>&nbsp;|&nbsp;หน่วยกิต: <span>${grade.CA}</span></div>
        <div style="display:flex;gap:8px;margin-top:8px">
          <button class="btn btn-primary btn-sm" onclick="showAddCourseModal('${sem.semester_id}')">+ เพิ่มวิชา</button>
          <button class="btn btn-danger btn-sm" onclick="deleteSemester('${sem.semester_id}')">ลบภาคนี้</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function toggleSemester(el) {
  el.classList.toggle('open');
  el.nextElementSibling.classList.toggle('open');
}

// ---- Add Semester ----
function showAddSemesterModal() {
  const yearInput = document.getElementById('sem-year');
  if (!yearInput.value) yearInput.value = new Date().getFullYear() + 543;
  showModal('modal-add-semester');
}

async function handleAddSemester(e) {
  e.preventDefault();
  const res = await API.addSemester({ userId: currentUser.user_id, academicYear: document.getElementById('sem-year').value, semester: document.getElementById('sem-term').value });
  if (res.success) { closeModal('modal-add-semester'); await loadAllData(); showToast('เพิ่มภาคการศึกษาสำเร็จ', 'success'); }
  else showToast(res.message || 'เกิดข้อผิดพลาด', 'error');
}

async function deleteSemester(semId) {
  const semEnr = enrollments.filter(e => e.semester_id === semId);
  if (!confirm(`ลบภาคการศึกษานี้? (มี ${semEnr.length} วิชา จะถูกลบด้วย)`)) return;
  await API.deleteSemester(semId);
  await loadAllData();
  showToast('ลบภาคการศึกษาสำเร็จ', 'success');
}

// ---- Add/Edit Course ----
function showAddCourseModal(semId) {
  document.getElementById('course-modal-title').textContent = 'เพิ่มรายวิชา';
  document.getElementById('course-edit-id').value = '';
  document.getElementById('course-semester-id').value = semId;
  document.getElementById('course-grade').value = '';
  document.getElementById('course-search').value = '';
  document.getElementById('selected-course-info').style.display = 'none';
  document.querySelector('input[name="courseType"][value="curriculum"]').checked = true;
  toggleCourseType('curriculum');
  selectedCourse = null;
  showModal('modal-add-course');
}

function editCourse(enrollmentId) {
  const enr = enrollments.find(e => e.enrollment_id === enrollmentId);
  if (!enr) return;
  document.getElementById('course-modal-title').textContent = 'แก้ไขรายวิชา';
  document.getElementById('course-edit-id').value = enrollmentId;
  document.getElementById('course-semester-id').value = enr.semester_id;
  document.getElementById('course-grade').value = enr.grade;
  if (enr.is_manual) {
    document.querySelector('input[name="courseType"][value="manual"]').checked = true;
    toggleCourseType('manual');
    document.getElementById('manual-code').value = enr.course_code;
    document.getElementById('manual-name').value = enr.course_name;
    document.getElementById('manual-credits').value = enr.credits;
    document.getElementById('manual-category').value = enr.category;
  } else {
    document.querySelector('input[name="courseType"][value="curriculum"]').checked = true;
    toggleCourseType('curriculum');
    selectedCourse = { course_code: enr.course_code, course_name: enr.course_name, credits: enr.credits, category: enr.category };
    showSelectedCourse(selectedCourse);
  }
  showModal('modal-add-course');
}

function toggleCourseType(type) {
  document.getElementById('curriculum-search-section').style.display = type === 'curriculum' ? 'block' : 'none';
  document.getElementById('manual-entry-section').style.display = type === 'manual' ? 'block' : 'none';
}

function handleCourseSearch(query) {
  const results = document.getElementById('search-results');
  if (query.length < 2) { results.classList.remove('show'); return; }
  const matches = searchCourses(query).slice(0, 10);
  if (matches.length === 0) { results.innerHTML = '<div class="search-result-item" style="color:var(--text-muted)">ไม่พบวิชา</div>'; results.classList.add('show'); return; }
  results.innerHTML = matches.map(c => `<div class="search-result-item" onclick="selectCourse('${c.course_code}')"><span class="course-code">${c.course_code}</span>${c.course_name} (${c.credits} นก.)</div>`).join('');
  results.classList.add('show');
}

function selectCourse(code) {
  const course = findCourseByCode(code);
  if (!course) return;
  selectedCourse = course;
  showSelectedCourse(course);
  document.getElementById('search-results').classList.remove('show');
  document.getElementById('course-search').value = '';
}

function showSelectedCourse(course) {
  document.getElementById('selected-course-info').style.display = 'block';
  document.getElementById('selected-course-name').textContent = course.course_name;
  document.getElementById('selected-course-code').textContent = course.course_code;
  document.getElementById('selected-course-credits').textContent = course.credits;
  document.getElementById('selected-course-category').textContent = CATEGORY_LABELS[course.category] || course.category;
}

async function handleSaveCourse(e) {
  e.preventDefault();
  const editId = document.getElementById('course-edit-id').value;
  const semId = document.getElementById('course-semester-id').value;
  const grade = document.getElementById('course-grade').value;
  const isManual = document.querySelector('input[name="courseType"]:checked').value === 'manual';

  if (!grade) { showToast('กรุณาเลือกเกรด', 'warning'); return; }

  let courseData;
  if (isManual) {
    const code = document.getElementById('manual-code').value.trim();
    const name = document.getElementById('manual-name').value.trim();
    const credits = document.getElementById('manual-credits').value;
    const category = document.getElementById('manual-category').value;
    if (!code || !name || !credits || !category) { showToast('กรุณากรอกข้อมูลให้ครบ', 'warning'); return; }
    courseData = { courseCode: code, courseName: name, credits: parseFloat(credits), category, isManual: true };
  } else {
    if (!selectedCourse) { showToast('กรุณาเลือกวิชา', 'warning'); return; }
    courseData = { courseCode: selectedCourse.course_code, courseName: selectedCourse.course_name, credits: selectedCourse.credits, category: selectedCourse.category, isManual: false };
  }

  if (editId) {
    await API.updateEnrollment({ enrollmentId: editId, grade, ...courseData });
    showToast('แก้ไขวิชาสำเร็จ', 'success');
  } else {
    await API.addEnrollment({ semesterId: semId, userId: currentUser.user_id, grade, ...courseData });
    showToast('เพิ่มวิชาสำเร็จ', 'success');
  }
  closeModal('modal-add-course');
  selectedCourse = null;
  await loadAllData();
}

async function deleteCourse(enrollmentId) {
  if (!confirm('ต้องการลบวิชานี้?')) return;
  await API.deleteEnrollment(enrollmentId);
  await loadAllData();
  showToast('ลบวิชาสำเร็จ', 'success');
}

// ---- Analysis Tab ----
function renderAnalysis() {
  const container = document.getElementById('grade-report');
  const empty = document.getElementById('analysis-empty');
  if (enrollments.length === 0) { container.innerHTML = ''; empty.style.display = 'block'; return; }
  empty.style.display = 'none';

  const semGrades = [];
  let html = '';

  semesters.forEach(sem => {
    const semEnr = enrollments.filter(e => e.semester_id === sem.semester_id);
    if (semEnr.length === 0) return;
    const sg = calcSemesterGrade(semEnr);
    semGrades.push(sg);

    html += `<div class="card" style="margin-bottom:16px">
      <h3 class="section-title">📅 ${getSemesterDisplayText(sem.academic_year, sem.semester)}</h3>
      <table class="data-table"><thead><tr><th>รหัส</th><th>ชื่อวิชา</th><th>นก.</th><th>หมวด</th><th>เกรด</th><th>Grade Pt</th><th>Q×W</th></tr></thead><tbody>
      ${semEnr.map(e => {
        const gp = GRADE_POINTS[e.grade];
        const qw = gp !== null ? (gp * e.credits).toFixed(1) : '-';
        return `<tr><td>${e.course_code}</td><td>${e.course_name}</td><td>${e.credits}</td><td style="font-size:11px;color:var(--text-muted)">${CATEGORY_LABELS[e.category] || e.category}</td><td><span class="grade-badge ${getGradeBadgeClass(e.grade)}">${e.grade}</span></td><td>${gp !== null ? gp.toFixed(1) : '-'}</td><td>${qw}</td></tr>`;
      }).join('')}
      </tbody></table>
      <div class="grade-summary-box"><div class="grade-summary-grid">
        <div class="grade-summary-item"><div class="label">CA</div><div class="value">${sg.CA}</div></div>
        <div class="grade-summary-item"><div class="label">CG</div><div class="value">${sg.CG}</div></div>
        <div class="grade-summary-item"><div class="label">GP</div><div class="value">${sg.GP}</div></div>
        <div class="grade-summary-item"><div class="label">GPA</div><div class="value">${sg.GPA !== null ? sg.GPA.toFixed(2) : '-'}</div></div>
      </div></div></div>`;
  });

  const cumul = calcCumulative(semGrades);
  html += `<div class="card"><h3 class="section-title">📊 สรุปรวมทุกภาค</h3>
    <div class="grade-summary-box"><div class="grade-summary-grid">
      <div class="grade-summary-item"><div class="label">CAX</div><div class="value">${cumul.CAX}</div></div>
      <div class="grade-summary-item"><div class="label">CGX</div><div class="value">${cumul.CGX}</div></div>
      <div class="grade-summary-item"><div class="label">GPX</div><div class="value">${cumul.GPX}</div></div>
      <div class="grade-summary-item"><div class="label">GPAX</div><div class="value">${cumul.GPAX !== null ? cumul.GPAX.toFixed(2) : '-'}</div></div>
    </div></div></div>`;

  container.innerHTML = html;
}

function exportGradeReport() {
  if (enrollments.length === 0) { showToast('ไม่มีข้อมูลให้ Export', 'warning'); return; }
  const data = enrollments.map(e => {
    const sem = semesters.find(s => s.semester_id === e.semester_id);
    const gp = GRADE_POINTS[e.grade];
    return {
      'ปีการศึกษา': sem ? sem.academic_year : '', 'ภาค': sem ? getSemesterLabel(sem.semester) : '',
      'รหัสวิชา': e.course_code, 'ชื่อวิชา': e.course_name, 'หน่วยกิต': e.credits,
      'หมวด': CATEGORY_LABELS[e.category] || e.category, 'เกรด': e.grade,
      'Grade Point': gp !== null ? gp : '', 'QxW': gp !== null ? (gp * e.credits).toFixed(1) : ''
    };
  });
  exportToCSV(data, `ChulaEduTracker_${currentUser.student_id}_${new Date().toISOString().slice(0,10)}.csv`);
  showToast('Export CSV สำเร็จ', 'success');
}

// ---- Planning Tab ----
function renderPlanning() {
  if (enrollments.length === 0) {
    document.getElementById('prediction-result').innerHTML = '<p style="color:var(--text-muted)">กรุณาเพิ่มข้อมูลวิชาก่อนใช้งานฟีเจอร์นี้</p>';
    return;
  }
  const progress = calcProgress(enrollments, curriculum);
  const latestSem = semesters.length > 0 ? semesters[semesters.length - 1] : null;
  const curYear = latestSem ? latestSem.academic_year : currentUser.entry_year;
  const curSem = latestSem ? latestSem.semester : currentUser.entry_semester;

  const pred = predictGraduation(enrollments, progress, curYear, curSem);
  if (pred) {
    const cls = pred.isOnTrack ? '' : 'warning';
    document.getElementById('prediction-result').innerHTML = `
      <div class="prediction-box ${cls}">
        <div style="font-size:16px;font-weight:600;margin-bottom:12px">${pred.message}</div>
        <div class="grade-summary-grid">
          <div class="grade-summary-item"><div class="label">เฉลี่ย นก./ภาค</div><div class="value">${pred.avgCreditsPerSem}</div></div>
          <div class="grade-summary-item"><div class="label">นก. ที่เหลือ</div><div class="value">${pred.remainingCredits}</div></div>
          <div class="grade-summary-item"><div class="label">ภาคที่เหลือ</div><div class="value">${pred.semsNeeded}</div></div>
          <div class="grade-summary-item"><div class="label">คาดจบ</div><div class="value">${pred.semsNeeded > 0 ? pred.predictedSem + '/' + pred.predictedYear : '🎉'}</div></div>
        </div>
      </div>`;
  }
}

function generatePlanUI() {
  const targetYear = parseInt(document.getElementById('plan-target-year').value);
  const targetSem = parseInt(document.getElementById('plan-target-sem').value);
  const maxCredits = parseInt(document.getElementById('plan-max-credits').value);
  if (!targetYear) { showToast('กรุณากรอกปีที่ต้องการจบ', 'warning'); return; }

  const progress = calcProgress(enrollments, curriculum);
  const latestSem = semesters.length > 0 ? semesters[semesters.length - 1] : null;
  const curYear = latestSem ? latestSem.academic_year : currentUser.entry_year;
  const curSem = latestSem ? latestSem.semester : currentUser.entry_semester;

  const result = generatePlan(progress, curriculum, targetYear, targetSem, curYear, curSem, maxCredits);
  let html = '';
  if (!result.feasible) {
    html += `<div class="prediction-box warning" style="margin-bottom:16px">⚠️ ไม่สามารถจบตามเป้าได้ ต้องการ ${result.totalSemesters} ภาค แต่มีเพียง ${result.availableSemesters} ภาค</div>`;
  } else {
    html += `<div class="prediction-box" style="margin-bottom:16px">✅ เป็นไปได้! ใช้ ${result.totalSemesters} ภาค จาก ${result.availableSemesters} ภาคที่เหลือ</div>`;
  }
  result.plan.forEach(p => {
    html += `<div class="plan-semester">
      <div class="plan-semester-title"><span>📅 ภาค ${p.semesterLabel}</span><span>${p.totalCredits} นก.</span></div>
      ${p.courses.map(c => `<div class="plan-course"><span>${c.course_code} ${c.course_name}</span><span>${c.credits} นก.</span></div>`).join('')}
    </div>`;
  });
  document.getElementById('plan-result').innerHTML = html;
}

// Close modal on overlay click
document.addEventListener('click', e => { if (e.target.classList.contains('modal-overlay')) e.target.classList.remove('show'); });
// Close search results on outside click
document.addEventListener('click', e => { if (!e.target.closest('.search-wrapper')) document.getElementById('search-results')?.classList.remove('show'); });
