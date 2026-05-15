// ============================================================
// calculator.js — Grade & Progress Calculation Engine
// ChulaEduTracker
// ============================================================

/**
 * คำนวณ CA, CG, GP, GPA ของภาคเดียว
 * @param {Array} courses - รายวิชาในภาคนั้น
 * @returns {{ CA: number, CG: number, GP: number, GPA: number|null }}
 */
function calcSemesterGrade(courses) {
  let CA = 0, CG = 0, GP = 0;
  courses.forEach(c => {
    const credits = parseFloat(c.credits);
    // CA = ทุกวิชาที่ลงทะเบียน
    CA += credits;
    
    // CG = ทุกวิชายกเว้น W, I และ FOUND (ตามระบบ CU: CG = CA ลบ W และ I)
    // S และ P นับใน CG แต่ไม่มี grade point จึงไม่นับใน GP
    if (c.grade !== 'W' && c.grade !== 'I' && c.category !== 'FOUND') {
      CG += credits;
      if (GPA_COUNTED.has(c.grade)) {
        GP += GRADE_POINTS[c.grade] * credits;
      }
    }
  });
  return {
    CA,
    CG,
    GP: +GP.toFixed(2),
    GPA: CG > 0 ? +(GP / CG).toFixed(2) : null
  };
}

/**
 * คำนวณ CAX, CGX, GPX, GPAX สะสมจากทุกภาค
 * @param {Array} semesterGrades - ผลลัพธ์จาก calcSemesterGrade ของแต่ละภาค
 * @returns {{ CAX: number, CGX: number, GPX: number, GPAX: number|null }}
 */
function calcCumulative(semesterGrades) {
  let CAX = 0, CGX = 0, GPX = 0;
  semesterGrades.forEach(s => {
    CAX += s.CA;
    CGX += s.CG;
    GPX += s.GP;
  });
  return {
    CAX,
    CGX,
    GPX: +GPX.toFixed(2),
    GPAX: CGX > 0 ? +(GPX / CGX).toFixed(2) : null
  };
}

/**
 * ตรวจสอบความก้าวหน้าตามหลักสูตร
 * @param {Array} enrollments - วิชาที่ลงทะเบียนทั้งหมด
 * @param {Array} curriculum - ข้อมูลหลักสูตร
 * @returns {Object} progress object
 */
