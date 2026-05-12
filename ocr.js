// ============================================================
// ocr.js — CR60 PDF Scanner & Parser
// ============================================================

let currentOcrData = [];

function openOcrModal() {
  document.getElementById('ocr-modal').classList.add('show');
  document.getElementById('cr60-file').value = '';
  document.getElementById('ocr-status').innerText = '';
  document.getElementById('ocr-results').style.display = 'none';
  document.getElementById('btn-ocr-confirm').disabled = true;
  currentOcrData = [];
}

function closeOcrModal() {
  document.getElementById('ocr-modal').classList.remove('show');
}

// No need to setup listeners manually, handled by onchange in index.html

async function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  const statusEl = document.getElementById('ocr-status');
  statusEl.innerText = 'กำลังประมวลผล PDF...';
  
  try {
    const text = await extractTextFromPDF(file);
    const parsedData = parseCR60Text(text);
    
    if (parsedData.length === 0) {
      statusEl.innerText = 'ไม่พบข้อมูลรายวิชาในไฟล์นี้ กรุณาตรวจสอบว่าเป็นไฟล์ CR60 ที่ถูกต้อง';
      return;
    }
    
    statusEl.innerText = 'ประมวลผลสำเร็จ';
    displayOcrResults(parsedData);
    
  } catch (error) {
    console.error(error);
    statusEl.innerText = 'เกิดข้อผิดพลาดในการประมวลผลไฟล์: ' + error.message;
  }
}

async function extractTextFromPDF(file) {
  // Ensure pdfjsLib is loaded
  if (!window.pdfjsLib) {
    throw new Error('PDF.js library is not loaded.');
  }
  
  // Set worker
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
  
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    
    // Group by Y coordinate to form lines
    let lastY = -1;
    let pageText = '';
    for (const item of content.items) {
      // If Y changes by more than a threshold, it's a new line
      if (lastY === -1 || Math.abs(lastY - item.transform[5]) > 4) {
        pageText += '\n';
        lastY = item.transform[5];
      }
      pageText += item.str + ' ';
    }
    fullText += pageText + '\n';
  }
  
  return fullText;
}

function parseCR60Text(text) {
  const lines = text.split('\n');
  const results = [];
  
  let currentSem = null;
  let currentYear = null;
  
  const semRegex = /(1ST|2ND|SUMMER)\s+SEMESTER\s+(\d{4})/i;
  // Match: "2765133 LRN PSY ED TECH 2.0 A" or "2765133 LRN PSY ED TECH 2 A"
  const courseRegex = /^\s*(\d{7})\s+(.+?)\s+(\d+(?:\.\d+)?)\s+([A-D]\+?|[FWSUPI])\s*$/i;

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    
    // Check for semester header
    const semMatch = line.match(semRegex);
    if (semMatch) {
      const semStr = semMatch[1].toUpperCase();
      currentSem = semStr === '1ST' ? 1 : semStr === '2ND' ? 2 : 3;
      
      let year = parseInt(semMatch[2]);
      if (year < 2500) year += 543; // Convert AD to BE
      currentYear = year;
      
      continue;
    }
    
    // Check for course row
    if (currentSem && currentYear) {
      const courseMatch = line.match(courseRegex);
      if (courseMatch) {
        const code = courseMatch[1];
        const nameEn = courseMatch[2].trim();
        const credits = parseFloat(courseMatch[3]);
        const grade = courseMatch[4].toUpperCase();
        
        // Find category from curriculum
        const currData = findCourseByCode(code);
        let category = 'FREE_ELEC'; // Default to free elective
        let courseName = nameEn;
        
        if (currData) {
          category = currData.category;
          courseName = currData.course_name;
        } else if (code.startsWith('5500') || code.startsWith('22')) {
          category = 'GE_LANG_EN'; // Fallback heurustics
        }
        
        results.push({
          academicYear: currentYear,
          semester: currentSem,
          courseCode: code,
          courseName: courseName,
          credits: credits,
          grade: grade,
          category: category,
          isManual: !currData
        });
      }
    }
  }
  
  return results;
}

function displayOcrResults(data) {
  currentOcrData = data;
  document.getElementById('ocr-count').innerText = data.length;
  
  const tbody = document.getElementById('ocr-preview-tbody');
  tbody.innerHTML = '';
  
  data.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.semester}/${item.academicYear}</td>
      <td>${item.courseCode}<br><small style="color:var(--text-muted)">${item.courseName}</small></td>
      <td><span class="badge badge-success">${item.grade}</span></td>
      <td>${CATEGORY_LABELS[item.category] || item.category}</td>
    `;
    tbody.appendChild(tr);
  });
  
  document.getElementById('ocr-results').style.display = 'block';
  document.getElementById('btn-ocr-confirm').disabled = false;
}

async function confirmOcrImport() {
  if (currentOcrData.length === 0) return;
  
  const btn = document.getElementById('btn-ocr-confirm');
  btn.innerText = 'กำลังบันทึก...';
  btn.disabled = true;
  
  try {
    // 1. Get existing semesters to avoid duplicates
    const resSem = await API.getSemesters(currentUser.user_id);
    const existingSems = resSem.success ? resSem.data : [];
    
    // Extract unique semesters from OCR
    const uniqueSems = {};
    currentOcrData.forEach(item => {
      const key = `${item.academicYear}-${item.semester}`;
      uniqueSems[key] = { year: item.academicYear, sem: item.semester };
    });
    
    // Create mapping of year-sem to semester_id
    const semIdMap = {};
    
    for (const key in uniqueSems) {
      const s = uniqueSems[key];
      const found = existingSems.find(ex => ex.academic_year === s.year && ex.semester === s.sem);
      
      if (found) {
        semIdMap[key] = found.semester_id;
      } else {
        // Add new semester
        const createRes = await API.addSemester({
          userId: currentUser.user_id,
          academicYear: s.year,
          semester: s.sem
        });
        if (createRes.success) {
          semIdMap[key] = createRes.data.semester_id;
        }
      }
    }
    
    // 2. Get existing enrollments to avoid duplicate courses
    let existingEnrollments = [];
    for (const key in semIdMap) {
       const enrRes = await API.getEnrollments(currentUser.user_id, semIdMap[key]);
       if (enrRes.success) {
           existingEnrollments = existingEnrollments.concat(enrRes.data);
       }
    }
    const existingCodes = new Set(existingEnrollments.map(e => e.course_code));
    
    // 3. Batch Add enrollments
    const newEnrollments = [];
    for (const item of currentOcrData) {
      if (!existingCodes.has(item.courseCode)) {
        const semId = semIdMap[`${item.academicYear}-${item.semester}`];
        if (semId) {
          newEnrollments.push({
            semesterId: semId,
            courseCode: item.courseCode,
            courseName: item.courseName,
            credits: item.credits,
            grade: item.grade,
            category: item.category,
            isManual: item.isManual
          });
        }
      }
    }
    
    if (newEnrollments.length > 0) {
      const batchRes = await API.batchAddEnrollments({
        userId: currentUser.user_id,
        enrollments: newEnrollments
      });
      
      if (!batchRes.success) {
        throw new Error(batchRes.message || 'Failed to batch import enrollments');
      }
    }
    
    closeOcrModal();
    showToast('นำเข้าข้อมูลรายวิชาเรียบร้อยแล้ว', 'success');
    
    // Refresh App
    if (typeof loadSemesters === 'function') {
      loadSemesters();
    }
    
  } catch (err) {
    console.error(err);
    showToast('เกิดข้อผิดพลาด: ' + err.message, 'error');
    btn.innerText = 'นำเข้าข้อมูล';
    btn.disabled = false;
  }
}