function calcProgress(enrollments, curriculum) {
  const passed = enrollments.filter(e => PASSED_GRADES.has(e.grade));
  const passedCodes = new Set(passed.map(e => e.course_code));

  // รวมหน่วยกิตที่ผ่านตามหมวด
  const earned = {};
  passed.forEach(e => {
    if (e.category !== 'FOUND') { // ไม่นับวิชาพื้นฐาน
      earned[e.category] = (earned[e.category] || 0) + parseFloat(e.credits);
    }
  });

  // Gen-Ed breakdown
  const ge = {};
  Object.keys(CATEGORY_RULES.GE.sub).forEach(key => {
    ge[key] = {
      earned: earned[key] || 0,
      required: CATEGORY_RULES.GE.sub[key].required,
      label: CATEGORY_RULES.GE.sub[key].label
    };
  });
  const geTotal = Object.values(ge).reduce((s, v) => s + v.earned, 0);

  // วิชาครู
  const profMissing = curriculum
    .filter(c => c.category === 'PROF' && c.is_required && !passedCodes.has(c.course_code));
  const prof = {
    earned: earned['PROF'] || 0,
    required: CATEGORY_RULES.PROF.total_required,
    missing: profMissing,
    label: CATEGORY_RULES.PROF.label
  };

  // วิชาเอกบังคับ
  const majorCoreMissing = curriculum
    .filter(c => c.category === 'MAJOR_CORE' && c.is_required && !passedCodes.has(c.course_code));
  const majorCore = {
    earned: earned['MAJOR_CORE'] || 0,
    required: CATEGORY_RULES.MAJOR_CORE.total_required,
    missing: majorCoreMissing,
    label: CATEGORY_RULES.MAJOR_CORE.label
  };

  // วิชาเอกเลือก
  const elecEtLimit = CATEGORY_RULES.MAJOR_ELEC.sub.MAJOR_ELEC_ET.required;
  const elecCsLimit = CATEGORY_RULES.MAJOR_ELEC.sub.MAJOR_ELEC_CS.required;
  const elecGroupLimit = CATEGORY_RULES.MAJOR_ELEC.sub.MAJOR_ELEC_GROUP.required;
  let elecEtEarned = earned['MAJOR_ELEC_ET'] || 0;
  let elecCsEarned = earned['MAJOR_ELEC_CS'] || 0;
  let elecGroupEarned = earned['MAJOR_ELEC_GROUP'] || 0;
  
  const majorElec = {
    total: elecEtEarned + elecCsEarned + elecGroupEarned,
    required: CATEGORY_RULES.MAJOR_ELEC.total_required,
    elecEt: { earned: elecEtEarned, required: elecEtLimit },
    elecCs: { earned: elecCsEarned, required: elecCsLimit },
    elecGroup: { earned: elecGroupEarned, required: elecGroupLimit },
    label: CATEGORY_RULES.MAJOR_ELEC.label
  };

  // วิชาเลือกเสรี
  const freeElec = {
    earned: earned['FREE_ELEC'] || 0,
    required: CATEGORY_RULES.FREE_ELEC.total_required,
    label: CATEGORY_RULES.FREE_ELEC.label
  };

  const totalEarned = geTotal + prof.earned + majorCore.earned + majorElec.total + freeElec.earned;

  return {
    ge,
    geTotal,
    prof,
    majorCore,
    majorElec,
    freeElec,
    totalEarned,
    totalRequired: TOTAL_CREDITS_REQUIRED,
    remaining: Math.max(0, TOTAL_CREDITS_REQUIRED - totalEarned),
    canGraduate: (
      geTotal >= CATEGORY_RULES.GE.total_required &&
      prof.earned >= prof.required && prof.missing.length === 0 &&
      majorCore.earned >= majorCore.required && majorCore.missing.length === 0 &&
      majorElec.elecEt.earned >= majorElec.elecEt.required &&
      majorElec.elecCs.earned >= majorElec.elecCs.required &&
      majorElec.total >= majorElec.required &&
      totalEarned >= TOTAL_CREDITS_REQUIRED
    )
  };
}

/**
 * คาดคะเนภาคการศึกษาที่จะจบ
 */
function predictGraduation(enrollments, progress, currentYear, currentSem) {
  const semGroups = groupBy(enrollments.filter(e => e.category !== 'FOUND'), 'semester_id');
  const semCount = Object.keys(semGroups).length;
  if (semCount === 0) return null;

  const totalEnrolled = enrollments
    .filter(e => e.category !== 'FOUND')
    .reduce((s, e) => s + parseFloat(e.credits), 0);
  const avgPerSem = totalEnrolled / semCount;

  const remaining = progress.remaining;
  if (remaining <= 0) {
    return {
      avgCreditsPerSem: +avgPerSem.toFixed(1),
      remainingCredits: 0,
      semsNeeded: 0,
      predictedYear: currentYear,
      predictedSem: currentSem,
      isOnTrack: true,
      message: '🎉 ครบหน่วยกิตแล้ว!'
    };
  }

  const semsNeeded = Math.ceil(remaining / avgPerSem);

  let y = currentYear, s = currentSem;
  for (let i = 0; i < semsNeeded; i++) {
    s++;
    if (s > 2) { s = 1; y++; }
  }

  const maxSems = 8;
  const isOnTrack = (semCount + semsNeeded) <= maxSems;

  return {
    avgCreditsPerSem: +avgPerSem.toFixed(1),
    remainingCredits: remaining,
    semsNeeded,
    predictedYear: y,
    predictedSem: s,
    isOnTrack,
    message: isOnTrack
      ? `✅ คาดว่าจบได้ภายใน ${maxSems} ภาค`
      : `⚠️ คาดว่าใช้ ${semCount + semsNeeded} ภาค (เกิน ${maxSems} ภาค) ควรเพิ่มวิชา/ภาค`
  };
}

/**
 * สร้างแผนการลงทะเบียนตามเป้าหมาย
 */
function generatePlan(progress, curriculum, targetYear, targetSem, currentYear, currentSem, maxCreditsPerSem) {
  // ตรวจว่า target อยู่ในอดีตหรือไม่
  const targetPast =
    targetYear < currentYear ||
    (targetYear === currentYear && targetSem <= currentSem);
  if (targetPast) {
    return { plan: [], feasible: false, totalSemesters: 0, availableSemesters: 0, error: 'ปีการศึกษาที่ต้องการจบผ่านไปแล้ว กรุณาเลือกใหม่' };
  }

  // หาวิชาที่ยังต้องลง (บังคับก่อน)
  let remaining = [
    ...progress.prof.missing,
    ...progress.majorCore.missing
  ];

  // เพิ่มวิชาเลือกที่ยังต้องการ
  const elecEtNeeded = Math.max(0, progress.majorElec.elecEt.required - progress.majorElec.elecEt.earned);
  const elecCsNeeded = Math.max(0, progress.majorElec.elecCs.required - progress.majorElec.elecCs.earned);
  const elecGroupNeeded = Math.max(0, progress.majorElec.elecGroup.required - progress.majorElec.elecGroup.earned);

  const fillElec = (category, neededCredits) => {
    if (neededCredits > 0) {
      const available = curriculum.filter(c =>
        c.category === category &&
        !remaining.find(r => r.course_code === c.course_code)
      );
      let collected = 0;
      for (const c of available) {
        if (collected >= neededCredits) break;
        remaining.push(c);
        collected += c.credits;
      }
    }
  };

  fillElec('MAJOR_ELEC_ET', elecEtNeeded);
  fillElec('MAJOR_ELEC_CS', elecCsNeeded);
  fillElec('MAJOR_ELEC_GROUP', elecGroupNeeded);

  // Sort by recommended year/semester
  remaining.sort((a, b) =>
    (a.recommended_year * 10 + a.recommended_semester) -
    (b.recommended_year * 10 + b.recommended_semester)
  );

  // คำนวณจำนวนภาคที่เหลือ
  let semsAvailable = 0;
  let y = currentYear, s = currentSem;
  while (y < targetYear || (y === targetYear && s <= targetSem)) {
    semsAvailable++;
    s++;
    if (s > 2) { s = 1; y++; }
    if (semsAvailable > 20) break; // safety
  }

  // แจกวิชาเข้าแต่ละภาค
  const plan = [];
  let creditsUsed = 0;
  let semCourses = [];
  let planSemIdx = 0;

  // สร้าง semester labels
  const semLabels = [];
  y = currentYear; s = currentSem;
  for (let i = 0; i < Math.max(semsAvailable, 10); i++) {
    s++;
    if (s > 2) { s = 1; y++; }
    semLabels.push({ year: y, sem: s });
  }

  remaining.forEach(course => {
    if (creditsUsed + parseFloat(course.credits) > maxCreditsPerSem && semCourses.length > 0) {
      const label = semLabels[planSemIdx] || { year: '?', sem: '?' };
      plan.push({
        semesterLabel: `${label.sem}/${label.year}`,
        courses: semCourses,
        totalCredits: creditsUsed
      });
      semCourses = [];
      creditsUsed = 0;
      planSemIdx++;
    }
    semCourses.push(course);
    creditsUsed += parseFloat(course.credits);
  });
  if (semCourses.length > 0) {
    const label = semLabels[planSemIdx] || { year: '?', sem: '?' };
    plan.push({
      semesterLabel: `${label.sem}/${label.year}`,
      courses: semCourses,
      totalCredits: creditsUsed
    });
    planSemIdx++;
  }

  return {
    plan,
    feasible: planSemIdx <= semsAvailable,
    totalSemesters: planSemIdx,
    availableSemesters: semsAvailable
  };
}

/**
 * Helper: จัดกลุ่มตาม key
 */
function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    (acc[item[key]] = acc[item[key]] || []).push(item);
    return acc;
  }, {});
}
